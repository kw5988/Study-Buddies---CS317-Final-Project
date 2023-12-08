import { useState} from "react";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './components/Homepage';
import MainScreen from './components/MainScreen';
import FindStudyGroup from './components/FindStudyGroup';
import LoginScreen from './components/LogInOutScreen';
import StateContext from './components/StateContext.js';
import SignUpScreen from './components/SignUp.js';
import FindStudyGroupFromMap from "./components/FindStudyGroupFromMap.js";

import StudyGroupDetails from './components/StudyGroupDetails';
import ViewCampusMap from './components/ViewCampusMap';
import CreateStudyGroup from "./components/CreateStudyGroup.js";

import { emailOf } from './utils';
import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from 'firebase/app';
import { // access to authentication features:
         getAuth, 
         // for logging out:
         signOut
} from "firebase/auth";
import { // access to Firestore features:
         getFirestore, 
} from "firebase/firestore";


// New for images:
import { // access to Firebase storage features (for files like images, video, etc.)
         getStorage, 
} from "firebase/storage";
import FindStudyGroupFromMarker from "./components/FindStudyGroupFromMap.js";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// New for images:
const db = getFirestore(firebaseApp); // for storaging messages in Firestore


const storage = getStorage(firebaseApp, 
    firebaseConfig.storageBucket) // for storaging images in Firebase storage

const firebaseProps = {auth, db, 
storage // New for images
}

//create stack for screen navigation
const Stack = createStackNavigator();


export default function App() {

    const defaultEmail = '';
    const defaultPassword = '';  
    // Shared state for authentication 
    const [email, setEmail] = useState(defaultEmail); // Provide default email for testing
    const [password, setPassword] = useState(defaultPassword); // Provide default passwored for testing
    // const [email, setEmail] = useState(''); // Provide default email for testing
    // const [password, setPassword] = useState(''); // Provide default passwored for testing
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    /** 
     * Function to log out the user. 
     */
  function logOut() {
    console.log('logOut'); 
    console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
    console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    console.log(`logOut: setLoggedInUser(null)`);
    setLoggedInUser(null);
    setMessage('Logged Out.')
    console.log('logOut: signOut(auth)');
    signOut(auth); // Will eventually set auth.currentUser to null
        
  }
  
    const loginProps = { 
                        defaultEmail, defaultPassword, 
                        email, setEmail, 
                        password, setPassword, 
                        loggedInUser, setLoggedInUser, logOut, name, setName, message, setMessage
                       }

    const allProps = {firebaseProps,loginProps}
   
    return (
    <StateContext.Provider value={allProps}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="FindStudyGroup" component={FindStudyGroup} />

        <Stack.Screen name="LoginScreen" component={LoginScreen} /> 
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />

        <Stack.Screen name="StudyGroupDetails" component={StudyGroupDetails} />
        <Stack.Screen name="ViewCampusMap" component={ViewCampusMap} />
        <Stack.Screen name="FindStudyGroupFromMap" component={FindStudyGroupFromMap} />
        <Stack.Screen name="CreateStudyGroup" component={CreateStudyGroup} />

        {/* <Stack.Screen name="FindStudyGroup" component={FindStudyGroup} /> */}
        {/* <Stack.Screen name="Login" component={LoginScreen} />
         */}
      </Stack.Navigator>
    </NavigationContainer>
    </StateContext.Provider>
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
