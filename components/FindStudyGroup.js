import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import SampleData from './SampleData';
import { useContext } from "react";
import StateContext from './StateContext.js';
import { collection, doc, addDoc, setDoc, query, where, getDocs, firestore} from "firebase/firestore";

const FindStudyGroup = ({ navigation }) => {
  
  const allProps = useContext(StateContext);

  const firebaseInfo = allProps.firebaseProps;
  // console.log("*******")
  // console.log(firebaseInfo.db)
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
          if(
            data.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.description.toLowerCase().includes(searchTerm.toLowerCase()) 
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

    if (searchTerm !== '') {
      fetchStudyGroups();
    } else {
      // Clear results if the search term is empty
      setResults([]);
    }
  }, [searchTerm]);

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for Study Groups</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter subject, location, or description"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text.toLowerCase())}
      />
      <Button title="Search" onPress={() => setSearchTerm(searchTerm.toLowerCase())} />
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
// const FindStudyGroup = ({navigation}) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [results, setResults] = useState([]);

  
//     const handleSearch = () => {
//         const groups = SampleData[0].studyGroups;
    
//         const filteredGroups = Object.values(groups).filter(group => {
//         return (
//             group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             group.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             group.description.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         });
    
//         setResults(filteredGroups);
//     };

//   return (
    
//     <View style={styles.container}>
//       <Text style={styles.title}>Search for Study Groups</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter subject or location"
//         value={searchTerm}
//         onChangeText={(text) => setSearchTerm(text)}
//       />
//       <Button title="Search" onPress={handleSearch} />
//       <FlatList style={styles.searchResults}
//         data={results}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//             <TouchableOpacity
//             style={styles.resultItem}
//             onPress={() => navigation.navigate('StudyGroupDetails', { studyGroup: item })}
//           >
//             <Text>{`Subject: ${item.subject}`}</Text>
//             <Text>{`Location: ${item.location}`}</Text>
//             <Text>{`Description: ${item.description}`}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>

//   );
// };

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

export default FindStudyGroup;
