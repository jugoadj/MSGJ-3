import { Drawer, styled } from "@mui/material";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { UidContext } from "../AppContext";
import axios from 'axios';
import { Box, Stack,} from "@mui/material";
import { getSender } from "../../config/ChatLogics";
import SuspenseLoader from "./common/SuspenseLoader";
import { Suspense } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import msggImage from './msgg.png';
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectedChatContext } from '../../Context/ChatProvider'; 
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import CreateGroupForm from "./GroupChat";










const StyledDrawer = styled(Drawer)`
    margin-top: 54px;
`

const SideBar = ({ toggleDrawer, openDrawer}) => {
      const [showForm, setShowForm] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;
    const [loggedUser, setLoggedUser] = useState();//crée un état loggedUser avec une valeur initiale non définie. setLoggedUser est la fonction qui sera utilisée pour mettre à jour cet état

    const uid = useContext(UidContext);

    const { selectedChat, setSelectedChat, chats, setChats, loading, setLoading, user } = useContext(SelectedChatContext);
    const [userId, setUserId] = useState('');

    const [chatName, setChatName] = useState('');

//        const createGroup = () => {
//         try {

//             setLoading(true);

//             const { data } = axios.post(
//                 `${apiUrl}api/chat/group/${uid}`,
//                 { userId , chatName }

                
//             );
//             setChats([data, ...chats]);
//             setSelectedChat(data);
//             setLoading(false);
//         }
//         catch (error) {
//             console.error(error);
//         }
    
//   };

   

    const fetchChats = useCallback(async () => {
          setLoading(true);

    if (!uid) { 
        console.error("UID is not defined");
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}api/chat/${uid}`);
        setChats(response.data);
        console.log("uid ilehouuuuuuuuuuuuuz", uid);
        console.log("response.data ilehouuuuuuuuuuuuuz", response.data);
        setLoading(false);
        
    } catch (error) {
        console.error("Error fetching chats jugoooo:", error);
    }
}, [uid, apiUrl]);

useEffect(() => {
    if (uid) {
        fetchChats();
    }
}, [fetchChats, uid]);




   
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
                    
                    width: 300,
                    marginLeft:8,
                    borderRight: 'none',
                    background: '#f5F5F5',
                    marginTop: '62px',
                    height: 'calc(100vh - 64px)',
                },
            }}
        >
            <Box
                pb={3}
                px={3}
                fontSize="28px"
                fontFamily="Work sans "
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                
                 <div>
                <Fab margin="5px" color="black" aria-label="add" display="flex" onClick={() => setShowForm(true)}>
                    <AddIcon style={{ color: 'black' }} />
                </Fab>

                {/* {showForm && <CreateGroupForm createGroup={createGroup} />} */}
                </div>
                            
            </Box>
            <Box sx={{ width: 300, height: '100%', overflow: 'auto' }}>
                <Stack direction="column" spacing={2}  >
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                            <SuspenseLoader />
                        </div>
                    ) : (
                        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><SuspenseLoader /></div>}>
                            {chats.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                                    <img src={msggImage} style={{ width: '100px', height: '100px' }} />
                                    Vous n'avez pas encore de chats
                                </div>
                            ) : (
                        chats.map((chat) => (
                            <div 
                                key={chat._id} 
                                        style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}



                                onClick={() => setSelectedChat(chat) }
                                 
                            >
                                <h1>{chat.isGroupChat ? chat.chatName : getSender(loggedUser, chat.users)}</h1>
                                <div className="chat">
                                    <div className="chat__details">
                                        <div className="chat__name">
                                            {chat.latestMessage && chat.latestMessage.file ? (
                                                chat.latestMessage.file.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                                    <span>
                                                        {chat.latestMessage.sender._id === uid 
                                                            ? `Vous avez envoyé une photo à : ${chat.users.find(user => user._id !== uid).pseudo}` 
                                                            : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé une photo`}
                                                            </div>}
                                                    </span>                    
                                                ) : (
                                                    <span>
                                                        {chat.latestMessage.sender._id === uid 
                                                            ? `Vous avez envoyé un document à : ${chat.users.find(user => user._id !== uid).pseudo}` 
                                                            : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé un document`}
                                                            </div>}
                                                    </span> 
                                                )
                                            ) : chat.latestMessage && chat.latestMessage.content.startsWith('data:audio') ? (
                                                <span >
                                                    <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />

                                                    { chat.latestMessage.sender._id === uid 
                                                        ? `Vous avez envoyé une audio à : ${chat.users.find(user => user._id !== uid).pseudo}` 
                                                        : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé un audio`}
                                                          </div>}
                                                </span> 
                                            ) : chat.latestMessage && chat.latestMessage.content.startsWith('data:video') ? (
                                                <span>
                                                    {chat.latestMessage.sender._id === uid 
                                                        ? `Vous avez envoyé une video à : ${chat.users.find(user => user._id !== uid).pseudo}` 
                                                        : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé une video`}
                                                            </div>}
                                                </span> 
                                            ) : chat.latestMessage && chat.latestMessage.content.startsWith('http') ? (
                                                <span>
                                                    {chat.latestMessage.sender._id === uid 
                                                        ? `Vous avez envoyé un lien à : ${chat.users.find(user => user._id !== uid).pseudo}` 
                                                        : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé une video`}
                                                            </div>}
                                                </span> 
                                            ) : chat.latestMessage ? (
                                                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p style={{fontFamily:"fantasy"}} >{chat.users.find(user => user._id !== uid).pseudo}</p>
                                                    <img src={chat.users.find(user => user._id !== uid).picture} style={{width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                    {chat.latestMessage.sender._id === uid 
                                                        ? "Vous"
                                                        : chat.latestMessage.sender.pseudo} 
                                                    : {chat.latestMessage.content.length > 50 
                                                        ? chat.latestMessage.content.substring(0, 35) + "..." 
                                                        : chat.latestMessage.content}
                                                    </span>
                                            ) : `Démarrer une conversation avec 
                                                ${chat.users.find(user => user._id !== uid).pseudo}`}
                                        </div>
                                    </div>
                                </div>

                                {/* <DeleteIcon  onClick={() => deleteChat()} selectedChat /> */}
                            </div>
                            
                            
                            ))
                            )}
                        
                        </Suspense>
                        
                        
                        )}

                </Stack>

            </Box>
        </StyledDrawer>
     
    )

}


export default SideBar;