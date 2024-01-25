import React, { useContext } from 'react';
import Log from '../components/log';
import { UidContext } from '../components/AppContext';
import Navbar from '../components/navbar';

const Profil = () => {
  const uid = useContext(UidContext);


  return (
    <>
    <Navbar/>
    <div className='profil-page'>
     
      {uid ? 
      (
      <h1>UPDATE PAGE</h1>
      ) : 
      (  
      <div className='log-container'>
        <Log signin={false} signup={true} />
        <div className='img-container'>
          <img src='./img/log1.png' alt='img-log'/>
        </div>
      </div>
      )
      }      
    </div></>
     
  );
};

export default Profil;