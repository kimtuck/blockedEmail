const log = (s) => document.getElementById("debug").textContent = s;
let errored = false;

const blockedContacts = async () => {
    const blockedAddressesBook = (await messenger.addressBooks.list(true)).find(x => x.name === "Blocked Email Addresses");
    const contacts = blockedAddressesBook.contacts;
    return { contacts, blockedAddressesBook };
}

const blockedEmailFolder = async () => {
    const accounts = await messenger.accounts.list();
    return accounts.reduce((accum, account) => {
        const folder = account.folders.reduce((accum, folder) => {
            if (folder.name === 'Blocked From Inbox') {
                accum = folder;
                //log('found folder')
            }
            return accum;
        },null);
        if (folder) {
            accum = folder;
        }
        return accum;
    },null);
}

log('Working...')

let tabs = await messenger.tabs.query({ active: true, currentWindow: true });
let message = await messenger.messageDisplay.getDisplayedMessage(tabs[0].id);
let from = message.author;

const { contacts, blockedAddressesBook } = await blockedContacts();
const existingBlockedAddress = contacts.find(c => c.properties.DisplayName === from);
if (!existingBlockedAddress) {
    try {
        await messenger.contacts.create(blockedAddressesBook.id, null, { DisplayName: from })
    }
    catch(e) {
        log('err ' + e)
        errored = true;
    }
}

if (!errored) {
    try {
        const destinationFolder = await blockedEmailFolder();
        await messenger.messages.move([message.id], destinationFolder);
    log("Sender " + from + " has been blocked")
    }
    catch(e) {
        log('err ' + e)
        errored = true;
    }
}