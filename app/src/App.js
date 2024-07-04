import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PercentIcon from '@mui/icons-material/Percent';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MailIcon from '@mui/icons-material/Mail';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaQuery } from '@mui/material';
import { Collapse } from '@mui/material';
import { Link } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './componenets/routes';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  //padding: theme.spacing(0, 1),
  padding: '30px',
  color: '#000',


  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const theme = useTheme();
  // This is use to open or close the Dropdown of Nevigation bar
  const [openDrop, setDrop] = React.useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen size is small (sm or lower)

  const [open, setOpen] = React.useState(!isSmallScreen); // Set the initial state of open based on the screen size


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setDrop(!openDrop);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Welcome to 10xInvoicer
          </Typography>
          <IconButton color="inherit">
            <i className="fa-sharp fa-regular fa-bell"></i>
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* <Navbar/> */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography variant="h4" noWrap component="div">
            10xInvoicer
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Invoices', 'Estimates', 'Client', 'Items', 'Setting'].map((text, index) => (
            <React.Fragment key={text}>
              {text === 'Client' ? (
                <>
                  <ListItem disablePadding onClick={handleToggle}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PeopleAltIcon />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openDrop} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton component={Link} to="/clients/new" sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <PersonAddAlt1Icon />
                        </ListItemIcon>
                        <ListItemText primary="New Client" />
                      </ListItemButton>
                      <ListItemButton component={Link} to="/clients" sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <PeopleAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="List Clients" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </>
              ) : (text === 'Invoices') ? (
                <>
                  <ListItem disablePadding onClick={handleToggle}>
                    <ListItemButton>
                      <ListItemIcon>
                        <FeedOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (text === 'Estimates') ? (
                <>
                  <ListItem disablePadding onClick={handleToggle}>
                    <ListItemButton>
                      <ListItemIcon>
                        <FileCopyOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openDrop} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton component={Link} to="/estimates/new" sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <InsertDriveFileOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="New Estimate" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </>
              ) : (text === 'Items') ? (
                <>
                  <ListItem disablePadding onClick={handleToggle}>
                    <ListItemButton>
                      <ListItemIcon>
                        <ArrowCircleRightOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openDrop} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton component={Link} to="/items" sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <LocalOfferIcon />
                        </ListItemIcon>
                        <ListItemText primary="List Items" />
                      </ListItemButton>
                      <ListItemButton component={Link} to="/taxes" sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <PercentIcon />
                        </ListItemIcon>
                        <ListItemText primary="List Taxes" />
                      </ListItemButton>
                      <ListItemButton component={Link} to="/categories" sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <ConfirmationNumberIcon />
                        </ListItemIcon>
                        <ListItemText primary="List Categories" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </>
              ) : (text === 'Setting') ? (
                <>
                  <ListItem disablePadding onClick={handleToggle}>
                    <ListItemButton component={Link} to="/settings/account">
                      <ListItemIcon>
                       <SettingsIcon/>
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to={`/${text.toLowerCase().replace(/\s+/g, '-')}`} // Example: '/item-1'
                    sx={{
                      minHeight: 48,
                      justifyContent: openDrop ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}

                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
      </Drawer>
      {/* // <Sidebar></Sidebar> */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <AppRoutes />
      </Box>
      <ToastContainer />
    </Box>
  );
}