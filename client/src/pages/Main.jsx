import React, { useState, Suspense } from "react";
import { Header, SideBar } from "../components/emails";
import { Box, styled } from "@mui/material";
import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import SuspenseLoader from "../components/emails/common/SuspenseLoader";
import Emails from "../components/emails/Emails";
import SideNavBar from "../components/emails/SideNavBar";
import ViewEmail from "../components/emails/ViewEmail";

const Wrapper = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
`;

const MainContent = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

const Main = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

  const toggleDrawer = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  return (
    <>
      <Header toggleDrawer={toggleDrawer} />

      <Wrapper>
        <SideNavBar />
        <SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} />
        <MainContent>
          <Suspense fallback={<SuspenseLoader />}>
            <Routes>
                <Route path="/view" element={<ViewEmail openDrawer={openDrawer} />} />
                <Route path="/bin" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/bindisplay" />} />
                 <Route path="/inbox" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/inbox" />} /> 
                 <Route path="/sent" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/sentemails" />} />
                 <Route path="/starred" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/starreddisplay" />} />
                 <Route
                index // This makes this route the default child route
                element={<Navigate to="inbox" replace />} // Redirect to /email/inbox
              />
            </Routes>
          </Suspense>
        </MainContent>
      </Wrapper>
    </>
  );
};

export default Main;
