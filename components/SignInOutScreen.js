import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import { useContext } from "react";
import StateContext from './StateContext.js';
import { // for email/password authentication: 
         createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
         // for logging out:
         signOut}  from "firebase/auth";
import { emailOf } from '../utils';
//import styles from '../styles';

export default function LoginScreen () {

  
  const allProps = useContext(StateContext);
  const loginInfo = allProps.loginProps;
  const firebaseInfo = allProps.firebaseProps;

  console.log(allProps);
  const [errorMsg, setErrorMsg] = useState('');
  
    useEffect(() => {
      // Executed when entering component
      console.log('hello:', firebaseInfo.auth.currentUser);
      console.log('Entering SignInOutPScreen');
      console.log(`on enter: emailOf(auth.currentUser)=${emailOf(firebaseInfo.auth.currentUser)}`);
      console.log(`on enter: emailOf(loginProps.loggedInUser)=${emailOf(loginInfo.loggedInUser)}`);
      if (loginInfo.email !== '' && loginInfo.password !== '') {
        // If defaults are provided for email and password, 

        // use them to log in to avoid the hassle of logging in
        // console.log(`on enter: attempting to sign in default user ${loginProps.email}`);
        // signInUserEmailPassword();
      } 
      setErrorMsg(''); // Clear any error message
      // console.log(`on enter: checkEmailVerification()`);
      // checkEmailVerification();

      return () => {
        // Executed when exiting component
        console.log('Exiting SignInOutScreen');
        console.log(`on exit: emailOf(auth.currentUser)=${emailOf(firebaseInfo.auth.currentUser)}`);
        console.log(`on exit: emailOf(logingProps.loggedInUser)=${emailOf(loginInfo.loggedInUser)}`);
      }
    }, []);

    function signUpUserEmailPassword() {
      console.log('called signUpUserEmailPassword');
      console.log('email:', loginInfo.email)
      console.log('password:', loginInfo.password)
      if (firebaseInfo.auth.currentUser) {
        loginInfo.logOut(firebaseInfo.auth); // sign out auth's current user (who is not loggedInUser, 
                       // or else we wouldn't be here
      }
      
      if (!(loginInfo.email.includes('@'))) {
        setErrorMsg('Not a valid email address');
        return;
      }
      if (loginInfo.password.length < 6) {
        setErrorMsg('Password too short');
        return;
      }
      // Invoke Firebase authentication API for Email/Password sign up 
      console.log('firebaseInfo.auth', firebaseInfo.auth);
      console.log('before createUserWithEmailandPassword', loginInfo.email, loginInfo.password);
      //console.log(loginInfo.email, loginInfo.password)
      createUserWithEmailAndPassword(firebaseInfo.auth, loginInfo.email, loginInfo.password)
        .then(() => {
          console.log(`signUpUserEmailPassword: sign up for email ${loginInfo.email} succeeded (but email still needs verification).`);
  
          // Clear email/password inputs
          loginInfo.setEmail(loginInfo.defaultEmail);
          loginInfo.setPassword(loginInfo.defaultPassword);
  
          // Note: could store userCredential here if wanted it later ...
          // console.log(`createUserWithEmailAndPassword: setCredential`);
          // setCredential(userCredential);
  
          // Send verication email
          console.log('signUpUserEmailPassword: about to send verification email');
          sendEmailVerification(firebaseInfo.auth.currentUser)
          .then(() => {
              console.log('signUpUserEmailPassword: sent verification email');
              setErrorMsg(`A verification email has been sent to ${loginInfo.email}. You will not be able to sign in to this account until you click on the verification link in that email.`); 
              // Email verification sent!
              // ...
            });
        })
        .catch((error) => {
          console.log(`signUpUserEmailPassword: sign up failed for email ${loginInfo.email}`);
          const errorMessage = error.message;
          // const errorCode = error.code; // Could use this, too.
          console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
          setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
        });
    }

    function signInUserEmailPassword() {
      console.log('called signInUserEmailPassword');
      console.log(`signInUserEmailPassword: emailOf(currentUser)0=${emailOf(firebaseInfo.auth.currentUser)}`); 
      console.log(`signInUserEmailPassword: emailOf(loginProps.loggedInUser)0=${emailOf(loginInfo.loggedInUser)}`); 
      // Invoke Firebase authentication API for Email/Password sign in 
      // Use Email/Password for authentication 
      console.log('signInWithEmailAndPassword', loginInfo.email, loginInfo.password);
      signInWithEmailAndPassword(firebaseInfo.auth, loginInfo.email, loginInfo.password)
                                 /* 
                                 defaultEmail ? defaultEmail : email, 
                                 defaultPassword ? defaultPassword : password
                                 */
        .then((userCredential) => {
          console.log(`signInUserEmailPassword succeeded for email ${loginInfo.email}; have userCredential for emailOf(auth.currentUser)=${emailOf(firebaseInfo.auth.currentUser)} (but may not be verified)`); 
          console.log(`signInUserEmailPassword: emailOf(currentUser)1=${emailOf(firebaseInfo.auth.currentUser)}`); 
          console.log(`signInUserEmailPassword: emailOf(loginProps.loggedInUser)1=${emailOf(loginInfo.loggedInUser)}`);
          loginInfo.setMessage (`Account signed in: ${emailOf(firebaseInfo.auth.currentUser)}`); 
  
          // Only log in auth.currentUser if their email is verified
          checkEmailVerification();
  
          // Clear email/password inputs 
          loginInfo.setEmail(loginInfo.defaultEmail);
          loginInfo.setPassword(loginInfo.defaultPassword);
  
          // Note: could store userCredential here if wanted it later ...
          // console.log(`createUserWithEmailAndPassword: setCredential`);
          // setCredential(userCredential);
      
          })
        .catch((error) => {
          console.log(`signUpUserEmailPassword: sign in failed for email ${loginInfo.email}`);
          const errorMessage = error.message;
          // const errorCode = error.code; // Could use this, too.
          console.log(`signInUserEmailPassword: ${errorMessage}`);
          setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
        });
    }
  
    function checkEmailVerification() {
      if (firebaseInfo.auth.currentUser) {
        console.log(`checkEmailVerification: auth.currentUser.emailVerified=${firebaseInfo.auth.currentUser.emailVerified}`);
        if (firebaseInfo.auth.currentUser.emailVerified) {
          console.log(`checkEmailVerification: setLoggedInUser for ${firebaseInfo.auth.currentUser.email}`);
          loginInfo.setLoggedInUser(firebaseInfo.auth.currentUser);
          console.log("checkEmailVerification: setErrorMsg('')");
          setErrorMsg('');
          //setPscreen('chat'); // Go to the Chat PseudoScreen
        } else {
          console.log('checkEmailVerification: remind user to verify email');
          setErrorMsg(`You cannot sign in as ${firebaseInfo.auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`)
        }
      }
    }
    
  
    return (
      <ImageBackground
      source={require('../assets/screenBackground.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={loginInfo.loggedInUser === null ? styles.signInOutPane : styles.hidden}>
          <Text style={styles.title}> Log In </Text>
          <View style={styles.labeledInput}>
              <Text style={styles.inputLabel}>Email:</Text>
              <TextInput 
                placeholder="Enter your email address" 
                style={styles.textInput} 
                value={loginInfo.email} 
                onChangeText={ 
                  text => {
                    loginInfo.setEmail(text);
                    setErrorMsg(''); // Clear any error message
                  }
                } />
            </View>
            <View style={styles.labeledInput}>
              <Text style={styles.inputLabel}>Password:</Text>
              <TextInput 
                placeholder="Enter your password" 
                style={styles.textInput} 
                value={loginInfo.password} 
                onChangeText={ 
                  text => {
                    loginInfo.setPassword(text);
                    setErrorMsg(''); // Clear any error message
                  }
                }/>
            </View>
            <View style={styles.buttonHolder}>
              <Button
                mode="contained" 
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={() => signInUserEmailPassword()}>
                  Log In
              </Button>

            </View>
            <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
              <Text style={styles.errorMessage}>{errorMsg}</Text>
            </View>
        </View>
        <View style={loginInfo.loggedInUser === null ? styles.hidden : styles.button}> 
              <Button
                mode="contained" 
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={() => loginInfo.logOut()}>
                  Log Out
              </Button>
       </View>
       <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
              <Text style={styles.errorMessage}>{loginInfo.message}</Text>
            </View>
      </View>
      </ImageBackground>
   );
      
};
  

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
    width: 250, 
    height: 60, 
    borderRadius: 15,
    justifyContent: 'center',
  },
  buttonText:{
    fontSize: 18,
  },
  textInput: {
    width: "80%",
    fontSize: 20,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "black",
    borderWidth: 2
    ,
    marginBottom: 8,
}
});

