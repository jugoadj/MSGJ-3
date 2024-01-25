import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import MailIcon from '@mui/icons-material/Mail';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MessageIcon from '@mui/icons-material/Message';
import { styled } from '@mui/system';
import { grey } from '@mui/material/colors';

const StyledButton = styled(Button)({
  margin: '10px',
  marginLeft: '33px',
  padding: '8px',
  color: 'black',
 // backgroundColor: grey[100],
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'grey',
  },
});

const iconStyle = {
  fontSize: '30px',
  //color:'blue',
};

const SideNavBar = () => {
  return (
    <div
      style={{
        width: '60px',
        height: '100%',
        backgroundColor: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Link to="/email">
        <StyledButton startIcon={<MailIcon style={iconStyle} />} />
      </Link>
      <Link to="/chat">
        <StyledButton startIcon={<MessageIcon style={iconStyle} />} />
      </Link>
      <Link to="/page3">
        <StyledButton startIcon={<VideoCallIcon style={iconStyle} />} />
      </Link>
      
    </div>
  );
};

export default SideNavBar;