import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';


const MainScreen = ({ navigation }) => {
  return (
    // <ImageBackground
    //   source={require('../assets/screenBackground.jpg')}
    //   style={styles.backgroundImage}
    // >
      <View style={styles.container}>
        <Text style={styles.title}>What would you like to do?</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateStudyGroup')}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Start a study group
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('FindStudyGroup')}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Find study groups
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ViewCampusMap')}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            View campus map
          </Button>
        </View>
      </View>
    // </ImageBackground>
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
    color: 'black',
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
    fontSize: 22,
  }
});

export default MainScreen;
