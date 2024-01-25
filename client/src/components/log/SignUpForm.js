import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from "./SignInForm";
import 'firebase/storage';



const SignUpForm = () => {
  const [formSubmit, setFormSubmit] = useState (false);
  const [pseudo, setPseudo] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [trustedEmail, setTrustedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controlPassword, setControlPassword] = useState('');
  const [picture, setPicture] = useState("");
  const [picLoading, setPicLoading] = useState(false);


 


  const handleRegister = async (e) => {
    e.preventDefault();
    const terms = document.getElementById('terms');
    const pseudoError = document.querySelector('.pseudo.error');
    const emailError = document.querySelector('.email.error');
    const trustedEmailError = document.querySelector('.trustedEmail.error');
    const passwordError = document.querySelector('.password.error');
    const secretAnswerError = document.querySelector('.secretAnswer.error');
    const questionError = document.querySelector('.secretQuestion.error');
    const pictureError = document.querySelector('.photo.error');
    const passwordConfirmError = document.querySelector('.password-confirm.error');
    const termsError = document.querySelector('.terms.error');

    setPicLoading(true);

    passwordConfirmError.innerHTML = '';
    termsError.innerHTML = '';

    if (password !== controlPassword || !terms.checked) {
      if ( password !== controlPassword ) passwordConfirmError.innerHTML = "passwords doesn't match";
      if (!terms.checked) termsError.innerHTML = "please agree terms and conditions"
    } else {
     
      await axios (
        {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}api/user/register`,
        data: {
          pseudo,
          email,
          trustedEmail,
          secretAnswer,
          secretQuestion,
          picture,
          password
        }
      })
      .then((res) => {
        if (res.data.errors) {
          pseudoError.innerHTML= res.data.errors.pseudo;
          emailError.innerHTML= res.data.errors.email;
          trustedEmailError.innerHTML= res.data.errors.trustedEmail;
          passwordError.innerHTML= res.data.errors.password;
          secretAnswerError.innerHTML= res.data.errors.secretAnswer;
          pictureError.innerHTML= res.data.errors.photo;
          questionError.innerHTML= res.data.errors.secretQuestion;
        } else setFormSubmit (true);
      })
      .catch((err) => console.log(err));
    }
    setPicLoading(false);

  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
        alert("Please Select an Image!");
        return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dnorktqq7");
        fetch("https://api.cloudinary.com/v1_1/dnorktqq7/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setPicture(data.url.toString());
                console.log(data.url.toString());
                setPicLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setPicLoading(false);
            });
    } else {
        alert("Please Select an Image!");
        setPicLoading(false);
        return;
    }
};
    

  return (
    <>
    {formSubmit ? (
      <>
      <SignInForm/>
      <span></span>
      <h4 className="success">Enregistred succesfuly, please login.</h4>
      </>
    ) : (
      <form action='' onSubmit={handleRegister} id='sign-up-form'>
      <label htmlFor='pseudo'>Pseudo</label>
      <br/>
      <input type='text' name='pseudo' id='pseudo' onChange={(e) => setPseudo(e.target.value)} value={pseudo}/>
      <div className='pseudo error'></div>
      <br/>
      <label htmlFor='email'>Email</label>
      <br/>
      <input type='text' name='email' id='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
      <div className='email error'></div>
      <br/>
      <label htmlFor='password'>Password</label>
      <br/>
      <input type='password' name='password' id='password' onChange={(e) => setPassword(e.target.value)} value={password}/>
      <div className='password error'></div>
      <br/>
      <label htmlFor='password-conf'>Confirm password</label>
      <br/>
      <input type='password' name='password' id='password-confirm' onChange={(e) => setControlPassword(e.target.value)} value={controlPassword}/>
      <div className='password-confirm error'></div>
      <br/>
      <h4 className="hint">Security section</h4>
      <br/>
      <label htmlFor='email'>Trusted Email</label>
      <br/>
      <input type='text' name='temail' id='temail' onChange={(e) => setTrustedEmail(e.target.value)} value={trustedEmail}/>
      <div className='trustedEmail error'></div>
      <br/>
      <label htmlFor='secretQuestion'>Secret Question</label>
      <br/>
      <input type='text' name='secretQuestion' id='secretQuestion' onChange={(e) => setSecretQuestion(e.target.value)} value={secretQuestion}/>
      <div className='secretQuestion error'></div>
      <br/>

      <label htmlFor='answer'>Secret Answer</label>
      <br/>
      <input type='password' name='answer' id='secretAnswer' onChange={(e) => setSecretAnswer(e.target.value)} value={secretAnswer}/>
      <div className='secretAnswer error'></div>
      <br/>

      <label htmlFor='photo'>Photo</label>
      <br/>
      <input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      <div className='photo error'></div>
      <br/>

      <input type='checkbox' id='terms' />
      <label htmlFor='terms'>I agree
      <a href='/' target='_blank' rel='noopener noreferrer'> terms and conditions</a>
      </label>
      <div className='terms error'></div>
      <input type='submit' value="Validate" />
      
    </form>
    )}
     </>
    
  );
};

export default SignUpForm;