let log = (s) => document.getElementById("debug").textContent = s;

let tabs = await messenger.tabs.query({ active: true, currentWindow: true });
let message = await messenger.messageDisplay.getDisplayedMessage(tabs[0].id);
let from = message.author;



const blockedAddressesBook = (await messenger.addressBooks.list(true)).find(x => x.name === "Blocked Email Addresses");
//document.getElementById("debug").textContent = JSON.stringify(blockedAddressesBook,null,4) +"x"
const contacts = blockedAddressesBook.contacts;
const existingBlockedAddress = contacts.find(c => c.properties.DisplayName === from);
log('here a ' + blockedAddressesBook.id)
if (!existingBlockedAddress) {
    try {
        await messenger.contacts.create(blockedAddressesBook.id, null, { DisplayName: from })
        log('Blocked ' + from)
    }
    catch(e) {
        log('err ' + e)
    }
}
