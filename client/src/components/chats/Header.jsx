import { AppBar, Toolbar, Box, InputBase, styled } from '@mui/material';
import { Menu as MenuIcon, Tune, HelpOutlineOutlined, SettingsOutlined, 
    AppsOutlined, AccountCircleOutlined, Search } from '@mui/icons-material'


import { gmailLogo } from '../constants/constant';
import  React, { useContext, useEffect, useState } from 'react';
import { UidContext } from '../AppContext';
import axios from 'axios';
import './style.css';
import UserList from './search.jsx';
import Popover from '@mui/material/Popover';

const StyledAppBar = styled(AppBar)`
    background: black;
    box-shadow: none;
    height: 62px;
    justify-content: space-between;

    @media (max-width: 900px) {
        height: 58px;
    }

    @media (max-width: 600px) {
        height: 56px;
    }
`;

const SearchWrapper = styled(Box)`
    background: #EAEEF1;
    margin-left: 25px;
    border-radius: 9px;
    min-width: 300px;
    max-width: 720px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;

    @media (max-width: 900px) {
        min-width: 200px;
    }

    @media (max-width: 600px) {
        min-width: 100px;
    }
`;

const OptionsWrapper = styled(Box)`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    & > svg {
        margin-left: 20px;
    }

    @media (max-width: 600px) {
        & > svg {
            margin-left: 10px; // Adjust the margin for smaller screens
        }
    }
`;

const Header = ({ toggleDrawer }) => {
    const uid = useContext(UidContext);
    const [picture, setPicture] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

      const [anchorEl, setAnchorEl] = useState(null);

       const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
console.log(open)


   const handleSearch = async () => {
  if (!search) {
      alert("Veuillez entrer quelque chose dans la recherche");

    return;
  }

  try {
    setLoading(true);
    const { data } = await axios.get(`${apiUrl}api/user?search=${search}`);
    setLoading(false);
    setSearchResult(data);
  } catch (error) {
     alert(JSON.stringify(error, null, 2));

  }
};

    useEffect(() => {
        const fetchUserPseudo = async () => {
          try {
            const response = await axios.get(`${apiUrl}api/user/${uid}`);
            console.log(picture) 
            setPicture(response.data.picture);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        if (uid) { 
        fetchUserPseudo();
      }
      }, [uid]);

      
    return (
        <StyledAppBar position="static">
            <Toolbar>
                <MenuIcon color="white" onClick={toggleDrawer} />
                <img src={gmailLogo} alt="logo" className="responsive-logo" />

                 <div className="search-bar">
                   <button className="search-button" onClick={(event) => {handleSearch(); handleClick(event);}}>
                    <span className="fas fa-search search-icon"></span>
                    </button>
                        <input 
                        type="text" 
                        placeholder="Search" 
                        className="search-input" 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        />                   
                     </div>
                        <Popover
                        backgroundColor="black"
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                        horizontal: 'left',

                            }}
                            transformOrigin={{
                                vertical: 'top',
                                        horizontal: 'left',

                            }}
                            style={{ marginTop: '10px', marginLeft:"8px",    height: "400px"}}

                            >
                    <UserList users={searchResult} searchValue={search} />                            
                    </Popover>

                   <OptionsWrapper style={{ display: 'flex', alignItems: 'center' }}>
                    <HelpOutlineOutlined color="white" style={{ marginRight: '5px' }} />
                    <SettingsOutlined color="white" style={{ marginRight: '5px' }} />
                    <AppsOutlined color="white" style={{ marginRight: '5px' }} />
                    {picture && <img src={picture} alt='User' style={{ width: '50px', height: '50px', borderRadius: '100%', marginLeft: '5px' }} />}                
                    </OptionsWrapper>
            </Toolbar>
        </StyledAppBar>
    )
}

export default Header;
