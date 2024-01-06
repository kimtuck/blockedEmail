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

//export default blockedEmailFolder;
