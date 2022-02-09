import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import initializeAuth from "./Firebase/firebase.initialize";

initializeAuth();
// const googleProvider = new GoogleAuthProvider();
const App = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [havingAccount, setHavingAccount] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const auth = getAuth();
  // const handleGoogleSign = () => {
  //   signInWithPopup(auth, googleProvider).then((result) => {
  //     const user = result.user;
  //     console.log(user);
  //   });
  // };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    updateProfile(auth.currentUser, {
      displayName: { userName },
    }).then((result) => {});
  };
  console.log(userName);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const createNewUserFunction = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setPasswordError("");
        emailVerification();
        handleUserNameChange();
      })
      .catch((error) => {
        const errorMessage = error.message;
        setPasswordError(errorMessage);
      });
  };

  const processingSignInFunction = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setPasswordError("");
      })
      .catch((error) => {
        const errorMessage = error.message;
        setPasswordError(errorMessage);
      });
  };

  const emailVerification = () => {
    sendEmailVerification(auth.currentUser).then((result) => {
      console.log(result);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordError("Password should be at least 6 character");
    } else if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      return setPasswordError("Password must have two upper cases");
    } else {
      setPasswordError("");
    }
    havingAccount
      ? processingSignInFunction(email, password)
      : createNewUserFunction(email, password);
  };

  const handleAlreadyHavingAccount = () => {
    setHavingAccount(!havingAccount);
  };

  // if (password.length < 6) {
  //   setPasswordError("Password should be at least 6 character");
  // }
  const resetPassword = () => {
    sendPasswordResetEmail(auth, email).then((result) => {
      console.log(result);
    });
  };
  return (
    <div className="mx-5">
      <form onSubmit={handleSubmit}>
        <h2 className="text-primary">
          Please {havingAccount ? "Sign in" : "Register"}
        </h2>
        {!havingAccount && (
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
              User Name
            </label>
            <div className="col-sm-10">
              <input
                required
                onBlur={handleUserNameChange}
                type="text"
                className="form-control"
              />
            </div>
          </div>
        )}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              required
              onBlur={handleEmailChange}
              type="email"
              className="form-control"
              id="inputEmail3"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              required
              onBlur={handlePasswordChange}
              type="password"
              className="form-control"
              id="inputPassword3"
            />
          </div>
          <div className="row mb-3">
            <div className="col-sm-10 offset-sm-2">
              <div className="form-check">
                <input
                  onChange={handleAlreadyHavingAccount}
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck1"
                />
                <label className="form-check-label" htmlFor="gridCheck1">
                  Already have an Account?
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="text-danger">
          <h3>{passwordError} </h3>
        </div>

        <button type="submit" className="btn btn-primary">
          {havingAccount ? "Sign in" : "Register"}
        </button>
        <button onClick={resetPassword}>Reset Password</button>
      </form>

      {/* <button onClick={handleGoogleSign}>Sign in with google</button> */}
    </div>
  );
};

export default App;
