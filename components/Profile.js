import React, { useState, useEffect, useContext} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { collection, query, where, getDocs, firestore } from "firebase/firestore";
import StateContext from './StateContext';
import { emailOf } from '../utils';

const Profile = ({ navigation }) => {
    const allProps = useContext(StateContext);
    const loginInfo = allProps.loginProps;
    const firebaseInfo = allProps.firebaseProps;
    const userID = emailOf(firebaseInfo.auth.currentUser);
    console.log(userID)
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
  
    useEffect(() => {
      const fetchStudyGroups = async () => {
   
        const studyGroupsCollection = collection(firebaseInfo.db, 'studyGroups');
        const q = query(studyGroupsCollection);
     
        try {
          const querySnapshot = await getDocs(q);
          const groups = [];
  
          querySnapshot.forEach((doc) => {
          
            const data = doc.data();
            console.log("*********")
            console.log(data)
            console.log("*********")
            data['docID'] = doc.id
           
            
            if(
              data.users.includes(userID)
            )
            {
              groups.push(data);
            }
          });
  
          setResults(groups);
        } catch (error) {
          console.error('Error fetching study groups:', error);
        }
      };
      fetchStudyGroups();
    }, [searchTerm]);
  
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{`Welcome, ${userID}`}</Text>
        <Text style={styles.title}>{"Your Study Groups:"}</Text>
       
        <FlatList
          style={styles.searchResults}
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => navigation.navigate('StudyGroupDetails', { studyGroup: item })}
            >
              <Text>{`Subject: ${item.subject}`}</Text>
              <Text>{`Building: ${item.building}`}</Text>
              <Text>{`Description: ${item.description}`}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 8,
      width: '100%',
    },
    resultItem: {
      marginBottom: 16,
      borderColor: 'gray',
      borderWidth: 1,
      padding: 8,
    },
    searchResults:{
      flexDirection: 'column',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: '#ffffff',
      borderWidth: 2,
      // borderColor: 'blue',
    },
  });
  

export default Profile;
