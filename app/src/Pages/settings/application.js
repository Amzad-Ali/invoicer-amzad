import React from 'react'
// import axios from 'axios';
// import { saveAs } from 'file-saver';
import { useState, useEffect, useRef } from 'react';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useDispatch } from "react-redux";
import { uploadFiles } from '../../actions/settingAction';
// import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone';

import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Box, OutlinedInput } from '@mui/material';

import '../../App.css'

export default function Application() {
    const fileInputRef = useRef(null);
    const [uploadedData, setUploadedData] = useState(null);
    // const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();

    const handleDrop = async (e) => {
        // setUploading(false);
        // setUploading(true);
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setUploadedData(file);
        try {
            const response = await dispatch(uploadFiles(file));
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            // setSelectedFile(files[0]);
            const file = files[0];
      setUploadedData(file);
            // setUploadedData(files[0]);
            try {
                const response = await dispatch(uploadFiles(file));
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <section className='section'>
            <Box sx={{
                textAlign: 'left'
            }}>
                <Typography sx={{ fontSize: '2rem', color: '#575757', }}>Settings</Typography>
            </Box>
            <Divider
                sx={{
                    mt: '20px',
                }}
            ></Divider>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    '& > *': {
                        m: 5,
                    },
                }}
            >
                <ButtonGroup aria-label="Basic button group"
                    sx={{
                        height: '3.5rem',
                        width: '96%',
                        ml: '0px',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Button sx={{
                        width: '16%',
                        border: 'none',
                        color: 'black',
                        '&:hover': {
                            border: 'none',
                        },
                    }}
                        key="one" component={RouterLink} to='/settings/account'>Account</Button>,
                    <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
                    <Button sx={{
                        width: '16%',
                        border: 'none',
                        color: 'black',
                        '&:hover': {
                            border: 'none',
                        },
                    }}
                        key="two" component={RouterLink} to='/settings/application'>Application</Button>,
                    <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
                    <Button sx={{
                        width: '16%',
                        border: 'none',
                        color: 'black',
                        '&:hover': {
                            border: 'none',
                        },
                    }}

                        key="three">Invoice</Button>,
                    <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
                    <Button sx={{
                        width: '16%',
                        border: 'none',
                        color: 'black',
                        '&:hover': {
                            border: 'none',
                        },

                    }}
                        key="one">Estimate</Button>,
                    <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
                    <Button sx={{
                        width: '16%',
                        border: 'none',
                        color: 'black',
                        '&:hover': {
                            border: 'none',
                        },

                    }}
                        key="two">Notifications</Button>,
                    <Divider orientation="vertical" flexItem sx={{ height: '100%', borderRightColor: 'rgba(0, 0, 0, 0.87)' }} />
                    <Button sx={{
                        width: '16%',
                        border: 'none',
                        color: 'black',
                        '&:hover': {
                            border: 'none',
                        },

                    }}
                        key="three">Billing</Button>,
                </ButtonGroup>
            </Box>

            <Button variant="contained"
                sx={{
                    ml: '30px',
                }}
            >SAVE</Button>
            <Typography
                sx={{
                    mt: '10px',
                    fontSize: 'larger',
                    fontWeight: 'bold',
                    color: '#575555',
                }}
            >Application settings</Typography>
            <Box
                sx={{
                    ml: '30px',
                }}
            >
                <Typography
                    sx={{
                        mt: '30px',
                        color: '#575555',
                    }}
                >Default logo : </Typography>
                <Box
                    sx={{
                        border: '1px dashed gray',
                        borderRadius: '10px',
                        height: '175px',
                        width: '325px',
                        textAlign: 'center',
                        p: '70px 0',
                        fontSize: '1rem',
                        mt: '30px'
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <Link href='#' onClick={handleFile}>Upload a file</Link>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    or drag and drop
                    {uploadedData ? (
                        <div>
                            <p><strong>{uploadedData.name}</strong></p>        
                        </div>
                    ) : (
                        <p></p>
                    )}
                </Box>
                <Typography
                    sx={{
                        mt: '30px',
                        color: '#575555',
                    }}
                >Pagination :</Typography>
            </Box>
        </section>
    )
}