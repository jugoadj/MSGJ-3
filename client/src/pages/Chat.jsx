import React, { useState, Suspense } from "react";
import { Header, SideBar } from "../components/chats";
import { Box, styled } from "@mui/material";
import { Outlet, Route, Routes } from "react-router-dom";
import SuspenseLoader from "../components/chats/common/SuspenseLoader";

import SideNavBar from "../components/chats/SideNavBar";
import SingleChat from '../components/chats/Chats'; 

const Wrapper = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
`;

const MainContent = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

const Chat = () => {
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
                     <Route path="/" element={<SingleChat openDrawer={openDrawer} />} />

            </Routes>
          </Suspense>
        </MainContent>
      </Wrapper>
    </>
  );
};

export default Chat;
