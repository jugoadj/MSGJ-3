import React, { useContext, useState, useEffect  } from 'react';
import { SelectedChatContext } from '../../Context/ChatProvider'; 
import axios from 'axios';
import ScrollableChat from "./ScrollableChat";
import { Box, CircularProgress } from "@mui/material";
import { Checkbox } from "@mui/material";
import { DeleteOutline, Margin } from "@mui/icons-material";
import { List } from "@mui/material";
import msggImage from './msg.jpg';
import './style.css';
import { UidContext } from "../AppContext";





 const SingleChat = ({ openDrawer }) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const { selectedChat, setSelectedChat, chats, setChats, loading, setLoading, user } = useContext(SelectedChatContext);

      const uid = useContext(UidContext);



const fetchMessages = async () => {
  if (!selectedChat) { //Si aucun chat n'est sélectionné, la fonction se termine immédiatement.
    
    return;
  }
  console.log('fetchMessages called with selectedChat:', selectedChat);

  try {
    

    setLoading(true); //met l'état loading à true pour afficher le spinner de chargement.

    const { data } = await axios.get( //envoie une requête GET à l'API pour récupérer les messages du chat sélectionné.
      //data contient la réponse du serveur à la requête GET  
      `${apiUrl}api/message/${selectedChat._id}`
      
    );

    setMessages(data);
    console.log(selectedChat.users)
    setLoading(false);


  } catch (error) {
    console.error(error); // Affiche l'erreur dans la console
    setLoading(false); // Arrête le spinner de chargement même en cas d'erreur
  }
};

 useEffect(() => { // exécuté la fonction fetchMessages chaque fois que selectedChat change
    fetchMessages(); 

  }, [selectedChat]);

 
// Remplacez les autres composants Chakra UI par leurs équivalents Material-UI

return (
<div>
{selectedChat ? (
  <div className="chat-container">
    <div className="chat-header">
       <p>
    <span className={`status ${user.isonline ? 'online' : 'offline'}`}></span>
    {user.isonline ? 'En ligne' : 'Hors ligne'}
  </p>
    </div>

    <div className="content-container" style={{ overflowY: 'auto', maxHeight: "420px" }}>
      <div className='souheader'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={selectedChat.users.filter(user => user.id !== uid)[0]?.picture} 
            alt="User avatar"
            style={{ borderRadius: '50%', width: '100px', height: '100px' }}
          />
          <h2 style={{ textAlign: 'center' }}>
            {selectedChat.users.filter(user => user.id !== uid)[0]?.pseudo}
          </h2>
          <p style={{ textAlign: 'center' }}>
            {new Date(selectedChat.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="messages">
        <ScrollableChat messages={messages} />
      </div>
    </div>

    <div className="chat-input">
      <input className="input" type="text" placeholder="Écrivez votre message ici" />
      <button type="submit">Envoyer</button>
    </div>
  </div>
) : (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <img style={{ width:"350px", height: '350px' }} src={msggImage} alt="Placeholder" />
    <p style={{ fontFamily:"times ", fontSize:"30px" }} >Aucun chat sélectionné</p>
  </div>
)}

</div>
);
};


export default SingleChat;