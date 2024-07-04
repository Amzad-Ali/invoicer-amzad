const apiURL=process.env.REACT_APP_API_URL

const apiCreateAccount = apiURL + "settings/account";
const apiFetchAccount = apiURL + "settings/account";
const apiGetAccountById = apiURL + "settings/accountId";
const apiUpdateAccount = apiURL + "settings/account/";

// uploadFiles
const uploadFile = apiURL + "settings/upload";

export {
    apiCreateAccount,
    apiUpdateAccount,
    apiGetAccountById,
    apiFetchAccount,
    uploadFile,
};
