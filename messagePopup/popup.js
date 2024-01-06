let errored = false;
let log = (s) => document.getElementById("debug").textContent = s;

let tabs = await messenger.tabs.query({ active: true, currentWindow: true });
let message = await messenger.messageDisplay.getDisplayedMessage(tabs[0].id);
let from = message.author;

const accounts = await messenger.accounts.list();
const blockedEmailFolder = accounts.reduce((accum, account) => {
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

const blockedAddressesBook = (await messenger.addressBooks.list(true)).find(x => x.name === "Blocked Email Addresses");
const contacts = blockedAddressesBook.contacts;
const existingBlockedAddress = contacts.find(c => c.properties.DisplayName === from);
if (!existingBlockedAddress) {
    try {
        await messenger.contacts.create(blockedAddressesBook.id, null, { DisplayName: from })
    }
    catch(e) {
        log('err ' + e)
        errored = false;
    }
}

if (!errored) {
    try {
    await messenger.messages.move([message.id], blockedEmailFolder);
    log("Sender " + from + " has been blocked")
    }
    catch(e) {
        log('err ' + e)

    }
}