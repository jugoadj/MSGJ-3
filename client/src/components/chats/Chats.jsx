import React, { useContext, useState, useEffect, useRef  } from 'react';
import {  FiFile, FiSend} from "react-icons/fi";
import { IoIosMic } from "react-icons/io";
import { SelectedChatContext } from '../../Context/ChatProvider'; 
import axios from 'axios';
import ScrollableChat from "./ScrollableChat";
// import { Box, CircularProgress } from "@mui/material";
// import { Checkbox } from "@mui/material";
// import { DeleteOutline, Margin } from "@mui/icons-material";
// import { List } from "@mui/material";
import msggImage from './msg.jpg';
import './style.css';
import { UidContext } from "../AppContext";
// import soundFile from './sound.mp3';
import io from "socket.io-client";
var  socket, selectedChatCompare;










 const SingleChat = ({ openDrawer }) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const { selectedChat, setSelectedChat, chats, setChats, loading, setLoading, user } = useContext(SelectedChatContext);

    const uid = useContext(UidContext);

    const bottomRef = useRef(null);

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
});
    

    

    let mediaRecorder;
let recordedChunks = [];
  

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.addEventListener('dataavailable', function(e) {
          recordedChunks.push(e.data);
        });
      });
  }

    const stopAndDisplayAudio = async () => {
  if (mediaRecorder) {
    mediaRecorder.stop();

    // Attendre que l'enregistrement soit terminé
    mediaRecorder.addEventListener('stop', async function() {
      let audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });

      recordedChunks = [];

      let reader = new FileReader();
      reader.readAsDataURL(audioBlob); 
      reader.onloadend = function() {
        let base64data = reader.result;                

        // Créer un nouvel élément audio et le jouer
        let audio = new Audio(base64data);
        audio.play();

        // Mettre à jour l'URL de l'audio
        setNewMessage(base64data);
      }
    });
  }
}


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

    socket.emit("join chat", selectedChat._id); //envoie un événement "join chat" depuis le client vers le serveur via Socket.IO. L'événement est accompagné de l'ID du chat sélectionné (selectedChat._id).


  } catch (error) {
    console.error(error); // Affiche l'erreur dans la console
    setLoading(false); // Arrête le spinner de chargement même en cas d'erreur
  }
};
 useEffect(() => {
    socket = io(apiUrl); // crée une connexion Socket.IO à l'endpoint spécifié (le serveur)
    console.log(user);
    if (user) {
      socket.emit("setup", user);
    } else {
      console.log("User is not defined"); 
    }
    socket.on("connection", () => setSocketConnected(true)); // gestionnaire d'événements pour l'événement "connection" qui met à jour l'état socketConnected à true lorsque la connexion est établie
  }, [user]);

 useEffect(() => { // exécuté la fonction fetchMessages chaque fois que selectedChat change
    fetchMessages(); 
    selectedChatCompare = selectedChat; //selectedChatCompare est une variable qui contient les info du chat selectionner


  }, [selectedChat]);




  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => { // gestionnaire d'événements pour l'événement "message recieved" qui est déclenché lorsque le serveur envoie un événement "message recieved" au client via Socket.IO.
      //La fonction de rappel reçoit newMessageReceived comme argument, qui est le nouveau message reçu du serveur.
      if( !selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){ //
        //notification
      }else{
        setMessages([...messages, newMessageRecieved]);
      }
    });

  });




    const sendMessage = async (event) => {//La fonction sendMessage est appelée lorsque l'utilisateur appuie sur la touche Entrée ou clique sur le bouton Envoyer.event est l'événement qui déclenche la fonction.

      
    if ((event.key === "Enter" || event.type === 'click') && newMessage) { 
      // let audio = new Audio(soundFile);
      // audio.play();

      //Si l'utilisateur appuie sur la touche Entrée ou clique sur le bouton Envoyer et que la zone de texte n'est pas vide, la fonction se poursuit.
      // socket.emit("stop typing", selectedChat._id);
      try {
        
        setNewMessage("");//met à jour l'état newMessage avec une chaîne vide pour effacer le champ de saisie de la zone de texte.
        const { data } = await axios.post( //envoie une requête POST à l'API pour enregistrer le nouveau message dans la base de données.
          //data contient la réponse du serveur à la requête POST
          `${apiUrl}api/message/${uid}`,
          {
            content: newMessage, 
            chatId: selectedChat._id,  //dans le contexte de MongoDB , chaque document stocké dans la base de données a une propriété unique _id qui est automatiquement générée par MongoDB lors de la création du document. C'est un identifiant unique pour chaque document.
          //ici selcted chat est mis a jour quand on clique sur chat dans mychat.js (onClick={() => setSelectedChat(chat)}//lorsque 
          //l'utilisateur clique sur un chat, il met à jour l'état selectedChat avec le chat sur lequel il a cliqué.)
          }
        );
        socket.emit("new message", data);




        setMessages([...messages, data]); //met à jour l'état messages avec les messages actuels plus le nouveau message.

      } catch (error) {
        console.error(error); // Affiche l'erreur dans la console
        
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);// met à jour l'état newMessage avec la valeur actuelle de la zone de texte.

    if (!socketConnected) { //Si la connexion socket n'est pas établie (socketConnected est false), la fonction se termine immédiatement.
      return;
    }
    

    if (!typing) {
      setTyping(true);
      // socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        // socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };



  
   


return (
<div>
{selectedChat ? (
  <div className="chat-container">
   <div className="chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <p>
    <span className={`status ${user.isonline ? 'online' : 'offline'}`}></span>
    {user.isonline ? 'En ligne' : 'Hors ligne'}
  </p>
  <h2 style={{ textAlign: 'center', paddingLeft: "10px" }}>
    {selectedChat.isGroupChat 
      ? selectedChat.chatName 
      : selectedChat.users.filter(user => user._id !== uid)[0]?.pseudo
    }
  </h2>
</div>

    <div className="content-container" style={{ overflowY: 'auto', maxHeight: "420px" }}>
      <div className='souheader'>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {selectedChat.isGroupChat ? (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {selectedChat.users.slice(0, 4).map(user => (
          <img 
            key={user._id}
            src={user.picture} 
            alt="User avatar"
            style={{ borderRadius: '50%', width: '25px', height: '25px' }}
          />
        ))}
      </div>
    ) : (
      <img 
        src={selectedChat.users.find(user => user._id !== uid)?.picture} 
        alt="User avatar"
        style={{ borderRadius: '50%', width: '100px', height: '100px' }}
      />
    )}
    <h2 style={{ textAlign: 'center' }}>
      {selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.users.filter(user => user._id !== uid)[0]?.pseudo}
    </h2>
    <p style={{ textAlign: 'center' }}>
      {new Date(selectedChat.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
    </p>
  </div>
</div>
      <div className='messages'>
        <ScrollableChat messages={messages}  />
      </div>
          <div ref={bottomRef}></div>

    </div>

    <div className="chat-input"  >
 

<input 
  className="input" 
  type="text" 
  placeholder="Écrivez votre message ici" 
  value={newMessage.startsWith('data:audio') ? '' : newMessage} 
  onChange={typingHandler}
  onKeyDown={sendMessage}
/>

{newMessage.startsWith('data:audio') && (
  <div style={{ width: '100%',height: '50px' }}>
    <audio style={{ width: '100%' ,height:"100%"}} src={newMessage} controls />
  </div>
)}

<button 
  aria-label="Envoyer"
  color={"white"}  
>
  <FiFile /> 
</button>
    <button aria-label="Envoyer"color={"white"}  onMouseDown={startRecording} onMouseUp={stopAndDisplayAudio}><IoIosMic /> </button>
      <button  onClick={sendMessage} type="submit"><FiSend/></button>
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