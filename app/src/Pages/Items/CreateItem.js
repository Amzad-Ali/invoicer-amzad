import React, { useState,useEffect } from 'react';
import { OutlinedInput } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { Link as RouterLink, useParams, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { createItem, updateItem } from '../../actions/itemAction.js';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getCategories } from '../../actions/categoryAction.js';
import InputLabel from '@mui/material/InputLabel';
import { getTaxes } from '../../actions/taxAction.js';
import {Multiselect} from 'multiselect-react-dropdown';

export default function CreateItem() {
  const dispatch = useDispatch();
  const [id, setId] = useState();
  const [taxable, setTaxable] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const location = useLocation();
  const [skuInputVisible, setSkuInputVisible] = useState(false);
  const [categoryInputVisible, setCategoryInputVisible] = useState(false);
  const [costInputVisible, setCostInputVisible] = useState(false);
  const [showTaxInput, setShowTaxInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [categoriesData,setCategoriesData]=useState([]);
  const [selectedSubcategory, setSelectedsubCategory] = useState();
  const [subcategoriesData,setsubctegoriesData]=useState([]);
  const [selectedCategoryId,setSelectedCategoryId]=useState('');
  const [selectedSubcategoryId,setSelectedSubcategoryId]=useState();
  const [taxOptions, setTaxOptions] = useState([""]);
  const [selectedTaxes, setSelectedTaxes] = useState([]);
  const [filteredTaxIds, setFilteredTaxIds] = useState([]);

 const params=useParams();
//  console.log(params);
const itemId=params.id;
console.log(selectedSubcategory);

console.log(subcategoriesData);

console.log(selectedTaxes);
useEffect(() => {

    fetchData();
    
   fetchTaxOptions();
    // console.log("we are at use effect2")
  }
,[]);

const updateFilteredTaxids = (selectedList) => {
  console.log(selectedList);
  const filteredIds = selectedList.map(tax => tax._id);
    setFilteredTaxIds(filteredIds);
};
const handleTaxSelection = (selectedList) => {
  setSelectedTaxes(selectedList);
  updateFilteredTaxids(selectedList);
};

const handleTaxDeselection = (selectedList, removedItem) => {
  setSelectedTaxes(selectedList.filter(item => item !== removedItem));
  updateFilteredTaxids(selectedList.filter(item => item !== removedItem));
};

// console.log(filteredTaxIds);

// Call the function to get filtered tax IDs and update state
 // This should give you the object IDs of selected taxes
 // This will give you the object IDs of selected taxes


// console.log(showTaxInput);
const fetchData = async () => {
  try {
    const categories = await getCategories();

    const taxes=await getTaxes();
    
    // console.log(ids);
    setTaxOptions(taxes);

    // console.log(itemids);

    // console.log(taxes.name);
    // console.log(categories);
    categories.forEach((category)=>{
    //   console.log(category._id);
    })

// console.log(categoryIds); // This will log an array containing the _id values of all categories

   
    setCategoriesData(categories);
    

  } catch (error) {
    console.error('Error fetching categories clients:', error);
  }
};


const fetchTaxOptions = async () => {
    try {
        const taxes = await getTaxes();
        setTaxOptions(taxes.map(tax => ({ name: tax.name }))); // Map taxes to an array of objects with name property
    } catch (error) {
        console.error('Error fetching taxes:', error);
    }
};
  


  
const handleTaxButtonChange=()=>{
  console.log(taxable);
  setTaxable(!taxable);
  console.log(taxable);

}
// console.log(taxable);

const handleSelectedCategory=async (e) => {
setSelectedCategory(e.target.value);

// console.log(e.target.value);
// const nameofcategory=e.target.value;

  try {
    const categories = await getCategories();
console.log(categories);

    const getsubcategory=(categoryname)=>{
const category=categories.find(cat=>cat.name===categoryname);
// console.log(category);
return category ? category.subcategories : [];
    }

   
    const nameofcategory = e.target.value;

    // Define the function
    const getCategoryIdByName = (categories, name) => {
        const foundObj = categories.find(obj => obj.name === name);
        return foundObj ? foundObj._id : null;
        // console.log(foundObj)
    };
    
  
    const categoryId2 = getCategoryIdByName(categories, nameofcategory);
    console.log(categoryId2);
setSelectedCategoryId(categoryId2);
    
    const categoryName =e.target.value;
    const subcategories = getsubcategory(categoryName);
   


setsubctegoriesData(subcategories);
    setCategoriesData(categories);
  } catch (error) {
    console.error('Error fetching categories clients:', error);
  }

}
const handleSelectedSubcategory=async(e)=>{

const selectedsubcategoryname=e.target.value;
console.log(e.target.value);

console.log(subcategoriesData);
const getSubcategoryId=subcategoriesData.filter((data)=>{
return data.name===selectedsubcategoryname
})
console.log(getSubcategoryId);
const selectedsubcategoryidbyname=getSubcategoryId[0]._id

console.log(selectedsubcategoryidbyname);
setSelectedSubcategoryId(selectedsubcategoryidbyname);
}





const handleNewItemButtonClick = () => {
  window.location.reload(); // Reload the page when the user clicks on the "New Item" button
};



  const addTax = async() => {

    setShowTaxInput(true);
  };



  const showInputofButtons = (input) => {
    fetchData();
    switch (input) {
      case 'sku':
        setSkuInputVisible(true);
        break;
      case 'category':
        
        setCategoryInputVisible(true);
        break;
      case 'cost':
        setCostInputVisible(true);
        break;
      default:
        break;
    }
  };
  console.log(taxable);
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: Yup.string(),
  price: Yup.number(),
  taxes: Yup.array()
});

const formik = useFormik({
  initialValues: {
    name: '',
    description: '',
    price: '',
    sku:'',
    category:selectedCategory,
    subcategory:selectedSubcategoryId,
    cost:'',
    taxable:false,
    taxes: [],
    itemId: itemId
  },
  validationSchema: validationSchema
});
const handleBlur = async (event) => {
  formik.handleBlur(event);

  try {
    // Update formik values with selected category and taxes
    formik.setFieldValue('category', selectedCategoryId);
    formik.setFieldValue('subcategory',selectedSubcategoryId)
    formik.setFieldValue('taxes', filteredTaxIds);
    formik.setFieldValue('taxable', taxable);
    
    // Retrieve updated form values after setting them
    const updatedValues = formik.values;
    console.log(updatedValues);

    if (id) {
      // If id exists, it means we are updating an existing item
      const payload = {
        itemId: id,
        itemData: updatedValues
      };
      await dispatch(updateItem(payload));
    } else {
    
  
      // Retrieve updated form values after setting them

      console.log(updatedValues);
      // If id doesn't exist, it means we are creating a new item
      const response = await dispatch(createItem(updatedValues));
      const newItemId = response.payload._id;
      setId(newItemId);
    }
  } catch (error) {
    console.error('Error updating item:', error);
  }
};

useEffect(() => {
  const fetchItemDetails = async () => {
    try {
      const { copyItem } = location.state || {};
      if (copyItem) {
        formik.setValues({
          name: copyItem.name,
          description: copyItem.description,
          price: copyItem.price,
          taxable: copyItem.taxable,
          sku: copyItem.sku || '',
          cost: copyItem.cost || '',
          category: copyItem.category || '',
          taxes: copyItem.taxes,
          item_id: copyItem._id,
        });
        setSkuInputVisible(!!copyItem.sku);
        setCostInputVisible(!!copyItem.cost);
        setCategoryInputVisible(!!copyItem.category);
        setShowTaxInput(!!copyItem.taxes);

        setTaxable(copyItem.taxable || false);

        // Call these functions to handle category and subcategory data
        if (copyItem.category) {
          handleSelectedCategory({ target: { value: copyItem.category.name } });
        }
        if (copyItem.subcategory) {
          handleSelectedSubcategory({ target: { value: copyItem.subcategory.name } });
        }
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  fetchItemDetails();
}, [dispatch, location.state]);



  return (
    <section>
     <div className='new-item-container'>
  <p className='header-p' id="new-item-text">New Item</p>
  <div className='green-div'>
    <Button id="new-item-button" component={RouterLink} to='/items/new' onClick={handleNewItemButtonClick} className='green-btn'  variant='contained' color='success'>
      new item
    </Button>
  </div>
</div>

      <form>
        <div className='form-div'>
        <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5' }}>Name</InputLabel>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id="name"
            name='name'
            value={formik.values.name}
            onBlur={handleBlur}
            onChange={formik.handleChange}
            
            required
          />
          {formik.touched.name && formik.errors.name ? (
            <div style={{ color: 'red' }}>{formik.errors.name}</div>
          ) : null}

        </div>

        <div className='form-div'>
        <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5' }}>Description</InputLabel>
          <OutlinedInput
            className='div-outlined'
            type='text'
            id='description'
            name='description'
            value={formik.values.description}
            onBlur={handleBlur}
            onChange={formik.handleChange}
            
          />
        </div>


        <div className='add-button'>
          {!skuInputVisible && (
            <div>
<button className='add-sku' onClick={() => showInputofButtons('sku')} style={{ marginTop: '40px' }}>+ Add SKU</button>
            </div>
          )}
            {skuInputVisible && (
          <div className='form-div'>
            <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5', marginTop: '40px' }}>addSKU</InputLabel>
            <OutlinedInput
              className='div-outlined'
              type='text'
              id='sku'
              name='sku'
             value={formik.values.sku}
              onBlur={handleBlur} // Submit form onBlur of SKU field
              onChange={formik.handleChange}
              style={{marginTop:'0px'}}
            />
          </div>
        )}
         <div className='hi'> {!categoryInputVisible && (
            <div>
              
              <button className='add-category' onClick={() => showInputofButtons('category')} style={{ marginTop: '30px' }}>+ Add Category</button>
            </div>
          )}
          
          {categoryInputVisible && (
  <div className='form-div' style={{ width: '85%',marginTop:'30px',marginBottom:'30px' }}>
  {categoryInputVisible && (
  <div className='form-div' style={{ width: '85%' }}>
    <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5', marginTop: '40px' }}>addCategory</InputLabel>
    <Select
    onBlur={handleBlur}
      labelId="category-label"
      id="category"
      value={selectedCategory}
      onChange={handleSelectedCategory}//setSelectedCategory(e.target.value)
      fullWidth // Make the Select component take the full width
      placeholder="Select Category"
    >
      
      {categoriesData && categoriesData.map((category) => (
        <MenuItem key={category.id} value={category.name}>
          {category.name}
        </MenuItem>
      ))}
   </Select>

    
    {selectedCategory && 
    <div onBlur={handleBlur}  style={{ marginTop:'12px' }}>
    <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5',marginTop:5}}>addSubcategory</InputLabel>
    <Select
      labelId="subcategory-label"
      id="subcategory"
      value={selectedSubcategory}
      onChange={handleSelectedSubcategory}
      fullWidth // Make the Select component take the full width
      placeholder="Select Category"
      
    >
      {subcategoriesData && subcategoriesData.map((subcategory,index) => (
        <MenuItem key={subcategory.id} value={subcategory.name}>
          {subcategory.name}
        </MenuItem>
      ))}
    </Select>
    </div>}
  </div>
)}


  </div>
)}
</div>
          {!costInputVisible && (
            <div style={{ marginTop:'30px' }}>
              <button className='add-cost' onClick={() => showInputofButtons('cost')}>+ Add Cost</button>
            </div>
          )}
           {costInputVisible && (
          <div className='form-div'>
                <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5', marginTop:30}}>addCost</InputLabel>

            <OutlinedInput
              className='div-outlined'
              type='text'
              id='cost'
              name='cost'
              value={formik.values.cost}
              placeholder=''
              onBlur={handleBlur} // Submit form onBlur of SKU field
              onChange={formik.handleChange}
            />
          </div>
        )}
        </div>
        <div className='form-div'>
        <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5'}}>price</InputLabel>

          <OutlinedInput
            className='div-outlined price'
            type='number'
            id='price'
            name='price'
            value={formik.values.price}
            onBlur={handleBlur} // Submit form onBlur of price field
            onChange={formik.handleChange}
           
            required
          />
        </div>
<div className='container-taxable-addtax'>
<div className='form-div'>
          <label htmlFor='taxable' id="taxable-text">Taxable </label>
          <FormControlLabel
            control={
              <Switch
                checked={taxable}
                onChange={handleTaxButtonChange}
                onBlur={handleBlur}
                id='taxable'
                name='taxable'
                color='primary'
              />
            }
          />
        </div>
       
        
       {taxable &&
         <div className='green-div'>
         <Button id="new-tax-button" component={RouterLink} to='/taxes/new' className='green-btn' variant='contained' color='success'>
           new tax
         </Button>
       </div>
       }
</div>
       
{taxable &&
          <>
           <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
          <div className='header-s' id='tax'>Taxes</div>
          <div className='green-div'>
            <Button onClick={addTax} className='green-btn' id='add-tax-button' variant='contained' color='success'>
              Add Tax
            </Button>
          </div>
        </div>
        
        {showTaxInput && (
          <div onBlur={handleBlur} className='form-div' style={{ width: '85%',marginTop:'30px',marginBottom:'30px' }}>

          <Multiselect
  options={taxOptions}
  displayValue="name" // Specify the property name to display
  labelId="tax-label"
  id="tax"
  value={selectedTaxes} // Use selectedTaxes array here
  
  onSelect={handleTaxSelection}
  onRemove={handleTaxDeselection}
  fullWidth
  placeholder="ADD TAX"
/>

                 

         
       
       </div>)}


          </>
        }
       
      </form>
    </section>
  );
}