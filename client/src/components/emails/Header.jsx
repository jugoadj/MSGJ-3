import { AppBar, Toolbar, Box, InputBase, styled } from '@mui/material';
import { Menu as MenuIcon, Tune, HelpOutlineOutlined, SettingsOutlined, 
    AppsOutlined, AccountCircleOutlined, Search } from '@mui/icons-material'

import { gmailLogo } from '../constants/constant';
import { useContext, useEffect, useState } from 'react';
import { UidContext } from '../AppContext';
import axios from 'axios';

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

    useEffect(() => {
        const fetchUserPseudo = async () => {
          try {
            const response = await axios.get(`${apiUrl}api/user/${uid}`);
            console.log(picture) 
            setPicture(response.data.picture);
          } catch (error) {
            console.error('Error fetching user email:', error);
          }
        };
    
        fetchUserPseudo();
      }, [uid]);
    return (
        <StyledAppBar position="static">
            <Toolbar>
                <MenuIcon color="white" onClick={toggleDrawer} />
                <img src={gmailLogo} alt="logo" style={{ 
                    width: '100%', 
                    maxWidth: 160, 
                    marginLeft: 35,
                }} className="responsive-logo" />
                <SearchWrapper>
                    <Search color="action" />
                    <InputBase />
                    <Tune color="action"/>
                </SearchWrapper>

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
