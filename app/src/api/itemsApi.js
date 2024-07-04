const apiURL=process.env.REACT_APP_API_URL

const apiCreateItem = apiURL + "items";
const apiUpdateItem = apiURL + "items";
const apiGetItemById = apiURL + "items";
const apiGetItems = apiURL + "items";
const apiArchiveItem = apiURL + "items";
const apiSearchItemByName = apiURL + "items/searchitem";
const apiCopyItem = apiURL + "items/:itemId/copy";
const apiGetArchivedItems = apiURL + "items/archiveditems";
const apiDeleteItem = apiURL + "items"

export {
    apiCreateItem,
    apiUpdateItem,
    apiGetItemById,
    apiGetItems,
    apiArchiveItem,
    apiSearchItemByName,
    apiCopyItem,
    apiGetArchivedItems,
    apiDeleteItem
};
