import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import locations from './locations';

const ViewCampusMap = () => {
  const navigation = useNavigation(); // Use the useNavigation hook

  const handleMarkerPress = (location) => {
    // Navigate to the search page with the selected location
    navigation.navigate('FindStudyGroup', { selectedLocation: location });
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
