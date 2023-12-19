import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';
import { // for Firebase storage access (to store images)
  ref, getStorage, uploadBytes, uploadBytesResumable, getDownloadURL
} from "firebase/storage";



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
  const [studyGroupPhotos, setStudyGroupPhotos] = useState(studyGroup.photos);
  const [images, setImages] = useState([]);
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
 
  //const [images, setImages] = useState([]);
  const imgStorage = getStorage();
  const pickImage = async () => {
    
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,

      });


      if (!result.cancelled) {


        const newImageUri = result.assets[0].uri;
        console.log(newImageUri);

        const studyGroupRef = doc(firebaseInfo.db, 'studyGroups', docID);
        const studyGroupDoc = await getDoc(studyGroupRef);
        const photos = studyGroupDoc.data().photos || [];
        
        console.log('5');
        await updateDoc(studyGroupRef, {
        photos: arrayUnion(newImageUri)});
        
        const updatedGroup = photos;
        setStudyGroupPhotos(updatedGroup);
        navigation.navigate('MainScreen');
        //console.log(studyGroupPhotos)
        
        //console.log(result);

        // Update state with the new image
        //setImages(previousImages => [...previousImages, newImageUri]);
        //console.log(newImageUri);
        // Upload the new image

        
       

        uploadToStorage(newImageUri);
        
      
    }}
    catch (error) {
      console.error('Error picking image:', error);
    }
  
  };

    async function uploadToStorage(uri){

      try{

      const fetchResponse = await fetch(uri);
      const blob = await fetchResponse.blob();

      // Create a reference to the Firebase storage"
      const now = new Date();
      const timestamp = now.getTime();
      //console.log (studyGroup.photos.length);
      console.log(`images/${(String(docID))}/${timestamp}/`)
      const storageRef = ref(imgStorage, (`images/${(String(docID))}/${timestamp}/`));

      const uploadTask = uploadBytesResumable(storageRef, blob);
      console.log(`Uploading image for message with timestamp ${timestamp} ...`);
      uploadTask.on('state_changed',
        // This callback is called with a snapshot on every progress update
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded 
          // and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
              }
        }, 
        // This callback is called when there's an error in the upload
        (error) => {
          console.error(error);
        }, 
        // This callback is called when the upload is finished 
        async function() {
          console.log(`Uploading image for message with timestamp ${timestamp} succeeded!`);
          // Once the upload is finished, get the downloadURL for the uploaed image
          const downloadURL = await getDownloadURL(storageRef);
          console.log(`Image fileMessage for message with timestamp ${timestamp} available at ${downloadURL}`);
        }      
      ); // end arguments to uploadTask.on

       
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error)

    }
    };




  return (
    <View style={styles.container}>
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
            title={studyGroup.building}
            description={studyGroup.location}
          />
        </MapView>
      </View>


      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>

          {errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}

          <Text style={styles.title}>{`Building, Location: `}</Text>
          <Text style={styles.details}>{`${studyGroup.building}, ${studyGroup.location}`}</Text>

          <Text style={styles.title}>{`Subject: `}</Text>
          <Text style={styles.details}>{studyGroup.subject}</Text>

          {/* causes an error but probs should be added */}
          {/* <Text style={styles.title}>{`Date: `}</Text>
          <Text style={styles.details}>{studyGroup.date}</Text> */}

          <Text style={styles.title}>{`Current/Max # people: `}</Text>
          <Text style={styles.details}>{`${studyGroup.users.length}/${studyGroup.groupSize} (${studyGroup.groupSize - studyGroup.users.length} spots available)`}</Text>


          <Text style={styles.title}>{`Participants: `}</Text>
          {studyGroup.users.map((user, index) => (
            <Text key={index} style={styles.details}>{user}</Text>
          ))}

          <Text style={styles.title}>{`Description: `}</Text>
          <Text style={styles.details}>{studyGroup.description}</Text>

          <Text style={styles.title}>{`Photos: `}</Text>

          {studyGroup.photos.length > 0 ? ( //make consistent
            <FlatList
              data={studyGroupPhotos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={{ width: 150, height: 150, marginVertical: 5, marginHorizontal: 5 }} />
              )}
              horizontal={true}
            />
          ) : (
            <Text>No images to display</Text>
          )}

        </ScrollView>
      </View>
    
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          {!studyGroup.users.includes(currentUser) && studyGroup.groupSize - studyGroup.users.length > 0 && (
            <Button
              mode="contained"
              onPress={joinStudyGroup}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Join Study Group
            </Button>
          )}

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

          {studyGroup.users.includes(currentUser) && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('StudyGroupChat', { studyGroupId: studyGroup.docID })}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Message
            </Button>
          )}
        </View>

        {studyGroup.users.includes(currentUser) && (
          <Button
            mode="contained"
            onPress={pickImage}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Add Photo
          </Button>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 3,
    height: 700,
    padding: 5,
    marginBottom: 5,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 65,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  details: {
    fontSize: 20,
    marginBottom: 5,
  },
  mapContainer: {
    flex: 1,
    marginTop: 1,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
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
  buttonText: {
    fontSize: 14,
  }
});


export default StudyGroupDetails;