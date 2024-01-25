import React, { useState, useEffect, useContext } from 'react';
import { ListItem, Checkbox, Typography, Box, styled } from '@mui/material';
import { StarBorder, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UidContext } from '../AppContext';

const Wrapper = styled(ListItem)`
    padding: 0 0 0 10px;
    background: #f2f6fc;
    cursor: pointer;
    overflow: hidden;

    & > div {
        display: flex;
        flex-wrap: wrap;  /* Added to wrap the content to the next line */
        width: 100%;

    }

    & > div > p {
        font-size: 14px;
        max-width: 100%;  /* Set maximum width for paragraphs */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
                  borderBottom: "1px solid #111",

    }

   @media (max-width: 900px) {
        & > div {
            width: 90%;  // 90% width for screens smaller than 900px
        }
    }

    @media (max-width: 600px) {
        & > div {
            
            width: 80%;  // 80% width for screens smaller than 600px
        }
    }
`;


const Indicator = styled(Typography)`
    font-size: 12px !important;
    background: #ddd;
    color: #222;
    border-radius: 4px;
    margin-right: 6px;
    padding: 0 4px;
`;

const DateText = styled(Typography)({
    marginLeft: 'auto',
    marginRight: 20,
    fontSize: 12,
    color: '#5F6368',
});



const Email = ({ email, selectedEmails, setSelectedEmails }) => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const uid = useContext(UidContext);
    const [userEmail, setUserEmail] = useState('');

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
    }, [uid, apiUrl]);

    const toggleStarredEmail = async () => {
        try {
            await axios.post(`${apiUrl}api/email/starred/${userEmail}`, {
                emailId: email._id,
            });
            // Refresh the email list after toggling starred status
            // You can add a prop or callback to refresh the email list in the Emails component
        } catch (error) {
            console.error('Error toggling starred status:', error);
        }
    };

    const handleChange = () => {
        if (selectedEmails.includes(email._id)) {
            setSelectedEmails((prevState) => prevState.filter((id) => id !== email._id));
        } else {
            setSelectedEmails((prevState) => [...prevState, email._id]);
        }
    };

    return (
        <Wrapper>
            <Checkbox size="small" checked={selectedEmails.includes(email._id)} onChange={handleChange} />
            {email.starred ? (
                <Star fontSize="small" style={{ marginRight: 10 }} onClick={toggleStarredEmail} />
            ) : (
                <StarBorder fontSize="small" style={{ marginRight: 10 }} onClick={toggleStarredEmail} />
            )}
            <Box
                onClick={() => navigate("/email/view", { state: { email: email } })}
            >
                <Typography style={{ width: 150 }}>{email.from.split('@')[0]}</Typography>

                <Typography>
                    {email.subject && <strong>{email.subject}</strong>}
                    {email.subject && email.body ? ' - ' : '(no subject) - '}
                    {email.body.length > 64 ? email.body.substring(0, 64) + '...' : email.body}
                </Typography>

                <DateText>
                    {new window.Date(email.sentAt).getDate()}&nbsp;
                    {new window.Date(email.sentAt).toLocaleString('default', {
                        month: 'long',
                    })}
                </DateText>
                izaaan
            </Box>
        </Wrapper>
    );
};

export default Email;
