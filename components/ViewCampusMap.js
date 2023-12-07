import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import locations from './locations'; 
import SampleData from './SampleData';

const ViewCampusMap = () => {
    const studyGroups = SampleData[0].studyGroups;
  
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
          {Object.values(studyGroups).map((group) => (
            <Marker
              key={group.id}
              coordinate={locations.find((loc) => loc.location === group.location).coord}
              title={group.subject}
              description={group.location}
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