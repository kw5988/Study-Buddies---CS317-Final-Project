import { StyleSheet, Text, View } from 'react-native';
// import { firebaseConfig } from './firebaseConfig.js'
// import { initializeApp } from 'firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect} from 'react';

import HomeScreen from './components/Homepage';

// import { 
//   getAuth, // access to authentication features:
//   signOut, // for logging out:
// } from "firebase/auth";
// import { // access to Firestore features:
//   getFirestore, 
// } from "firebase/firestore";

// Your web app's Firebase configuration
//For our StudyBuddies Firebase Team Account registration info
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAZdD7DvAhCsyuytcIYMcsCLS9SBe53g7Q",
//   authDomain: "study-buddies-cs317.firebaseapp.com",
//   projectId: "study-buddies-cs317",
//   storageBucket: "study-buddies-cs317.appspot.com",
//   messagingSenderId: "859373613647",
//   appId: "1:859373613647:web:32e75334a39479b5a3b03a",
//   measurementId: "G-Q77N8LXH92"
// };


//create stack for screen navigation
const Stack = createStackNavigator();

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);
// const db = getFirestore(firebaseApp); // for storaging messages in Firestore

// const firebaseProps = {auth, db}

export default function App() {

  const defaultEmail = 'jd100@wellesley.edu';
  const defaultPassword = 'abcd'
  
  const [email, setEmail] = useState(defaultEmail); // Provide default email for testing
  const [password, setPassword] = useState(defaultPassword); // Provide default passwored for testing
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  function logOut() {
    console.log('logOut'); 
    console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
    console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    console.log(`logOut: setLoggedInUser(null)`);
    setLoggedInUser(null);
    console.log('logOut: signOut(auth)');
    signOut(auth); // Will eventually set auth.currentUser to null     
  }
  
  const loginProps = { 
    defaultEmail, defaultPassword, 
    email, setEmail, 
    password, setPassword, 
    loggedInUser, setLoggedInUser, logOut
   }
  

  
  
   return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
