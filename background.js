import * as messageTools from '/modules/messageTools.mjs';

messenger.messages.onNewMailReceived.addListener(async (folder, messages) => {

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

    try {
        const { contacts } = await blockedContacts();
        const movedMessages = [];

        for await (let message of messageTools.iterateMessagePages(messages)) {
            const existingBlockedAddress = contacts.find(c => c.properties.DisplayName === message.author);
            if (existingBlockedAddress) {
                const destinationFolder = await blockedEmailFolder();
                await messenger.messages.move([message.id], destinationFolder);
                movedMessages.push(message);
            }
        }
        //throw "send message 1" + movedMessages.length;
        if (movedMessages.length > 0) {
            setTimeout(() => {
                messenger.notifications.create({
                    "type": "basic",
                    //"iconUrl": "images/internet.png",
                    "title": 'Blocked Emails Moved',
                    "message": `${movedMessages.length} message${movedMessages.length > 1 ? 's' : ''} were moved to the "Blocked From Inbox" folder.`
                });
            }, 1000);
        }
    }
    catch(e) {
        messenger.notifications.create({
            "type": "basic",
            "iconUrl": "images/internet.png",
            "title": 'Error',
            "message": e
        });
    }
})