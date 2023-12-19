import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { collection, doc, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'; // Add serverTimestamp
import { emailOf } from '../utils';
import StateContext from './StateContext.js';
import { useContext } from 'react';

const StudyGroupChat = ({ route }) => {
  const allProps = useContext(StateContext);
  const firebaseInfo = allProps.firebaseProps;
  const currentUser = emailOf(firebaseInfo.auth.currentUser);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const studyGroupId = route.params.studyGroupId;

  const chatRef = collection(firebaseInfo.db, 'studyGroups', studyGroupId, 'chat');

  const loadMessages = useCallback(async () => {
    const unsubscribe = onSnapshot(chatRef, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        const { text, user, createdAt } = doc.data();
  
        // Check if createdAt is not null before trying to access the seconds property
        const timestamp = createdAt && createdAt.seconds ? new Date(createdAt.seconds * 1000) : null;
  
        messages.push({
          id: doc.id,
          text,
          user,
          createdAt: timestamp,
        });
      });
  
      // Filter out any messages without a valid timestamp
      const validMessages = messages.filter(message => message.createdAt);
  
      // Sort messages by createdAt timestamp in ascending order so that it appears properly on screen
      validMessages.sort((a, b) => a.createdAt - b.createdAt);
  
      setMessages(validMessages);
    });
  
    return () => {
      unsubscribe();
    };
  }, [chatRef]);
  

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = async (messageText) => {
    if (messageText.trim() === '') {
      return;
    }

    try {
      await addDoc(chatRef, {
        text: messageText.trim(),
        user: currentUser,
        createdAt: serverTimestamp(), // Use serverTimestamp works, but not firebaseInfo.firestore.FieldValue.serverTimestamp()
      });

      // Clear the input field after sending the message
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const onSend = () => {
    sendMessage(newMessage);
  };

  return (
    <View style={styles.container}>
            
        <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={item.user === currentUser ? styles.userMessageContainer : styles.otherMessageContainer}>
            <Text style={styles.messageUser}>{item.user}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            </View>
        )}
        />
      <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <Button title="Send" onPress={onSend} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 8,
  },
  messageUser: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  userMessageContainer: {
    alignSelf: 'flex-end', // put user's messages to the right side of the page
    backgroundColor: '#89CFF0', // Background color for user's messages
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },

  otherMessageContainer: {
    alignSelf: 'flex-start', //put text messages for other users on the left side of the page
    backgroundColor: '#E6E6E6', // Background color for other users' messages
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default StudyGroupChat;
