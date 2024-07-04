import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Box, OutlinedInput } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { IoCopyOutline } from "react-icons/io5";
import { VscEdit } from "react-icons/vsc";
import { PiFolderOpen } from "react-icons/pi";
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { getCategories, archiveCategory, getCategoriesByName, getArchiveCategories, getCategoryById, getSubcategories } from '../../actions/categoryAction'; // Update import statement
import { useDispatch } from 'react-redux';

export default function ListCategories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('active'); // 'active' or 'archive'
  const [openSubcategories, setOpenSubcategories] = useState(null); // State to track open subcategories
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let fetchedCategories;
        if (searchTerm.trim() !== '') {
          fetchedCategories = await getCategoriesByName(searchTerm.trim());
        } else if (mode === 'archive') {
          fetchedCategories = await getArchiveCategories();
        } else {
          fetchedCategories = await getCategories();
        }

        setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [mode, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleListCategories = (newMode) => {
    setMode(newMode);
  };

  const handleArchiveCategory = async (categoryId) => {
    console.log('Archiving category:', categoryId);
    try {
      await dispatch(archiveCategory({ categoryId, isArchive: true }));
      await refreshCategories();
    } catch (error) {
      console.error('Error archiving category:', error);
    }
  };

  const handleUnarchiveCategory = async (categoryId) => {
    console.log('Unarchiving category:', categoryId);
    try {
      await dispatch(archiveCategory({ categoryId, isArchive: false }));
      await refreshCategories();
    } catch (error) {
      console.error('Error unarchiving category:', error);
    }
  };

  const handleCopyCategory = async (categoryId) => {
    console.log('Copying category:', categoryId);
    try {
      const categoryDetails = await dispatch(getCategoryById(categoryId));
      navigate('/categories/new', { state: { copyCategory: categoryDetails } });
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };

  const handleOpenSubcategories = async (categoryId) => {
    try {
      const subcategories = await dispatch(getSubcategories(categoryId));
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category._id === categoryId ? { ...category, isOpen: !category.isOpen } : category
        )
      );
      setOpenSubcategories(subcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCloseSubcategories = () => {
    setOpenSubcategories(null);
  };

  const refreshCategories = async () => {
    try {
      let fetchedCategories;
      if (searchTerm.trim() !== '') {
        fetchedCategories = await getCategoriesByName(searchTerm.trim());
      } else if (mode === 'archive') {
        fetchedCategories = await getArchiveCategories();
      } else {
        fetchedCategories = await getCategories();
      }

      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <section>
      <Box>
        <div className='btn-div'>
          <div className='client-div'>
            <Typography sx={{ fontSize: '1.5rem' }}>Categories</Typography>
            <div className='btn-row'>
              <Button
                className='btn-archieve btn-all'
                variant="outlined"
                color='primary'
                sx={{
                  minWidth: '130px',
                  mr: '10px',
                  color: mode === 'active' ? 'white' : 'darkgray',
                  backgroundColor: mode === 'active' ? 'darkgray' : 'transparent',
                  borderColor: 'darkgray',
                  '&:hover': {
                    backgroundColor: 'darkgray',
                    borderColor: 'darkgray',
                    color: 'white',
                  },
                  '@media (max-width: 600px)': {
                    minWidth: '70px'
                  },
                }}
                onClick={() => handleListCategories('active')}
              >
                All
              </Button>
              <Button
                variant="outlined"
                color='primary'
                className='btn-archieve'
                sx={{
                  minWidth: '130px',
                  color: mode === 'archive' ? 'white' : 'darkgray',
                  backgroundColor: mode === 'archive' ? 'darkgray' : 'transparent',
                  borderColor: 'darkgray',
                  '&:hover': {
                    borderColor: 'darkgray'
                  },
                  '@media (max-width: 600px)': {
                    minWidth: '70px',
                  },
                }}
                onClick={() => handleListCategories('archive')}
              >
                Archive
              </Button>
            </div>
          </div>

          <div className='green-div'>
            <Button
              component={RouterLink}
              to='/categories/new'
              className='green-btn'
              variant='contained'
              color='success'
            >
              Add Category
            </Button>
          </div>
        </div>
        <Box sx={{ pt: '15px', width: '100%' }}>
          <OutlinedInput
            placeholder='Search..'
            sx={{ width: '97%' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        <TableContainer sx={{ width: '97%', pt: '15px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category._id}>
                  <TableRow>
                    <TableCell>
                      <Link component={RouterLink} to={{ pathname: `/categories/edit/${category._id}`, state: { categoryId: category._id } }}>
                        {category.name}
                      </Link>
                    </TableCell>
                    <TableCell align="right">
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="select">select</InputLabel>
                        <Select labelId="demo-select-small-label" id="select" label="select">
                          <MenuItem>
                            <span>
                              <VscEdit /> <span><Link component={RouterLink} to={`/categories/edit/${category._id}`}> Edit Category</Link></span>
                            </span>
                          </MenuItem>
                          <MenuItem onClick={() => handleCopyCategory(category._id)}>
                            <span>
                              <IoCopyOutline /> <span>Copy</span>
                            </span>
                          </MenuItem>
                          <MenuItem onClick={() => handleOpenSubcategories(category._id)}>
                            <span>
                              <PiFolderOpen /> <span> Open Subcategories</span>
                            </span>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              if (category.archived) {
                                handleUnarchiveCategory(category._id);
                                window.alert(`Category "${category.name}" unarchived !`);
                              } else {
                                handleArchiveCategory(category._id);
                                window.alert(`Category "${category.name}" archived !`);
                              }
                            }}
                          >
                            <span>
                              <InventoryIcon /> <span>{category.archived ? 'Unarchive' : 'Archive'}</span>
                            </span>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  {category.isOpen && category.subcategories && category.subcategories.length > 0 && (
  category.subcategories.map((subcategory) => (
    <TableRow key={subcategory._id}>
      <TableCell style={{ paddingLeft: '40px' }}>{subcategory.name}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  ))
)}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {categories.length === 0 && (
          <Box>
            <Typography sx={{ textAlign: 'center', width: '97%', mt: '20px' }}>
              No records available
            </Typography>
            <Button
              component={RouterLink}
              to="/categories/new"
              variant="contained"
              color="success"
              sx={{ width: '97%', mt: '30px' }}
            >
              Create a Category
            </Button>
          </Box>
        )}
      </Box>
    </section>
  );
}