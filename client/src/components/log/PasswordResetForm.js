import React, { useState } from "react";
import axios from "axios";
import SignInForm from "./SignInForm";

const PasswordResetForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [error, setError] = useState("");
  const [formSubmit, setFormSubmit] = useState("");

  const handleWrapper = async (e) => {
    e.preventDefault();
    handleRequestReset();
    handleGetSecretQuestion();
  };
  const handleRequestReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/trustedemail`,
        {
          email,
        }
      );

      if (response.data.errors) {
        setError(response.data.errors.message);
      } else {
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while requesting password reset.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const passwordConfirmError = document.querySelector(
      ".password-confirm.error"
    );

    passwordConfirmError.innerHTML = "";
    if (newPassword !== confirmNewPassword) {
      passwordConfirmError.innerHTML = "passwords doesn't match";
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}api/user/resetpassword`,
          {
            email,
            otp,
            nouveauMotDePasse: newPassword,
          }
        );

        if (response.data.errors) {
          setError(response.data.errors.message);
        } else {
          setFormSubmit(true);
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while resetting the password.");
      }
    }
  };

  const handleGetSecretQuestion = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/secretquestion`,
        {
          email,
        }
      );

      if (response.data.secretQuestion) {
        setSecretQuestion(response.data.secretQuestion);
        setStep(3); // Move to the step where secret answer is entered
      } else {
        setError("Secret question not found.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while getting the secret question.");
    }
  };

  const handleResetPasswordWithSecretAnswer = async (e) => {
    e.preventDefault();
    const passwordConfirmError = document.querySelector(
      ".password-confirm.error"
    );

    passwordConfirmError.innerHTML = "";
    if (newPassword !== confirmNewPassword) {
      passwordConfirmError.innerHTML = "passwords doesn't match";
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}api/user/resetpassword2`,
          {
            email,
            secretAnswer,
            newPassword,
          }
        );

        if (response.data.message) {
          setFormSubmit(true);
        } else {
          setError("Password reset failed.");
        }
      } catch (error) {
        console.error(error);
        setError(
          "An error occurred while resetting the password with the secret answer."
        );
      }
    }
  };

  return (
    <>
      {formSubmit ? (
        <>
          <SignInForm />
          <span></span>
          <h4 className="success">
            Your password has been successfully reset, please login.
          </h4>
        </>
      ) : (
        <div>
          {step === 1 && (
            <form onSubmit={handleWrapper}>
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <br />
              <button type="button" onClick={handleRequestReset}>
                Use your recuperation email
              </button>
              <br />
              <br />
              <button type="button" onClick={handleGetSecretQuestion}>
                Use your secret question
              </button>
              <div className="error"></div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <h4 className="success">
                Confirmation code was sent to your trusted email.
              </h4>
              <br />
              <label htmlFor="otp">Confirmation Code</label>
              <br />
              <input
                type="text"
                id="pseudo"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <br />

              <label htmlFor="password">New Password</label>
              <br />
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="password error"></div>
              <br />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <br />
              <input
                type="password"
                id="confirmPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="password-confirm error"></div>
              <br />
              <br />
              <button type="submit">Reset Password</button>
              <br />
              <div className="error">{error}</div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPasswordWithSecretAnswer}>
              <h4 className="hint"> {secretQuestion} </h4>
              <br />
              <label htmlFor="otp">Secret Answer</label>
              <br />
              <input
                type="password"
                id="pseudo"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
              />
              <br />
              <label htmlFor="password">New Password</label>
              <br />
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="password error"></div>
              <br />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <br />
              <input
                type="password"
                id="confirmPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="password-confirm error"></div>
              <br />
              <br />
              <button type="submit">Reset Password</button>
              <br />
              <div className="error">{error}</div>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default PasswordResetForm;
