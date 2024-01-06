const blockedContacts = async () => {
    const blockedAddressesBook = (await messenger.addressBooks.list(true)).find(x => x.name === "Blocked Email Addresses");
    const contacts = blockedAddressesBook.contacts;
    return { contacts, blockedAddressesBook };
}

export { blockedContacts };
