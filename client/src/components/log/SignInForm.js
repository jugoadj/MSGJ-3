import React, {useState} from 'react';
import axios from 'axios';
import PasswordResetForm from './PasswordResetForm';



const SignInForm = () => {

    const [email, setEmail] = useState ('');
    const [password, setPassword] = useState ('');
    const [passwordForgotten, setPasswordForgotten] = useState (false);
    
    const handleResetPassword = (e) => {
      e.preventDefault();
      setPasswordForgotten (true);
      console.log('Reset password link clicked');}

    const handleLogin = async (e) => {
        e.preventDefault();
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');

        await axios(
          {
            method : "post",
            url: `${process.env.REACT_APP_API_URL}api/user/login`,
            withCredentials: true,
            data: {
                email,
                password,
            }
        })
        .then((res) => {
          console.log(res.data); // Log the response data
          if (res.data.errors) {
              emailError.innerHTML = res.data.errors.email;
              passwordError.innerHTML = res.data.errors.password;
          } else {
              window.location = '/email';
          }
          })
          .catch((err) => {
            console.log(err);
          })
    };


  return (
    <>
    { passwordForgotten ? (
      <>
      <PasswordResetForm/>
      <span></span>
      
      </>
    ) : (
   <form action='' onSubmit={handleLogin} id='sign-up-form'>
    <label htmlFor='email'>Email</label>
    <br/>
    <input type='text' name='email' id='email' onChange={(e) => setEmail (e.target.value)} value={email}/>
    <div className='email error'></div>
    <br/>
    <label htmlFor='password'>Password</label>
    <br/>
    <input type='password' name='password' id='password' onChange={(e) => setPassword (e.target.value)} value={password} />
    <div className='password error'></div>
    <br/>
    <label htmlFor='terms'>I forgot my password. 
    <a id="reset-password" href='/profil' onClick={handleResetPassword}> Reset password?</a>
    </label>
    <br/>
    <br/>
    <input type='submit' value='log in'/>
   </form>
   )}
  </>
  );  
};

export default SignInForm;