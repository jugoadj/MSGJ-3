import React, { useState, useContext, useEffect, useId } from 'react';
import { Dialog, styled, Typography, Box, InputBase, TextField, Button } from '@mui/material'; 
import { Close, DeleteOutline } from '@mui/icons-material';
import axios from 'axios';
import { UidContext } from '../AppContext';

const dialogStyle = {
  
    height: '70%',
    width: '60%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
        overflow: 'hidden', // Ajouté pour masquer la barre de défilement

    borderRadius: '10px 10px 10px 10px',
    '@media (max-width: 900px)': {
        width: '90%',
    },
    '@media (max-width: 600px)': {
        width: '100%',
    },
}

const Header = styled(Box)`
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    background: #f2f6fc;
    & > p {
        font-size: 15px;
        font-weight: 500;
        @media (max-width: 900px)': {
            font-size: 13px,
        },
        '@media (max-width: 600px)': {
            font-size: 11px,
        },
    }
`;

const RecipientWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    & > div {
        font-size: 14px;
        border-bottom: 1px solid #F5F5F5;
        margin-top: 10px;
        @media (max-width: 900px)': {
            font-size: 12px,
        },
        '@media (max-width: 600px)': {
            font-size: 10px,
        },
    }
`;

const Footer = styled(Box)`
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 20px 18px;
    align-items: center;
    @media (max-width: 900px)': {
        padding: 15px 10px,
    },
    '@media (max-width: 600px)': {
        padding: 10px 5px,
    },
`;

const SendButton = styled(Button)`
    background: #0B57D0;
    color: #fff;
    font-weight: 500;
    text-transform: none;
    border-radius: 18px;
    width: 100px;
    @media (max-width: 900px)': {
        width: 80px,
    },
    '@media (max-width: 600px)': {
        width: 60px,
    },
`;
const ComposeMail = ({ open, setOpenDrawer }) => {
    const [data, setData] = useState({});
    const [userEmail, setUserEmail] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const uid = useContext(UidContext);
  
    useEffect(() => {
      const fetchUserEmail = async () => {
        try {
          const response = await axios.get(`${apiUrl}api/user/${uid}`);
          setUserEmail(response.data.email);
        } catch (error) {
          console.error('Error fetching user email:', error);
        }
      };
  
      fetchUserEmail();
    }, [uid]);
  
    const onValueChange = (e) => {
      setData({ ...data, [e.target.name]: e.target.value });
    };
  
    const sendEmail = async (e) => {
      e.preventDefault();
  
      try {
        // Send email using Axios
        await axios.post(`${apiUrl}api/email/save`, {
          ...data,
          from: userEmail, // Use the user's email as the 'from' field
          folders: [
            { user: data.to, starred: false, read: false },
            { user: userEmail, starred: false, read: false },
          ],
          attachments: [],
          labels: [],
          sentAt: new Date(),
        });
  
        // Close the compose mail dialog
        setOpenDrawer(false);
        setData({});
      } catch (error) {
        console.error('Error sending email:', error);
        // Handle error
      }
    };
  
    const closeComposeMail = (e) => {
      e.preventDefault();
  
      // Close the compose mail dialog
      setOpenDrawer(false);
      setData({});
    };
  
    return (
      <Dialog open={open} PaperProps={{ sx: dialogStyle }}>
        <Header>
          <Typography>New Message</Typography>
          <Close fontSize="small" onClick={(e) => closeComposeMail(e)} />
        </Header>
        <RecipientWrapper>
          <InputBase
            placeholder="Recipients"
            name="to"
            onChange={(e) => onValueChange(e)}
            value={data.to}
          />
          <InputBase
            placeholder="Subject"
            name="subject"
            onChange={(e) => onValueChange(e)}
            value={data.subject}
          />
        </RecipientWrapper>
        <TextField
          multiline
          rows={15}
          sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
          name="body"
          onChange={(e) => onValueChange(e)}
          value={data.body}
        />
        <Footer>
          <SendButton onClick={(e) => sendEmail(e)}>Send</SendButton>
          <DeleteOutline onClick={() => setOpenDrawer(false)} />
        </Footer>
      </Dialog>
    );
  };
  
  export default ComposeMail;