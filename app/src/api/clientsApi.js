const apiURL=process.env.REACT_APP_API_URL
console.log(apiURL)
const apiCreateUser=apiURL + "clients/";
const apiGetClients=apiURL + "clients/";
const apiGetAllArchiveClient=apiURL + "clients/archived"
const apiUpdateClient=apiURL + "clients/"
const apiGetCountries=apiURL + "countries/"
const apiArchiveClient =apiURL + "clients";

const apiExportClient =apiURL + "clients/export";
const apiSearchByName =apiURL + "clients/search";
// const Api2 =apiURL + "";

export {apiCreateUser,apiUpdateClient,apiGetClients,apiGetAllArchiveClient,apiSearchByName,apiGetCountries, apiArchiveClient,apiExportClient };
