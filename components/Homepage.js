import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';


const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/StudyBuddiesBackground.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Study Buddies</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('SignInOutScreen')}
            style={styles.button}
          >
            Login
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.button}
          >
            Sign up
          </Button>
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
    color: 'white',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
    width: 200, 
  },
});

export default HomeScreen;
