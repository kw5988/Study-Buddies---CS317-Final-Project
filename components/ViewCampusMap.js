import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import locations from './locations';
import { collection, doc, addDoc, setDoc, query, where, getDocs, firestore} from "firebase/firestore";
import StateContext from './StateContext.js';
import { useContext } from "react";



const ViewCampusMap = () => {
  const navigation = useNavigation(); // Use the useNavigation hook

  const [studyGroupBuildings, setStudyGroupBuildings] = useState([]);

  const allProps = useContext(StateContext);

  const firebaseInfo = allProps.firebaseProps;

  useEffect(() => {
    const fetchStudyGroupBuildings = async () => {
      const studyGroupsCollection = collection(firebaseInfo.db, 'studyGroups');
      const q = query(studyGroupsCollection);

      try {
        const querySnapshot = await getDocs(q);
        const buildingsWithStudyGroups = [];

        querySnapshot.forEach((doc) => {

          const data = doc.data();
          data['docID'] = doc.id
          buildingsWithStudyGroups.push(data.building);
        });

        setStudyGroupBuildings(buildingsWithStudyGroups);
      } catch (error) {
        console.error('Error fetching study groups:', error);
      }
    };

    fetchStudyGroupBuildings();
  }, []);

  const buildingWithStudyGroups = (building) => {
    return studyGroupBuildings.includes(building);
  };

  const markerColor = (building) => {
    return buildingWithStudyGroups(building) ? 'green' : 'red';
  };

  const handleMarkerPress = (location) => {
    // Navigate to the search page with the selected location
    navigation.navigate('FindStudyGroupFromMap', { selectedLocation: location });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.294044863201876,
          longitude: -71.3028997577327,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.location}
            coordinate={location.coord}
            title={location.location}
            pinColor={markerColor(location.location)} // Set marker color based on study groups
            // description={`Latitude: ${location.coord.latitude}, Longitude: ${location.coord.longitude}`}
            onPress={() => handleMarkerPress(location.location)} // Handle marker press
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default ViewCampusMap;
