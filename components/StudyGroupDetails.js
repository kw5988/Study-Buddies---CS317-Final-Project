import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import sampleData from './SampleData';
import locations from './locations';
const loginInfo = allProps.loginProps;
const firebaseInfo = allProps.firebaseProps;

const StudyGroupDetails = ({ route }) => {
  const studyGroupInformation = route.params;
//   const { studyGroupId } = route.params;
  console.log(studyGroupInformation);

  const studyGroup = studyGroupInformation['studyGroup']
  const studyGroupLocation = studyGroup['location']

  const locationData = locations.find(loc => loc.location === studyGroup.building);

  return (
    <View style={styles.container}>
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
    <Text style={styles.details}>{studyGroup.users}</Text>




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
  });
  

export default StudyGroupDetails;