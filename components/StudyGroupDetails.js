import React, {useState} from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import sampleData from './SampleData';
import locations from './locations';
import { // for Firestore access
  collection, doc, addDoc, setDoc,
  query, where, getDocs, getDoc, updateDoc, arrayUnion, arrayRemove
} from "firebase/firestore";
import { useContext } from "react";
import StateContext from './StateContext.js';
import { emailOf } from '../utils';
import { useNavigation } from '@react-navigation/native';


const StudyGroupDetails = ({ route, navigation }) => {
  const allProps = useContext(StateContext);
  const loginInfo = allProps.loginProps;
  const firebaseInfo = allProps.firebaseProps;
  const studyGroupInformation = route.params;
  const currentUser = emailOf(firebaseInfo.auth.currentUser)
  const [errorMessage, setErrorMessage] = useState(null);
  const studyGroup = studyGroupInformation['studyGroup']

  const docID = studyGroupInformation['studyGroup']['docID']
  const [studyGroupUsers, setStudyGroupUsers] = useState(studyGroupInformation.users);
  // const studyGroupLocation = studyGroup['location']

  const locationData = locations.find(loc => loc.location === studyGroup.building);

  const joinStudyGroup = async () => {
    //check if user is logged in
    if (!currentUser) {
      console.error('User not logged in');
      return;
    }

    try {
      console.log("*********Reached here 0!")
      const studyGroupRef = doc(firebaseInfo.db, 'studyGroups', docID);
      const studyGroupDoc = await getDoc(studyGroupRef);
      const users = studyGroupDoc.data().users || [];

      // Check if the user has already joined the study group and display message if yes
      if (users.includes(currentUser)) {
        setErrorMessage('You have already joined this study group.');
        return;
      }

      // Clear the error message (if user can join)
      setErrorMessage(null);

      // Update the study group with the new user
      await updateDoc(studyGroupRef, {
        users: arrayUnion(currentUser),
      });

      const updatedStudyGroup = studyGroupDoc.data().users;
      setStudyGroupUsers(updatedStudyGroup);
      console.log(studyGroupUsers)

      console.log('User joined the study group');
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Error joining study group:', error);
    }
  };

  const leaveStudyGroup = async () => {
    // Check if the user is logged in
    if (!currentUser) {
      console.error('User not logged in');
      return;
    }
  
    try {
      const studyGroupRef = doc(firebaseInfo.db, 'studyGroups', docID);
      const studyGroupDoc = await getDoc(studyGroupRef);
      const users = studyGroupDoc.data().users || [];
  
      // Check if the user is already in study group
      if (!users.includes(currentUser)) {
        setErrorMessage('You are not a participant of this study group.');
        return;
      }
  
      // Clear the error message (if user can leave)
      setErrorMessage(null);
  
      // Update the study group by removing the current user
      await updateDoc(studyGroupRef, {
        users: arrayRemove(currentUser),
      });
  
      const updatedStudyGroup = studyGroupDoc.data().users;
      setStudyGroupUsers(updatedStudyGroup);
      console.log('User left the study group -- Successful!');
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Error leaving study group:', error);
    }
  };
  

  return (
    <View style={styles.container}>

      {errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}

    <Text style={styles.title}>{`Subject: `}</Text>
    <Text style={styles.details}>{studyGroup.subject}</Text>

    <Text style={styles.title}>{`Location: `}</Text>
    <Text style={styles.details}>{studyGroup.location}</Text>

    <Text style={styles.title}>{`Description: `}</Text>
    <Text style={styles.details}>{studyGroup.description}</Text>

    <Text style={styles.title}>{`Max # people: `}</Text>
    <Text style={styles.details}>{studyGroup.groupSize}</Text>

    <Text style={styles.title}>{`Current # people: `}</Text>
    <Text style={styles.details}>{studyGroup.groupSize-studyGroup.users.length}</Text>


    <Text style={styles.title}>{`Participants: `}</Text>
    {studyGroup.users.map((user, index) => (
      <Text key={index} style={styles.details}>{user}</Text>
    ))}

    <View style={styles.buttonContainer}>
      <Button 
        mode="contained"
        onPress={joinStudyGroup} 
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Join Study Group
      </Button>
      {studyGroup.users.includes(currentUser) && (
    <Button 
      mode="contained"
      onPress={leaveStudyGroup} 
      style={styles.button}
      labelStyle={styles.buttonText}
    >
      Leave Study Group
    </Button>
  )}
    </View>
   

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: locationData.coord.latitude,
            longitude: locationData.coord.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: locationData.coord.latitude,
              longitude: locationData.coord.longitude,
            }}
            title="INSERT NAME HERE"
            description="INSERT LOCATION HERE!"
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    errorMessage: {
      color: 'red',
      fontSize: 16,
      marginTop: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10, 
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 8,
    },
    details: {
      fontSize: 18,
      marginBottom: 8,
    },
    mapContainer: {
      flex: 1,
      marginTop: 16,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      overflow: 'hidden',
    },
    map: {
      flex: 1,
    },
    button: {
      marginVertical: 10,
      width: 185, 
      height: 45, 
      borderRadius: 15,
      justifyContent: 'center',
    },
    buttonText:{
      fontSize: 15,
    }
  });
  

export default StudyGroupDetails;