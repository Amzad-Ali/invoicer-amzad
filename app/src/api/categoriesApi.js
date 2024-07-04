const apiURL=process.env.REACT_APP_API_URL
const apiCreateCategory = apiURL + "items/categories";
const apiUpdateCategory = apiURL + "items/categories";
const apiGetCategoryById = apiURL + "items/categories";
const apiGetCategories = apiURL + "items/categories";
const apiArchiveCategory = apiURL + "items/categories";
const apiGetArchiveCategories = apiURL + "items/archived";
const apiSearchCategoryByName =apiURL + "items/search";
const apiDeleteSubcategory = apiURL + "items/categories/:categoryId/subcategories/:subcategoryId";
const apiCopyCategory = apiURL + "items/categories/:categoryId/copy";
const apiGetSubcategories = apiURL + "items/categories/:categoryId/subcategories/:subcategoryId";

export {
    apiCreateCategory,
    apiUpdateCategory,
    apiGetCategoryById,
    apiGetCategories,
    apiArchiveCategory,
    apiGetArchiveCategories,
    apiSearchCategoryByName,
    apiDeleteSubcategory,
    apiCopyCategory,
    apiGetSubcategories
};
