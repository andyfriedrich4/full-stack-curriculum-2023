// Importing necessary hooks and functionalities
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Firebase project configuration (replace with your own)
// You can find this in Project Settings -> General -> Scroll Down
const firebaseConfig = {
    apiKey: "AIzaSyCQrWNskkMyqpTuVoGtU9ry7ko1c5D_dMI",
    authDomain: "week-6-hw.firebaseapp.com",
    projectId: "week-6-hw",
    storageBucket: "week-6-hw.appspot.com",
    messagingSenderId: "1079251139618",
    appId: "1:1079251139618:web:6eac4734d6ccb9661d9e7b",
    measurementId: "G-DZ302L7NR5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Creating a context for authentication. Contexts provide a way to pass data through 
// the component tree without having to pass props down manually at every level.
const AuthContext = createContext();

// This is a custom hook that we'll use to easily access our authentication context from other components.
export const useAuth = () => {
    return useContext(AuthContext);
};

// This is our authentication provider component.
// It uses the context to provide authentication-related data and functions to its children components.
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user'))); 
    const [loginError, setLoginError] = useState(null);

    const VALID_USERNAME = "Andy"; 
    const VALID_PASSWORD = "trashtrooper"; 

    // Sign up new users
    const register = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setCurrentUser(userCredential.user);
            // correct and formal way of getting access token
            userCredential.user.getIdToken().then((accessToken) => {
                console.log(accessToken)
            })
            navigate("/");
        })
        .catch((error) => {
            setLoginError(error.message);
        });
    };
    

    // Sign in existing users
    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setCurrentUser(userCredential.user);
            // this method of retrieving access token also works
            console.log(userCredential.user.accessToken)
            navigate("/");
        })
        .catch((error) => {
            setLoginError(error.message);
        });
    };


    // Sign out users
    const logout = () => {
        auth.signOut().then(() => {
        setCurrentUser(null);
        navigate("/login");
        });
    };

    // An object containing our state and functions related to authentication.
    // By using this context, child components can easily access and use these without prop drilling.
    const contextValue = {
        currentUser, 
        login, 
        logout, 
        loginError, 
        register, 
    };

    // The AuthProvider component uses the AuthContext.Provider to wrap its children.
    // This makes the contextValue available to all children and grandchildren.
    // Instead of manually passing down data and functions, components inside this provider can
    // simply use the useAuth() hook to access anything they need.
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}