import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
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
import { RiDeleteBinLine } from "react-icons/ri";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { TbArrowsUpDown } from "react-icons/tb";
import { IoCopyOutline } from "react-icons/io5";
import { VscEdit } from "react-icons/vsc";
import { PiFolderOpen } from "react-icons/pi";
import { BsArchive } from "react-icons/bs";
import '../../App.css'
import { useNavigate } from 'react-router-dom';
import { getTaxes, archiveTax, getArchiveTaxes, getTaxById, getTaxesByName,deleteTax } from '../../actions/taxAction'; // Update import statement
import { useDispatch } from 'react-redux';

export default function ListTaxes() {
    const [taxes, setTaxes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [mode, setMode] = useState('active'); // 'active' or 'archive'
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTaxes = async () => {
            try {
                let fetchedTaxes;
                if (searchTerm.trim() !== '') {
                    fetchedTaxes = await getTaxesByName(searchTerm.trim());
                } else if (mode === 'archive') {
                    fetchedTaxes = await getArchiveTaxes();
                } else {
                    fetchedTaxes = await getTaxes();
                }
                setTaxes(Array.isArray(fetchedTaxes) ? fetchedTaxes : []);
            } catch (error) {
                console.error('Error fetching Taxes:', error);
            }
        };

        fetchTaxes();
    }, [mode, searchTerm])

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleListTaxes = (newMode) => {
        setMode(newMode);
    };

    const handleArchiveTax = async (taxId) => {
        console.log('Archiving taxes:', taxId);
        try {
            await dispatch(archiveTax({ taxId, isArchive: true }));
            await refreshTaxes();
        } catch (error) {
            console.error('Error archiving tax:', error);
        }
    };

    const handleUnarchiveTax = async (taxId) => {
        console.log('Unarchiving tax:', taxId);
        try {
            await dispatch(archiveTax({ taxId, isArchive: false }));
            await refreshTaxes();
        } catch (error) {
            console.error('Error unarchiving tax:', error);
        }
    };

    const handleDeleteTax = async (taxId) => {
        try {
            await dispatch(deleteTax(taxId));
            await refreshTaxes();
        } catch (error) {
            console.error('Error deleting tax:', error);
        }
    };

    const refreshTaxes = async () => {
        try {
            let fetchedTaxes;
            if (searchTerm.trim() !== '') {
                fetchedTaxes = await getTaxesByName(searchTerm.trim());
            } else if (mode === 'archive') {
                fetchedTaxes = await getArchiveTaxes();
            } else {
                fetchedTaxes = await getTaxes();
            }
            setTaxes(Array.isArray(fetchedTaxes) ? fetchedTaxes : []);
        } catch (error) {
            console.error('Error fetching taxes:', error);
        }
    };
    // console.log(taxes);

    return (
        <section>

            
            <Box>
                <div className='btn-div'>
                    <div className='client-div'>
                        <Typography sx={{ fontSize: '1.5rem' }}>Taxes</Typography>
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
                                onClick={() => handleListTaxes('active')}
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
                                onClick={() => handleListTaxes('archive')}
                            >
                                Archive
                            </Button>
                            {/* <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                                    <InputLabel id="select">select</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="select"
                                       
                                        label="select"
                                    >
                                        <MenuItem >
                                            <span>
                                                <EditIcon /> <span> Edit Item</span>
                                            </span>
                                        </MenuItem>
                                        <MenuItem >
                                            <span>
                                                <DescriptionIcon /> <span> Copy</span>
                                            </span>
                                        </MenuItem>
                                        (
                                            <MenuItem >
                                                <span>
                                                    <InventoryIcon /> <span>Archive</span>
                                                </span>
                                            </MenuItem>
                                        ) : (
                                            <></>
                                        )
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
                                </FormControl> */}
                        </div>
                    </div>

                    <div className='green-div'>
                        <Button component={RouterLink} to='/taxes/new'
                            className='green-btn'
                            variant='contained'
                            color='success'
                        >
                            Add Tax
                        </Button>

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
                    // Update state with user input

                    />
                </Box>

                <TableContainer sx={{ width: '97%', pt: '15px' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name<TbArrowsUpDown style={{ paddingLeft: '8px', fontSize: '30px', paddingTop: '10px' }} /></TableCell>
                                <TableCell align="right" sx={{ pl: '650px' }}>Rate</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {taxes.map((tax) => (
                                <React.Fragment key={tax._id}>
                                    <TableRow >
                                        <TableCell>
                                            <Link component={RouterLink} to={{ pathname: `/taxes/edit/${tax._id}`, state: { taxId: tax._id } }}>
                                                {tax.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right" >{tax.rate} %</TableCell>

                                        <TableCell align="right">
                                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                <InputLabel id="select">select</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="select"

                                                    label="select"
                                                >
                                                    <MenuItem >
                                                        <span>
                                                            <VscEdit /> <span ><Link component={RouterLink} to={`/taxes/edit/${tax._id}`}> Edit Tax</Link></span>
                                                        </span>
                                                    </MenuItem>
                                                    <MenuItem
                                                    onClick={() => {
                                                        if (tax.archived) {
                                                            handleUnarchiveTax(tax._id);
                                                            window.alert(`Tax "${tax.name}" unarchived !`);
                                                        } else {
                                                            handleArchiveTax(tax._id);
                                                            window.alert(`Tax "${tax.name}" archived !`);
                                                        }
                                                    }}
                                                >
                                                    <span>
                                                        <InventoryIcon />
                                                        <span>{tax.archived ? 'Unarchive' : 'Archive'}</span>
                                                    </span>
                                                </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            const confirmDelete = window.confirm(
                                                                `Are you sure to delete "${tax.name}"?`
                                                            );
                                                            if (confirmDelete) {
                                                                handleDeleteTax(tax._id);
                                                            }
                                                        }}
                                                    >
                                                        <span>
                                                            <RiDeleteBinLine />
                                                            <span> Delete </span>
                                                        </span>
                                                    </MenuItem>



                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow >
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {taxes.length === 0 && (
                    <Box>
                        <Typography sx={{ textAlign: 'center', width: '97%', mt: '20px' }}>
                            No records available
                        </Typography>
                        <Button component={RouterLink} to='/taxes/new'
                            variant='contained'
                            color='success'
                            sx={{ width: '97%', mt: '30px' }}
                        >
                            Create a Tax
                        </Button>
                    </Box>
                )}
            </Box>

        </section>

    )
}