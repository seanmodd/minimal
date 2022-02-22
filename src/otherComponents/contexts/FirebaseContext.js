//* Account context
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import axios from 'axios';
import { firebaseConfig } from '../config';

import { USER_DATA } from 'src/utils/callbacks';

// require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

// ----------------------------------------------------------------------

const ADMIN_EMAILS = ['demo@minimals.cc'];

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

//! Below is similar to src/__gatsby/auth/SignUp, copied and pasted from it here: https://github.com/seanmodd/next-carx/blob/9f07f4571b6070b262aa674c5c7d91efb7219047/src/__gatsby/auth/SignUp.js#L27-L30
export const setUser = (user) => ({
  type: 'SET_USER',
  payload: { user },
});
//! Above is similar to src/__gatsby/auth/SignUp, copied and pasted from it here: https://github.com/seanmodd/next-carx/blob/9f07f4571b6070b262aa674c5c7d91efb7219047/src/__gatsby/auth/SignUp.js#L27-L30

const reducer = (state, action) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext({
  ...initialState,
  method: 'firebase',
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
  loginWithFaceBook: () => Promise.resolve(),
  loginWithTwitter: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const [, setUserData] = USER_DATA.useSharedState(
    []
  );

  //! Below is what links firebase authentication with strapi users I believe...
  useEffect(
    () =>
      firebase.auth().onAuthStateChanged((user) => {
        const axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        };

        if (user) {
          const docRef = firebase.firestore().collection('users').doc(user.uid);
          docRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                setProfile(doc.data());
              }
            })
            .catch((error) => {
              console.error(error);
            });

          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: true, user },
          });
          axios
            .post(
              // `https://admin.shopcarx.com/firebase/auth/`,
              // `${process.env.NEXT_PUBLIC_STRAPI_DEV}`,
              `${process.env.NEXT_PUBLIC_STRAPI}`,
              // `http://localhost:1337/firebase/auth`,
              {
                token: user.Aa,
              },
              axiosConfig
            )
            .then((res) => {
              console.log('🎉🎉🎉🎉🎉🎉🎀🎀🎀🎀🎀🎀🎀 here is res: ', res.data);
           //   localStorage.userData = JSON.stringify(res.data.user);
              setUserData(res.data.user?.favorites);
              const strapidata = res.data;
              console.log(
                '🎉🎉🎉🎉🎉🎉🎀🎀🎀🎀🎀🎀🎀 here is strapidata: ',
                strapidata
              );
              localStorage.strapijwt = strapidata.jwt;
            });

          console.log(
            ' 🚬🚬🚬🚬🚬🚬🚬🚬 This IS THE ALL IMPORTANT user from FirebaseContext.js inside the AuthProvider payload is as follows: ',
            user
          );
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: false, user: null },
          });
        }
      }),
    [dispatch]
  );

  const login = (email, password) =>
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(
          ' 🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜 The result.user.uid from FirebaseContext.js after login is as follows: ',
          result.user.uid
        );
        console.log(
          ' 🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜 The result.user from FirebaseContext.js  after login  is as follows: ',
          result.user
        );
        console.log(
          ' 🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜 The result from FirebaseContext.js  after login  is as follows: ',
          result
        );
      })
      .catch((error) => {
        console.log('the error is as follows: ', error);
      });

  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const loginWithFaceBook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const loginWithTwitter = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const register = (email, password, firstName, lastName) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .firestore()
          .collection('users')
          .doc(res.user.uid)
          .set({
            uid: res.user.uid,
            email,
            displayName: `${firstName} ${lastName}`,
          });
        console.log(
          ' 🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜 The res.user.uid from FirebaseContext.js after register is as follows: ',
          res.user.uid
        );
        console.log(
          ' 🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜 The res.user from FirebaseContext.js  after register  is as follows: ',
          res.user
        );
        console.log(
          ' 🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜🪜 The res from FirebaseContext.js  after register  is as follows: ',
          res
        );
      });
  };

  const logout = async () => {
    await firebase.auth().signOut();
  };

  const resetPassword = async (email) => {
    await firebase.auth().sendPasswordResetEmail(email);
  };

  const auth = { ...state.user };
  console.log('This is auth from FirebaseContext.js: ', auth);
  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: {
          id: auth.uid,
          email: auth.email,
          photoURL: auth.photoURL || profile?.photoURL,
          displayName: auth.displayName || profile?.displayName,
          role: ADMIN_EMAILS.includes(auth.email) ? 'admin' : 'user',
          phoneNumber: auth.phoneNumber || profile?.phoneNumber || '',
          country: profile?.country || '',
          address: profile?.address || '',
          state: profile?.state || '',
          city: profile?.city || '',
          zipCode: profile?.zipCode || '',
          about: profile?.about || '',
          isPublic: profile?.isPublic || false,
        },
        login,
        register,
        loginWithGoogle,
        loginWithFaceBook,
        loginWithTwitter,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
