import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Home from "../../pages/Home";
import Profil from "../../pages/profil";
import Chat from "../../pages/Chat";
import Main from "../../pages/Main";
import Emails from "../emails/Emails";
import ViewEmail from "../emails/ViewEmail";
import SingleChat from "../chats/Chats";

const index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/email/*" element={<Main />}>
        <Route
                index // This makes this route the default child route
                element={<Navigate to="inbox" replace />} // Redirect to /email/inbox
              />
          <Route
            path="bin"
            element={
              <Emails
                openDrawer={true}
                mailboxEndpoint="api/email/bindisplay"
              />
            }
          />
          <Route
            path="inbox"
            element={
              <Emails openDrawer={true} mailboxEndpoint="api/email/inbox" />
            }
          />
          <Route
            path="sent"
            element={
              <Emails
                openDrawer={true}
                mailboxEndpoint="api/email/sentemails"
              />
            }
          />

          <Route
            path="starred"
            element={
              <Emails
                openDrawer={true}
                mailboxEndpoint="api/email/starreddisplay"
              />
            }
          />
          <Route path="view" element={<ViewEmail openDrawer={true} />} />
        </Route>
        <Route path="/profil" element={<Profil />} />
        <Route path="/chat/*" element={<Chat openDrawer={true}/>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default index;
