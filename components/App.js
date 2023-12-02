import { StyleSheet, Text, View } from 'react-native';
import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from 'firebase/app';
import { 
  getAuth, // access to authentication features:
  signOut, // for logging out:
} from "firebase/auth";
import { // access to Firestore features:
  getFirestore, 
} from "firebase/firestore";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp); // for storaging messages in Firestore

const firebaseProps = {auth, db}

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
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
