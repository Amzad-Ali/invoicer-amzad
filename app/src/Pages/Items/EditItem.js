import React, { useState, useEffect } from 'react';
import { OutlinedInput } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { createItem, updateItem, getItemById } from '../../actions/itemAction.js';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getCategories } from '../../actions/categoryAction.js';
import InputLabel from '@mui/material/InputLabel';
import { getTaxes } from '../../actions/taxAction.js';
import { Multiselect } from 'multiselect-react-dropdown';

export default function EditItem() {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState({});
  const [id, setId] = useState('');
  const [taxable, setTaxable] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const params = useParams();
  const itemId = params.id;
  const [skuInputVisible, setSkuInputVisible] = useState(false);
  const [categoryInputVisible, setCategoryInputVisible] = useState(false);
  const [costInputVisible, setCostInputVisible] = useState(false);
  const [showTaxInput, setShowTaxInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedSubcategory, setSelectedsubCategory] = useState('');
  const [subcategoriesData, setsubctegoriesData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [taxOptions, setTaxOptions] = useState([]);
  const [selectedTaxes, setSelectedTaxes] = useState([]);

  const [selectedSubcategoryId,setSelectedSubcategoryId]=useState();
  const[taxesfrombackend,setTaxesFromBackend]=useState();
  const[alreadySelectedTaxesNames,setAlreadySelectedTaxNames]=useState();
  const[alreadySelectedTaxesIds,setAlreadySelectedTaxIds]=useState();
  const [filteredTaxIds, setFilteredTaxIds] = useState();
 

// console.log(taxOptions);

//   console.log(itemId);
// console.log(selectedTaxes);
// console.log(taxesselectedids);
// console.log(alreadySelectedTaxesNames);
// console.log(selectedTaxes);
// console.log(filteredTaxIds);
// // console.log(taxesfrombackend);
// console.log(alreadySelectedTaxesIds)


  const handleTaxButtonChange = () => {
    setTaxable(!taxable);
  };

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



  const addTax = () => {
    console.log("addtaxclicked");
    const newTax = {
      id: taxes,
      name: '',
    };
    setTaxes([...taxes, newTax]);
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
  // console.log(categoriesData);


  useEffect(() => {
    console.log("we are at use effect1");
    fetchData();
    fetchTaxOptions();
    console.log("we are at use effect2");
  }, []);


  useEffect(() => {
    const fetchItemData = async () => {

  
      console.log("mksk");
      try {
        const taxes = await getTaxes();
        console.log(taxes);
        setTaxesFromBackend(taxes);


        if (itemId) {
          const fetchedItem = await dispatch(getItemById(itemId));
          console.log(fetchedItem.category);
          // console.log(categoriesData);
          console.log(fetchedItem.taxes)
         

          // console.log(fetchedItem.taxes);
          setAlreadySelectedTaxIds(fetchedItem.taxes);
          const arr=fetchedItem.taxes.map((element)=>{
return element
          })
          console.log(arr);

console.log(alreadySelectedTaxesIds);
          const filteredTaxes = taxes.filter(tax => arr.includes(tax._id))
          console.log(filteredTaxes);

          
          setAlreadySelectedTaxNames(filteredTaxes);

          const output = categoriesData.map((category) => {
              return category
          });
          console.log(output);
          formik.setValues({
            name: fetchedItem.name || '',
            description: fetchedItem.description || '',
            price: fetchedItem.price || '',
            sku: fetchedItem.sku || '',
            // category: fetchedItem.category || '',
            // subcategory: fetchedItem.subcategory||'',
            cost: fetchedItem.cost || '',
            taxable: fetchedItem.taxable || false,
            taxes: fetchedItem.taxes || [],
            item_id: itemId,
          });
          setSkuInputVisible(!!fetchedItem.sku);
          setCostInputVisible(!!fetchedItem.cost);
          setCategoryInputVisible(!!fetchedItem.category);
          setShowTaxInput(!!fetchedItem.taxes);
          setTaxable(fetchedItem.taxable || false);
          // console.log("fetched item data",fetchedItem)
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };
    fetchItemData();
    // console.log(fetchItemData());
  }, [dispatch, itemId]);

  const fetchData = async () => {
    try {
      const categories = await getCategories();
      setCategoriesData(categories);
      const taxes=await  getTaxes();
      setTaxOptions(taxes);
    } catch (error) {
      console.error('Error fetching categories clients:', error);
    }
  };

  const fetchTaxOptions = async () => {
    try {
      const taxes = await getTaxes();
      // setTaxesFromBackend(taxes);
      setTaxOptions(taxes.map(tax => ({ name: tax.name })));
    } catch (error) {
      console.error('Error fetching taxes:', error);
    }
  };

  const updateFilteredTaxids = (selectedList) => {
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
    sku: '',
    category: selectedCategory,
    subcategory:selectedSubcategoryId,
    cost: '',
    taxable: false,
    taxes: [],
    item_id: id
  },
  validationSchema: validationSchema,
  
  });
  
  const updateItemData =async (data) => {
  try {
  const UpdatedData=await  dispatch(updateItem(itemId, data));
  console.log("datausingUpdateItem",UpdatedData);
  } catch (error) {
    console.error('Error updating item:', error);
  }
  };
  
  const handleFormChange = (event, field) => {
  const { value } = event.target;
  formik.handleChange(event);
  const updatedData = { ...formik.values, [field]: value };
  updateItemData(updatedData);
  };

  const handleSelectedSubcategory=async(e)=>{

    const selectedsubcategoryname=e.target.value;
    console.log(e.target.value);
    setSelectedsubCategory(e.target.value);
    console.log(subcategoriesData);
    const getSubcategoryId=subcategoriesData.filter((data)=>{
    return data.name===selectedsubcategoryname
    })
    console.log(getSubcategoryId);
    const selectedsubcategoryidbyname=getSubcategoryId[0]._id
    
    console.log(selectedsubcategoryidbyname);
    setSelectedSubcategoryId(selectedsubcategoryidbyname);
    }

    const handleBlur = async (event) => {
      console.log("handleblur")
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
          // If id exists, it means we are updating an existing item
          const payload = {
            itemId: itemId,
            itemData: updatedValues
          };
      const datausingBlur=    await dispatch(updateItem(payload));
      console.log("datausingBlur",datausingBlur)
        
      } catch (error) {
        console.error('Error updating item:', error);
      }
    };

  return (
    <section>
     <div className='new-item-container'>
  <p className='header-p' id="new-item-text">Edit Item</p>
  <div className='green-div'>
    <Button id="new-item-button" component={RouterLink} to='/items/new' className='green-btn' variant='contained' color='success'>
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
            id='name'
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
  <div className='form-div'  onBlur={handleBlur} style={{ width: '85%' }}>
    <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5', marginTop: '40px' }}>addCategory</InputLabel>
    <Select
    
      labelId="category-label"
      id="category"
      value={selectedCategory}
      onChange={handleSelectedCategory}
      //setSelectedCategory(e.target.value)
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
    <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5'}}>addSubcategory</InputLabel>
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
        <div className='form-div' style={{ marginTop: '40px' }}>
        <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5',marginTop: '40px' }}>addcost</InputLabel>
          <OutlinedInput
            className='div-outlined'
            type='number'
            id='cost'
            name='cost'
            value={formik.values.cost}
            onBlur={handleBlur}
            onChange={formik.handleChange}
            
          /></div>
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
          <InputLabel htmlFor='name' className="input-label" style={{ color: '#3f51b5' }}>Select Tax</InputLabel>
          <Multiselect
  options={taxOptions}
  selectedValues={alreadySelectedTaxesNames}
  displayValue="name" // Specify the property name to display
  labelId="tax-label"
  id="tax"
  value={selectedTaxes} // Use selectedTaxes array here
  
  onSelect={handleTaxSelection}
  onRemove={handleTaxDeselection}
  
//   {(selectedList) => formik.setFieldValue('taxes', selectedList)} 
  fullWidth
  placeholder="Select Tax"
/>

                 

         
       
       </div>)}


          </>
        }
       
      
      </form>
    </section>
  );
}

