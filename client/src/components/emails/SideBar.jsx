
import { Drawer, styled } from "@mui/material";

import SideBarContent from "./SideBarContent";

const StyledDrawer = styled(Drawer)`
    margin-top: 54px;
`

const SideBar = ({ toggleDrawer, openDrawer }) => {

    return (
        <StyledDrawer
            anchor='left'
            open={openDrawer}
            onClose={toggleDrawer}
            hideBackdrop={true}
            ModalProps={{
                keepMounted: true,
            }}
            variant="persistent"
            sx={{
            '& .MuiDrawer-paper': { 
                        overflow: 'hidden',

                width: 200,
                marginLeft:8,
                borderRight: 'none',
                background: '#f5F5F5',
                marginTop: '64px',
                height: 'calc(100vh - 64px)',
                '@media (max-width: 900px)': {
                    width: 150,
                },
                
                '@media (max-width: 600px)': {
                    width: 150,
                    display: 'flex',
                    alignItems: 'center',                },
            },
        }}
          >
            
            <SideBarContent />
        </StyledDrawer>
    )
}

export default SideBar;