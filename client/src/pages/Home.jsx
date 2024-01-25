import React, { useContext } from 'react';
import Main from './Main';
import { UidContext } from '../components/AppContext';
import Navbar from  '../components/navbar'
import Emails from '../components/emails/Emails';

const Home = () => {
  const uid = useContext(UidContext);



  return (
    <>
    
      <div>
        <Navbar/>
       
      </div>
    
    </>
    
    
    
  );
};

export default Home;