import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity  } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SelectList } from 'react-native-dropdown-select-list'

import { // for Firestore access
    collection, doc, addDoc, setDoc,
    query, where, getDocs
} from "firebase/firestore";
import { useContext } from "react";
import StateContext from './StateContext.js';
import { emailOf } from '../utils';

import locations from './locations';

const CreateStudyGroup = ({ onCreateGroup, navigation }) => {
  const [building, setBuilding] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [groupSize, setGroupSize] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBuilding, setSelected] = React.useState("");
  const allProps = useContext(StateContext);
  const loginInfo = allProps.loginProps;
  const firebaseInfo = allProps.firebaseProps;
  const [photos, setPhotos] = useState([]);
  const [users, setUsers] = useState([emailOf(firebaseInfo.auth.currentUser)]);  // Set initial user to the email


  locationsObject = []
  locations.map((location) => locationsObject.push({label: location.location, value: location.location}))

const handleCreateGroup = async () => {
    // Create an object with the group details
    const groupData = {
      building: selectedBuilding,
      location,
      date,
      startDateTime,
      endDateTime,
      users, 
      groupSize,
      subject,
      description,
      photos,
      messages: [], // Initialize an empty array for messages
    };
    console.log(groupData)

    try {
       
        const collectionRef = collection(firebaseInfo.db, '/studyGroups');
        const docRef = await addDoc(collectionRef, groupData);  
        // Pass the created group data along with the ID to the callback function
        navigation.navigate('MainScreen');
      } catch (error) {
        console.error('Error creating group:', error);
      }
    };


    const handleTimeChange = (event, selected) => {
      // setShowStartTimePicker(false);
      // setShowEndTimePicker(false);
      if (selected) {
        setStartDateTime(selected);
        setEndDateTime(selected);
      }
      const confirmStartTime = (selected) => {
        setStartModalVisible(false);
        if (selected) {
          setStartDateTime(selected);
        }
      };
    
      const confirmEndTime = (selected) => {
        setEndModalVisible(false);
        if (selected) {
          setEndDateTime(selected);
        }
      };
    };
  
    
    const confirmStartTime = () => {
      setShowStartTimePicker(false);
    };
  
    const confirmEndTime = () => {
      setShowEndTimePicker(false);
    };
  
  const handleDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setDate(selected);
    }
  };

  const handleStartTimeChange = (event, selected) => {
    setShowStartTimePicker(false);
    if (selected) {
      setStartDateTime(selected);
    }
  };

  const handleEndTimeChange = (event, selected) => {
    setShowEndTimePicker(false);
    if (selected) {
      setEndDateTime(selected);
    }
  };


return (
  <View style={styles.container}>
    <KeyboardAwareScrollView>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Building:</Text>
        <SelectList
          setSelected={(val) => setSelected(val)}
          data={locationsObject}
          save="value"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Room/Location:</Text>
        <TextInput
          placeholder="Enter Room/Location"
          value={location}
          onChangeText={(text) => setLocation(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
         <Text style={styles.label}>Date:</Text>
         <TextInput
          placeholder="Select Date"
          value={date.toLocaleDateString()}
          onFocus={() => setShowDatePicker(true)}
          style={styles.input}
        />
        {showDatePicker && (
      
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            style = {{ backgroundColor: '#eff0f6', color:'white'}}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Start Time:</Text>
        <TextInput
          placeholder="Select start time"
          value={startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          onFocus={() => setShowStartTimePicker(true)}
          style={styles.input}
        />
        <Modal visible={showStartTimePicker} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={startDateTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={{ backgroundColor: '#eff0f6', color: 'white' }}
              />
              <TouchableOpacity onPress={confirmStartTime}>
                <Text style={styles.confirmButton}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Time:</Text>
        <TextInput
          placeholder="Select end time"
          value={endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          onFocus={() => setShowEndTimePicker(true)}
          style={styles.input}
        />
        <Modal visible={showEndTimePicker} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={endDateTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={{ backgroundColor: '#eff0f6', color: 'white' }}
              />
              <TouchableOpacity onPress={confirmEndTime}>
                <Text style={styles.confirmButton}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Group Size:</Text>
        <TextInput
          placeholder="Enter group size"
          value={groupSize}
          onChangeText={(text) => setGroupSize(text)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject:</Text>
        <TextInput
          placeholder="Enter subject"
          value={subject}
          onChangeText={(text) => setSubject(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          placeholder="Enter description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
          numberOfLines={4}
          style={styles.input}
        />
      </View>
    </KeyboardAwareScrollView>

    <Button title="Create Group" onPress={handleCreateGroup} />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  confirmButton: {
    marginTop: 16,
    color: 'blue', // Adjust the color as needed
  },
});

export default CreateStudyGroup;



//   return (
    

//     <View style={styles.container}>
      
//     <KeyboardAwareScrollView>
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Building:</Text>
//         <SelectList 
//         setSelected={(val) => setSelected(val)} 
//         data={locationsObject} 
//         save="value"
//         />
//       </View>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Room/Location:</Text>
//         <TextInput
//           placeholder="Enter Room/Location"
//           value={location}
//           onChangeText={(text) => setLocation(text)}
//           style={styles.input}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Date:</Text>
//         <TextInput
//           placeholder="Select Date"
//           value={date.toLocaleDateString()}
//           onFocus={() => setShowDatePicker(true)}
//           style={styles.input}
//         />
//         {showDatePicker && (
      
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={handleDateChange}
//             style = {{ backgroundColor: '#eff0f6', color:'white'}}
//           />
//         )}
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Start Time:</Text>
//         <TextInput
//           placeholder="Select start time"
//           // value={startDateTime.toLocaleTimeString()}
//           value={startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           onFocus={() => setShowStartTimePicker(true)}
//           style = {styles.input}
//         />
//         {showStartTimePicker && (
//           <DateTimePicker
//             value={startDateTime}
//             mode="time"
//             display="spinner"
//             onChange={handleStartTimeChange}
//             style = {{ backgroundColor: '#eff0f6', color:'white'}}
//           />
//         )}
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>End Time:</Text>
//         <TextInput
//           placeholder="Select end time"
//           // value={endDateTime.toLocaleTimeString()} 
//           value={endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           onFocus={() => setShowEndTimePicker(true)}
//           style={styles.input}
//         />
//         {showEndTimePicker && (
//           <DateTimePicker
//             value={endDateTime}
//             mode="time"
//             display="spinner"
//             onChange={handleEndTimeChange}
//             style = {{ backgroundColor: '#eff0f6', color:'white'}}
//           />
//         )}
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Group Size:</Text>
//         <TextInput
//           placeholder="Enter group size"
//           value={groupSize}
//           onChangeText={(text) => setGroupSize(text)}
//           keyboardType="numeric"
//           style={styles.input}
//         />
//       </View>
  
  
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Subject:</Text>
//         <TextInput
//           placeholder="Enter subject"
//           value={subject}
//           onChangeText={(text) => setSubject(text)}
//           style={styles.input}
//         />
//       </View>
    

    
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Description:</Text>
//         <TextInput
//           placeholder="Enter description"
//           value={description}
//           onChangeText={(text) => setDescription(text)}
//           multiline
//           numberOfLines={4}
//           style={styles.input}
//         />
//       </View>
        
//      </KeyboardAwareScrollView>

      
//       <Button title="Create Group" onPress={handleCreateGroup} />
//     </View>
//   );
// };