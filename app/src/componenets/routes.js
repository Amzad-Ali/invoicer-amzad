import { Routes, Route } from "react-router-dom";
import CreateClient from "../Pages/Client/CreateClient";
import EditClient from "../Pages/Client/EditClient";
import ListClient from "../Pages/Client/ListClient";
import NotFound from "../Pages/NotFound";
import ListCategories from "../Pages/Categories/ListCategories";
import CreateCategory from "../Pages/Categories/CreateCategory";
import ListItem from "../Pages/Items/ListItems";
import EditItem from "../Pages/Items/EditItem";
import ListTax  from "../Pages/Taxes/ListTaxes";
import CreateItem from "../Pages/Items/CreateItem";
import EditCategory from "../Pages/Categories/EditCategory";
import CreateTax from "../Pages/Taxes/CreateTax";
import EditTax from "../Pages/Taxes/EditTax"
import CreateEstimate from "../Pages/Estimate/CreateEstimate";
import Account from "../Pages/settings/account";
import Application from "../Pages/settings/application";

export default function Routess(){
    return (
        <Routes>
            <Route path="/clients/new" element={<CreateClient/>}/>
            <Route path="/clients" element={<ListClient />} />
            <Route path="/clients/edit/:id" element={<EditClient/>}/>
            <Route path="/invoices" element={<NotFound/>}/>
            <Route path="/items" element={<ListItem />} />
            <Route path="/taxes" element={<ListTax />} />
            <Route path="/categories" element={<ListCategories />}/>
            <Route path="/categories/new" element={<CreateCategory />} />
            <Route path="/categories/edit/:id" element={<EditCategory />} />
            <Route path="/items/new" element={<CreateItem />} />
            <Route path="/items/edit/:id" element={<EditItem/>}/>
            <Route path="/taxes/new" element={<CreateTax />} />
            <Route path="/taxes/edit/:id" element={<EditTax />} />
            <Route path="/estimates/new" element={<CreateEstimate />} />

            <Route path="/settings/application" element={<Application/>}/>
            <Route path="/settings/account" element={<Account/>}/>
        </Routes>
    )
}


