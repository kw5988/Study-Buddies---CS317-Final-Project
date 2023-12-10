import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import SampleData from './SampleData';

const FindStudyGroup = ({navigation}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        const groups = SampleData[0].studyGroups;
    
        const filteredGroups = Object.values(groups).filter(group => {
        return (
            group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        });
    
        setResults(filteredGroups);
    };

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Search for Study Groups</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter subject or location"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList style={styles.searchResults}
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.resultItem}
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
