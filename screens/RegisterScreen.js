// import { firebase } from '@react-native-firebase/auth'
import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import { auth } from '../firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'
import { getFirestore } from "firebase/firestore";

import { doc, setDoc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native'




const RegisterScreen = () => {
      const [firstName, setFirstName] = useState('')
      const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()
    
    useEffect(() => {
     onAuthStateChanged(auth, user => {
            if (user) {
                navigation.navigate('Home')
            } else {
            console.log('User is signed out');
            }
        });
        
     }, [])

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app);

    

    
    const handleSignUp = () => {
      createUserWithEmailAndPassword(auth, email, password)
          .then(userCredentials => {
              const user = userCredentials.user;
              console.log(user)
          console.log('Registered with:', user.email);
           setDoc(doc(db, "users", user.uid), {
               name: firstName,
               favourites: [],
           });
          
      })
      .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        Alert.alert('That email address is already in use!')
    }

    if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        Alert.alert('That email address is invalid!')
    }

          console.error(error);
          Alert.alert(error.message)
  });
  }

 

  return (
      <View behavior="padding" style={styles.container}>
          <View style={styles.inputContainer}>
              <TextInput
                  placeholder='First Name'
                value={firstName}
          onChangeText={text => setFirstName(text)}
                  style={styles.input}
              />
              <TextInput
                  placeholder='Email'
                value={email}
          onChangeText={text => setEmail(text)}
                  style={styles.input}
              />
              
              <TextInput
                  placeholder='Password'
                value={password}
          onChangeText={text => setPassword(text)}
                  style={styles.input}
                  secureTextEntry
              />
          </View>

        <View style={styles.buttonContainer}>
        
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
      </View>
  )
}

export default RegisterScreen


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
});