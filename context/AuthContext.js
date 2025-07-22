// // context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import { auth } from '../firebase';            // adjust path if needed
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
// } from 'firebase/auth';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // keep local `user` in sync with Firebase Auth
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
//       console.log("🔥 onAuthStateChanged:", fbUser);
//       setUser(fbUser);
//     });
//     return unsubscribe;
//   }, []);

//   // **Return** the UserCredential so screens can read `.user.uid`
//   const signup = (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
//   };

//   const login = (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//   const logout = () => {
//     return signOut(auth);
//   };

//   return (
//     <AuthContext.Provider value={{ user, signup, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





import config from '../config';
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await fetch(`${config.API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(response);
    // try {
    //   const response = await fetch(`${config.API_BASE_URL}/api/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     await AsyncStorage.setItem('auth_token', data.token);
    //     setUser(data.user);
    //     return data;
    //   } else {
    //     throw new Error(data.message || 'Login failed!');
    //   }
    // } catch (error) {
    //   console.error('Login error:', error);
    //   throw error;
    // }
  };

  const signup = async (email, password, confirmPassword) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, password_confirmation: confirmPassword}),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        await AsyncStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return data;
      } else {
        throw new Error(data.message || 'Registration failed!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const token = await AsyncStorage.getItem('auth_token');

    try {
      await fetch(`${config.API_BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.warn('Logout request failed, clearing token anyway!');
    }

    await AsyncStorage.removeItem('auth_token');
    setUser(null);
  };

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('auth_token');

    if (!token) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/me`, { 
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        setUser(null);
        await AsyncStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Auth check error: ', error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
