import React from 'react'
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Box, OutlinedInput } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { RiDeleteBinLine } from "react-icons/ri";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import ListItemText from '@mui/material/ListItemText';
import '../../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getItems, archiveItem, searchItemByName, getItemById, getArchivedItems, deleteItem, copyItem } from '../../actions/itemAction';
import { getCategories, getSubcategories } from '../../actions/categoryAction';

export default function ListItem() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [mode, setMode] = useState('active'); // 'active' or 'archive'
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);



    useEffect(() => {
        const fetchItems = async () => {
            try {
                let fetchedItems;
                if (searchTerm.trim() !== '') {
                    fetchedItems = await searchItemByName(searchTerm.trim());
                } else if (mode === 'archive') {
                    fetchedItems = await getArchivedItems();
                } else {
                    fetchedItems = await getItems();
                }
    
                const itemsWithSubcategoryName = fetchedItems.reduce((acc, item) => {
                    const subcategoryName = item.category?.subcategories?.find(
                        (subcategory) => subcategory._id === item.subcategory
                    )?.name;
    
                    acc.push({
                        ...item,
                        subcategory: subcategoryName || null,
                    });
    
                    return acc;
                }, []);
    
                let filteredItems = itemsWithSubcategoryName;
    
                if (selectedSubcategories.length > 0) {
                    filteredItems = filteredItems.filter((item) =>
                        selectedSubcategories.some((subcategory) => subcategory.includes(item.subcategory))
                    );
                }
    
                if (selectedCategories.length > 0) {
                    filteredItems = filteredItems.filter((item) =>
                        selectedCategories.includes(item.category?.name)
                    );
                }
    
                setItems(Array.isArray(filteredItems) ? filteredItems : []);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, [mode, searchTerm, selectedCategories, selectedSubcategories]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();

                // Check if categoriesData is an array
                if (Array.isArray(categoriesData)) {
                    const categoriesWithSubcategories = categoriesData.map((category) => {
                        const subcategories = category.subcategories.map((subcategory) => subcategory.name);
                        return { ...category, subcategories };
                    });

                    setCategories(categoriesWithSubcategories);
                } else {
                    console.error('Unexpected data format:', categoriesData);
                }
            } catch (error) {
                console.error('Error fetching categories and subcategories:', error);
            }
        };

        fetchCategories();
    }, [dispatch]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    // clear the selection when switching between "All" and "Archive"
    const handleListItems = (newMode) => {
        setMode(newMode);
        setSelectedCategories([]);
        setSelectedSubcategories([]);
    };

    const handleArchiveItem = async (itemId) => {
        try {
            await dispatch(archiveItem({ itemId, isArchive: true }));
            await refreshItems();
        } catch (error) {
            console.error('Error archiving item:', error);
        }
    };

    const handleUnarchiveItem = async (itemId) => {
        console.log('Unarchiving item:', itemId);
        try {
            await dispatch(archiveItem({ itemId, isArchive: false }));
            await refreshItems();
        } catch (error) {
            console.error('Error unarchiving item:', error);
        }
    };

    const handleCopyItem = async (itemId) => {
        try {
            const itemDetails = await dispatch(getItemById(itemId));
            const copiedItemDetails = { ...itemDetails, name: `${itemDetails.name} copy` };
            navigate('/items/new', { state: { copyItem: copiedItemDetails } });
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await dispatch(deleteItem(itemId));
            await refreshItems(); // Refresh the items list after deletion
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const refreshItems = async () => {
        try {
            let fetchedItems;
            if (searchTerm.trim() !== '') {
                fetchedItems = await searchItemByName(searchTerm.trim());
            } else if (mode === 'archive') {
                fetchedItems = await getArchivedItems();
            } else {
                fetchedItems = await getItems();
            }
            setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };
    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        const [categoryName, subcategoryName] = value.split(':');
    
        if (checked) {
            if (subcategoryName) {
                setSelectedSubcategories([...selectedSubcategories, value]);
            } else {
                setSelectedCategories([...selectedCategories, categoryName]);
            }
        } else {
            if (subcategoryName) {
                setSelectedSubcategories(selectedSubcategories.filter((v) => v !== value));
            } else {
                setSelectedCategories(selectedCategories.filter((v) => v !== categoryName));
                setSelectedSubcategories(selectedSubcategories.filter((v) => !v.startsWith(`${categoryName}:`)));
            }
        }
    };
    const CountSpan = styled('span')({
        backgroundColor: grey[200],
        color: blue[500],
        borderRadius: '20%',
        padding: '4px 8px',
        marginLeft: '10px',
    });

    const countSelectedItems = () => {
        const totalSelected = [...selectedCategories, ...selectedSubcategories].length;
        return (
            <>
                Categories <CountSpan>{totalSelected}</CountSpan>
            </>
        );
    };

    const handleMenuItemClick = (event, value, subcategories = []) => {
        event.stopPropagation();
    
        if (subcategories.length > 0) {
            setSelectedSubcategories((prevSelectedSubcategories) => {
                if (prevSelectedSubcategories.includes(`${value}:${subcategories[0]}`)) {
                    return prevSelectedSubcategories.filter(
                        (v) => !subcategories.includes(v.split(":")[1])
                    );
                } else {
                    return [...prevSelectedSubcategories, ...subcategories.map((subcategory) => `${value}:${subcategory}`)];
                }
            });
            setSelectedCategories((prevSelectedCategories) =>
                prevSelectedCategories.filter((v) => v !== value)
            );
        } else {
            setSelectedCategories((prevSelectedCategories) => {
                if (prevSelectedCategories.includes(value)) {
                    return prevSelectedCategories.filter((v) => v !== value);
                } else {
                    return [...prevSelectedCategories, value];
                }
            });
            setSelectedSubcategories((prevSelectedSubcategories) =>
                prevSelectedSubcategories.filter((v) => !v.startsWith(`${value}:`))
            );
        }
    };

    return (
        <section>

            <Box sx={{
                textAlign: 'right'
            }}>
                <NotificationsIcon sx={{
                    pt: '10px',
                    fontSize: '30px',
                    color: 'darkgray'
                }}></NotificationsIcon>
            </Box>
            <Divider></Divider>
            <Box>
                <div className='btn-div'>
                    <div className='client-div'>
                        <Typography sx={{ fontSize: '1.5rem' }}>Items</Typography>
                        <div className='btn-row'>
                            <Button className='btn-archieve btn-all' variant="outlined" color='primary'
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
                                onClick={() => handleListItems('active')}
                            >
                                All
                            </Button>
                            <Button variant="outlined" color='primary' className='btn-archieve'
                                sx={{
                                    minWidth: '130px',
                                    color: mode === 'archive' ? 'white' : 'darkgray',
                                    backgroundColor: mode === 'archive' ? 'darkgray' : 'transparent',
                                    borderColor: 'darkgray',
                                    '&:hover': {
                                        backgroundColor: 'darkgray',
                                        borderColor: 'darkgray',
                                        color: 'white',
                                    },
                                    '@media (max-width: 600px)': {
                                        minWidth: '70px',
                                    },
                                }}
                                onClick={() => handleListItems('archive')}
                            >
                                Archive
                            </Button>

                        </div>
                    </div>

                    <div className='green-div'>
                        <Button component={RouterLink} to='/items/new'
                            className='green-btn'
                            variant='contained'
                            color='success'
                        >
                            Add Item
                        </Button>
                        <FormControl sx={{ m: 1, width: 200 }}>
                            <Select
                                multiple
                                value={[...selectedCategories, ...selectedSubcategories]}
                                onChange={handleCategoryChange}
                                renderValue={countSelectedItems}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Categories' }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                            width: 200,
                                        },
                                    },
                                }}
                                sx={{
                                    '& .MuiMenu-list': {
                                        padding: 0,
                                    },
                                }}
                            >
                                {categories.map((category) => (
                                    <>
                                        <MenuItem
                                            key={category.name}
                                            value={category.name}
                                            onClick={(e) =>
                                                handleMenuItemClick(
                                                    e,
                                                    category.name,
                                                    []
                                                )
                                            }
                                            dense
                                            sx={{
                                                '& .MuiCheckbox-root': {
                                                    padding: 0,
                                                },
                                            }}
                                        >
                                            <Checkbox
                                                checked={selectedCategories.includes(category.name)}
                                                indeterminate={
                                                    !selectedCategories.includes(category.name) &&
                                                    category.subcategories.some((subcategory) =>
                                                        selectedSubcategories.includes(`${category.name}:${subcategory}`)
                                                    )
                                                }
                                            />
                                            <ListItemText primary={category.name} />
                                        </MenuItem>
                                        {category.subcategories && category.subcategories.length > 0 && (
                                            <div>
                                                {category.subcategories.map((subcategory) => (
                                                    <MenuItem
                                                        key={`${category.name}:${subcategory}`}
                                                        value={`${category.name}:${subcategory}`}
                                                        onClick={(e) => handleMenuItemClick(e, category.name, [subcategory])}
                                                        sx={{
                                                            ml: 3,
                                                            '& .MuiCheckbox-root': {
                                                                padding: 0,
                                                            },
                                                        }}
                                                        dense
                                                    >
                                                        <Checkbox
                                                            checked={selectedSubcategories.includes(`${category.name}:${subcategory}`)}
                                                        />
                                                        <ListItemText primary={subcategory} />
                                                    </MenuItem>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <Box sx={{
                    pt: '15px',
                    width: '100%'
                }}>
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
                                <TableCell align="right" sx={{ pl: '150px' }}>Category</TableCell>
                                <TableCell align="right">Subcategory</TableCell>
                                <TableCell align="right" sx={{ pl: '150px' }}>Price</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Link component={RouterLink} to={`/items/edit/${item._id}`}>
                                            {item.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">{item.category?.name}</TableCell>
                                    <TableCell align="right">
                                        {item.subcategory}
                                    </TableCell>
                                    <TableCell align="right">{item.price}</TableCell>
                                    <TableCell align="right">
                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                            <InputLabel id="select">select</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="select"

                                                label="select"
                                            >
                                                <MenuItem component={RouterLink} to={`/items/edit/${item._id}`}>
                                                    <span>
                                                        <EditIcon /> <span> Edit Item</span>
                                                    </span>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleCopyItem(item._id)}>
                                                    <span>
                                                        <ContentCopyIcon /> <span> Copy</span>
                                                    </span>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        if (item.archived) {
                                                            handleUnarchiveItem(item._id);
                                                            window.alert(`Item "${item.name}" unarchived !`);
                                                        } else {
                                                            handleArchiveItem(item._id);
                                                            window.alert(`Item "${item.name}" archived !`);
                                                        }
                                                    }}
                                                >
                                                    <span>
                                                        <InventoryIcon />
                                                        <span>{item.archived ? 'Unarchive' : 'Archive'}</span>
                                                    </span>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        const confirmDelete = window.confirm(
                                                            `Are you sure to delete "${item.name}"?`
                                                        );
                                                        if (confirmDelete) {
                                                            handleDeleteItem(item._id);
                                                        }
                                                    }}
                                                >
                                                    <span>
                                                        <RiDeleteBinLine />
                                                        <span> Delete </span>
                                                    </span>
                                                </MenuItem>
                                                <MenuItem >
                                                    <span>
                                                        <EditIcon /> <span> New Invoice</span>
                                                    </span>
                                                </MenuItem>
                                                <MenuItem >
                                                    <span>
                                                        <EditIcon /> <span> New Estimate</span>
                                                    </span>
                                                </MenuItem>

                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {items.length === 0 && (

                    <Box>
                        <Typography sx={{ textAlign: 'center', width: '97%', mt: '20px' }}>
                            No records available
                        </Typography>
                        <Button component={RouterLink} to='/items/new'
                            variant='contained'
                            color='success'
                            sx={{ width: '97%', mt: '30px' }}
                        >
                            Create Item
                        </Button>
                    </Box>

                )}
            </Box>

        </section>

    )
}
