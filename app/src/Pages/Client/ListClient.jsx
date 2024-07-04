import React from 'react'
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Box, OutlinedInput } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Hidden } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getAllActiveClients, getAllArchiveClients, getClientsByName } from '../../actions/clientAction';
import '../../App.css'
import { useDispatch, useSelector } from "react-redux";
import { archiveClient } from '../../actions/clientAction';
import ExportClient from './ExportClient';
import { ToastContainer, toast } from 'react-toastify';



export default function Listusers() {
    const dispatch = useDispatch();
    const [select, setSelect] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [mode, setMode] = useState('active'); // 'active' or 'archive'
    const [clients, setClients] = useState([]);

    const [showModal, setShowModal] = useState(false);

    // Function to toggle the visibility of the Export component
    // const toggleModal = () => {
    //     setShowModal(!showModal);
    // };
    const [selectedFields, setSelectedFields] = useState({
        name: false,
        email: false,
        address_1: false,
        address_2: false,
        phone: false,
        city: false,
        state: false,
        zip: false,
        country: false,
        isArchived: false,
        estimates_count: false,
        invoices_count: false,
        summary_data: false,
    });

    const handleDownload = async () => {
        // 
        // console.log('Download button clicked');
        // console.log('Clients');

        if (clients.length === 0) {
            alert("no clients to export");
            return;

        }

        // Filter out the selected fields
        const selectedFieldsList = Object.entries(selectedFields)
            .filter(([key, value]) => value)
            .map(([key]) => key);

        try {
            const fieldsParam = selectedFieldsList.join(',');

            const response = await axios.get(`http://localhost:5000/api/clients/export?fields=${fieldsParam}`, {
                responseType: 'blob'
            });
            console.log(selectedFields);
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'text/csv' });

                saveAs(blob, 'exported_data.csv');
            } else {
                console.error('Error downloading data: Unexpected status code');
            }
        } catch (error) {
            console.error('Error downloading data:', error);
        }
    };
    const refreshClients = async () => {
        try {
            setSearchTerm('');
            let fetchedClients;
            if (mode === 'archive') {
                fetchedClients = await getAllArchiveClients();
            } else {
                fetchedClients = await getAllActiveClients();
            }
            setClients(Array.isArray(fetchedClients) ? fetchedClients : []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                let fetchedClients;
                if (searchTerm.trim() !== '') {
                    fetchedClients = await getClientsByName(searchTerm.trim());
                } else if (mode === 'archive') {
                    fetchedClients = await getAllArchiveClients();
                } else {
                    fetchedClients = await getAllActiveClients();
                }
                setClients(Array.isArray(fetchedClients) ? fetchedClients : []);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, [mode, searchTerm]);


    // useEffect(() => {
    //     console.log("calling useeffect of searching client",   searchTerm);

    //       const fetchClientDataByName = async () => {
    //         try {
    //             if(searchTerm){
    //           const clientsByName = await getClientsByName(searchTerm);
    //           setAllClientsByName(clientsByName);
    //           console.log(allClientsByName);
    //             }
    //             else{
    //                 setActive(true);
    //             }

    //         } catch (error) {
    //           console.error('Error fetching archive clients:', error);
    //         }

    //       fetchClientDataByName();
    // }
    //   },[searchTerm] );


    const handleListClients = async (newMode) => {
        setMode(newMode);
        try {
            if (newMode === 'active') {
                const allClients = await getAllActiveClients();
                setClients(allClients);
            } else if (newMode === 'archive') {
                const archivedClients = await getAllArchiveClients();
                setClients(archivedClients);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };


    const handleArchiveClient = async (clientId) => {
        console.log('Archiving client:', clientId);
        try {
            await dispatch(archiveClient({ clientId, isArchive: true }));
            await refreshClients();
        } catch (error) {
            console.error('Error archiving client:', error);
        }
    };

    const handleUnarchiveClient = async (clientId) => {
        console.log('Unarchiving client:', clientId);
        try {
            await dispatch(archiveClient({ clientId, isArchive: false }));
            await refreshClients();
        } catch (error) {
            console.error('Error unarchiving client:', error);
        }
    };
    const handleSearchChange = async (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value === '') {
            await refreshClients();
        } else {
            try {
                const clientsByName = await getClientsByName(event.target.value);
                setClients(clientsByName);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        }
    };


    // const handleOnclick=()=>{
    //                      return <Export/>
    // }
    // const searchHandler = (event) => {
    //     // Fetch the user-written data from the event
    //     const userInput = event.target.value;
    //     //     const newData = { key: userInput };
    //     //   localStorage.setItem('myData', JSON.stringify(newData)); 
    //     // const [clientsName]=GetClientsByName(userInput); 
    //     // You can further process the user input here
    // };

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
                        <Typography sx={{ fontSize: '1.5rem' }}>Clients</Typography>
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
                                onClick={() => handleListClients('active')}
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
                                onClick={() => handleListClients('archive')}
                            >
                                Archive
                            </Button>
                        </div>
                    </div>

                    <div className='green-div'>
                        <Button component={RouterLink} to='/clients/new'
                            className='green-btn'
                            variant='contained'
                            color='primary'
                        >
                            Add Client
                        </Button>
                        <ButtonGroup className='group-btn' sx={{ pt: '20px' }}>
                            <Button

                                className='download-btn'
                                startIcon={<FileDownloadOutlinedIcon />}
                                sx={{
                                    marginLeft: 'auto',
                                }}
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                            <Button
                                className='filter-btn'
                                startIcon={<TuneTwoToneIcon />}
                                onClick={() => setShowModal(true)}

                            >
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
                {showModal && (
                    <ExportClient
                        selectedFields={selectedFields}

                        onClose={() => setShowModal(false)}
                        setSelectedFields={setSelectedFields}
                    />
                )}
                <ToastContainer />
                <Box sx={{
                    pt: '15px',
                    width: '100%'
                }}>
                    <OutlinedInput
                        placeholder='Search..'
                        sx={{ width: '97%' }}
                        value={searchTerm}
                        onChange={handleSearchChange} // Update state with user input

                    />
                </Box>

                <TableContainer sx={{ width: '97%', pt: '15px' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Client</TableCell>
                                <Hidden mdDown>
                                    <TableCell align="right" sx={{ pl: '100px' }}>Ccy</TableCell>
                                </Hidden>
                                <Hidden mdDown>
                                    <TableCell align="right">Revenue</TableCell>
                                </Hidden>
                                <Hidden mdDown>
                                    <TableCell align="right">Paid</TableCell>
                                </Hidden>
                                <Hidden mdDown>
                                    <TableCell align="right">Owing</TableCell>
                                </Hidden>
                                <Hidden mdDown>
                                    <TableCell align="right">Invoices</TableCell>
                                </Hidden>
                                <Hidden mdDown>
                                    <TableCell >Estimates</TableCell>
                                </Hidden>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <Link component={RouterLink} to={`/clients/edit/${item._id}`}>
                                            {item.name}
                                        </Link>
                                    </TableCell><Hidden mdDown>
                                        <TableCell align="right">USD</TableCell>
                                    </Hidden><Hidden mdDown>
                                        <TableCell align="right">0.00</TableCell>
                                    </Hidden><Hidden mdDown>
                                        <TableCell align="right">0.00</TableCell>
                                    </Hidden><Hidden mdDown>
                                        <TableCell align="right">0.00</TableCell>
                                    </Hidden><Hidden mdDown>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                className="btn-archieve"
                                                startIcon={<ContentCopyIcon />}
                                                sx={{
                                                    minWidth: '130px',
                                                    color: 'darkgray',
                                                    backgroundColor: 'transparent',
                                                    borderColor: 'darkgray',
                                                    '&:hover': {
                                                        borderColor: 'darkgray',
                                                    },
                                                    '@media (max-width: 600px)': {
                                                        minWidth: '70px',
                                                    },
                                                }}
                                            >
                                                Invoice
                                            </Button>
                                        </TableCell>
                                    </Hidden><Hidden mdDown>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                className="btn-archieve"
                                                startIcon={<ContentCopyIcon />}
                                                sx={{
                                                    minWidth: '130px',
                                                    color: 'darkgray',
                                                    backgroundColor: 'transparent',
                                                    borderColor: 'darkgray',
                                                    '&:hover': {
                                                        borderColor: 'darkgray',
                                                    },
                                                    '@media (max-width: 600px)': {
                                                        minWidth: '70px',
                                                    },
                                                }}
                                            >
                                                Estimate
                                            </Button>
                                        </TableCell>
                                    </Hidden><TableCell align="right">
                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                            <InputLabel id="select">select</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="select"
                                                value={select}
                                                label="select"
                                            >
                                                <MenuItem value={1}>
                                                    <span >
                                                        <Link component={RouterLink} to={`/clients/edit/${item._id}`}>
                                                            <EditIcon /> <span> Edit Client</span>
                                                        </Link>
                                                    </span>
                                                </MenuItem>
                                                <MenuItem value={2}>
                                                    <span>
                                                        <DescriptionIcon /> <span> New Invoice</span>
                                                    </span>
                                                </MenuItem>
                                                <MenuItem value={3}>
                                                    <span>
                                                        <EditIcon /> <span> New Estimate</span>
                                                    </span>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        if (item.archived) {
                                                            handleUnarchiveClient(item._id);
                                                            window.alert(`Client "${item.name}" unarchived!`);
                                                        } else {
                                                            handleArchiveClient(item._id);
                                                            window.alert(`Client "${item.name}" archived!`);
                                                        }
                                                    }}
                                                >
                                                    <span>
                                                        <InventoryIcon />
                                                        <span>{item.archived ? 'Unarchive' : 'Archive'}</span>
                                                    </span>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow >
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {
                    clients.length === 0 && (
                        <Box>
                            <Typography sx={{ textAlign: 'center', width: '97%', mt: '20px' }}>
                                No records available
                            </Typography>
                            <Button
                                variant='contained'
                                color='primary'
                                sx={{ width: '97%', mt: '30px' }}
                            >
                                Create a client
                            </Button>
                        </Box>
                    )
                }
            </Box>

        </section>
    )
}