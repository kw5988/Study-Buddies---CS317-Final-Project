import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import SampleData from './SampleData';
import { useContext } from "react";
import StateContext from './StateContext.js';
import { collection, doc, addDoc, setDoc, query, where, getDocs, firestore} from "firebase/firestore";


const FindStudyGroupFromMap = ({ route, navigation }) => {
  const allProps = useContext(StateContext);

  const firebaseInfo = allProps.firebaseProps;
  
  const { selectedLocation } = route.params;
  const [studyGroups, setStudyGroups] = useState([]);
  
  useEffect(() => {
    const fetchStudyGroups = async () => {
      const studyGroupsCollection = collection(firebaseInfo.db, 'studyGroups');
      const q = query(studyGroupsCollection, where('building', '==', selectedLocation));

      try {
        const querySnapshot = await getDocs(q);
        const groups = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data['docID'] = doc.id;
          console.log(data)
          groups.push(data);
        });

        setStudyGroups(groups);
      } catch (error) {
        console.error('Error fetching study groups:', error);
      }
    };

    fetchStudyGroups();
  }, [selectedLocation]);


  // useEffect(() => {
  //   // Filter study groups based on the selected location from the map marker
  //   const groups = SampleData[0].studyGroups;
  //   const filteredGroups = Object.values(groups).filter(group => group.location === selectedLocation);
  //   setStudyGroups(filteredGroups);
  // }, [selectedLocation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Groups in {selectedLocation}</Text>
      <FlatList
        style={styles.studyGroupList}
        data={studyGroups}
        keyExtractor={(item) => item.docID}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studyGroupItem}
            onPress={() => navigation.navigate('StudyGroupDetails', { studyGroup: item })}
          >
            <Text>{`Subject: ${item.subject}`}</Text>
            <Text>{`Location: ${item.location}`}</Text>
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
  studyGroupList: {
    width: '100%',
  },
  studyGroupItem: {
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
  },
});

export default FindStudyGroupFromMap;
