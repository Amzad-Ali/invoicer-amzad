const apiURL=process.env.REACT_APP_API_URL
console.log(apiURL)
const apiCreateTaxes=apiURL + "items/taxes";
const apiGetTaxes=apiURL + "items/taxes";
const apiGetSingleTax=apiURL + "items/taxes";
const apiEditTax=apiURL + "items/taxes";
const apiDeleteTax=apiURL+"items/taxes";
const apiArchiveTaxes=apiURL+"items/taxes";
const apiGetArchiveTaxes=apiURL+"items/taxes/archived";
const apiSearchTaxByName =apiURL + "items/taxes/search";
export {apiCreateTaxes,apiGetTaxes,apiGetSingleTax,apiEditTax,apiDeleteTax,apiArchiveTaxes,apiGetArchiveTaxes,apiSearchTaxByName};

// const apiCreateTax = "http://localhost:5000/api/items/taxes";
// const apiUpdateTax = "http://localhost:5000/api/items/taxes";

// export {
//     apiCreateTax,
//     apiUpdateTax
// };