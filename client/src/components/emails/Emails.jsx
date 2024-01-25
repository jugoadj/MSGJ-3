import React, { useEffect, useState, useContext, useCallback } from "react";
import { Box, List, Checkbox, CircularProgress } from "@mui/material";
import Email from "./Email";
import { DeleteOutline } from "@mui/icons-material";
import { UidContext } from "../AppContext";
import axios from "axios";
import { EMPTY_TABS } from "../constants/constant";
import NoMails from "./common/NoMails";
import './style.css';


const Emails = ({ openDrawer, mailboxEndpoint }) => {
  console.log("Rendering Emails component");
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  const uid = useContext(UidContext);


  const fetchReceivedEmails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}${mailboxEndpoint}/${userEmail}`
      );
      setReceivedEmails(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        `Error fetching received emails from ${mailboxEndpoint}:`,
        error
      );
      // Handle error
      setLoading(false);
    }
  }, [apiUrl, mailboxEndpoint, userEmail]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/user/${uid}`);
        setUserEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
    fetchReceivedEmails();
  }, [uid, apiUrl, fetchReceivedEmails]);

  const selectAllEmails = (e) => {
    if (e.target.checked) {
      const allEmailIds = receivedEmails.map((email) => email._id);
      setSelectedEmails(allEmailIds);
    } else {
      setSelectedEmails([]);
    }
  };

  const deleteSelectedEmails = async () => {
    try {
      await axios.post(`${apiUrl}api/email/bin/${userEmail}`, {
        emailIds: selectedEmails,
      });
      // Refresh the email list after move/delete
      fetchReceivedEmails();
      // Clear selected emails
      setSelectedEmails([]);
    } catch (error) {
      console.error("Error moving/deleting selected emails:", error);
    }
  };

  return loading ? (
    <CircularProgress
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  ) : (
    <Box
  className={`box ${openDrawer ? 'open' : ''}`}
>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Checkbox size="small" onChange={selectAllEmails} />
        <DeleteOutline onClick={deleteSelectedEmails} />
      </Box>
      <List style={{ maxHeight: "500px", overflowY: "auto" }}>
        {receivedEmails.map((email) => (
          <Email
            email={email}
            key={email._id}
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
          />
        ))}
      </List>
      jugoo
      {receivedEmails.length === 0 && (
        <NoMails message={EMPTY_TABS[mailboxEndpoint]} />
      )}
    </Box>
  );
};

export default Emails;
