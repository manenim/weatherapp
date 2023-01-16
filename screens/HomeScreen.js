import React, { useCallback, useEffect, useState } from 'react'
import { ImageBackground, Text, StyleSheet, ActivityIndicator, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import axios from 'axios'
import Forecasts from '../components/Forecasts'
import * as Location from 'expo-location'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'
import { getAuth, signOut } from 'firebase/auth'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import ModalComp from '../components/ModalComp'
import { OPENWEATHER_API_KEY, ACCUWEATHER_API_KEY, BASE, BASEURL } from '@env'

const HomeScreen = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [coords, setcoords] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [favorites, setFavorites] = useState(null);

   const api = {
     key: OPENWEATHER_API_KEY,
     //accukey
     key2: ACCUWEATHER_API_KEY,
     base: BASE,
    baseUrl: BASEURL
  }
  // console.log(api.key, 'api key')

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app);

  let user = auth?.currentUser?.uid;

  
    let navigate = useNavigation()


  const signOutHandler = () => {
    signOut(auth).then(() => {
  // Sign-out successful.
      console.log("signed out")
      navigate.navigate('Login')
}).catch((error) => {
  // An error happened.
  Alert.alert(error)
});
  }

  const addToFavourites = async (data) => {
    console.log(data, 'data')
    const currentUserId = auth?.currentUser?.uid;
    const docRef = doc(db, "users", currentUserId);
    const docSnap = await getDoc(docRef)
    console.log(docSnap.data(), 'docSnap')
  //update document
    await updateDoc(docRef, {
      favourites: [...docSnap.data().favourites, data]
    });
    setFavorites(docSnap.data().favourites)
  }

  // delete from favourites
  const deleteFromFavourites = async (data) => {
    const currentUserId = auth?.currentUser?.uid;
    const docRef = doc(db, "users", currentUserId);
    const docSnap = await getDoc(docRef)
    //update document
    await updateDoc(docRef, {
      favourites: docSnap.data().favourites.filter((item) => item.id !== data.id)
    });
    console.log('deleted fv')
        console.log(docSnap.data(), 'docSnap')


  }


  const fetchDataHandler = useCallback(() => { 
    setLoading(true);
    setInput('');
    axios({
      method: 'GET',
      url: `${api.base}weather?q=${input}&units=metric&appid=${api.key}`,
    })
      .then((response) => {
        console.log(response.data.coord.lon, 'from top')
        setData(response.data);

//  getting weather forecast data on search
         axios({
      method: 'GET',
      url: `${api.baseUrl}locations/v1/cities/geoposition/search?apikey=${api.key2}&q=${response.data.coord.lat}%2C${response.data.coord.lon}`
    })
    .then((response) => {
      console.log(response.data.Key, 'forecasts ax')


      // Hit API to get 5 days forecast
      axios({
            method: 'GET',
            url: `${api.baseUrl}forecasts/v1/daily/5day/${response.data.Key}?apikey=${api.key2}&metric=true`
      }).then((response) => { 
        setForecasts(response.data.DailyForecasts)
        console.log(response.data.DailyForecasts, 'forecasts SEARCH')
        setLoading(false);
      })
    })
        
        


      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setLoading(false);
      })
  }, [api.key, input, api.base]);




  useEffect(() => {
    (async () => {
      //Request for permission to get Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Please allow app to access your location')
        return; 
      }
      try {
        setLoading(true);
        let location = await Location.getLastKnownPositionAsync({ accuracy: Location.Accuracy.Low, maximumAge: 10000 });
        
      
      // Fetch current location weather  
      axios({
      method: 'GET',
      url: `${api.base}weather?lat=${location?.coords?.latitude}&lon=${location?.coords?.longitude}&units=metric&appid=${api.key}`
    })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      }).catch((error) => {
      }).finally(() => {
        setLoading(false);
      })
        
        
      // Hit API to get location key
      axios({
      method: 'GET',
      url: `${api.baseUrl}locations/v1/cities/geoposition/search?apikey=fy9AyneNG8HoU1KjcGNtbbUisgHlqhhH&q=${location?.coords?.latitude}%2C${location?.coords?.longitude}`
    })
    .then((response) => {
      setLoading(true);


      // Hit API to get 5 days forecast
      axios({
            method: 'GET',
            url: `${api.baseUrl}forecasts/v1/daily/5day/${response.data.Key}?apikey=fy9AyneNG8HoU1KjcGNtbbUisgHlqhhH&metric=true}`
      }).then((response) => { 
        setForecasts(response.data.DailyForecasts)
        setLoading(false);
      })
    })
    .catch((error) => {
        console.log(error);
      }).finally(() => {
        setLoading(false);
      })  
      } catch (error) {
        Alert.alert(error)
      }
      
    })();

    // getting list of saved favorite lovations
      getFavs()

  }, [])

// getting list of saved favorite lovations
  const getFavs = async () => {
    const currentUserId = auth?.currentUser?.uid;
      const docRef = doc(db, "users", currentUserId);
      const docSnap = await getDoc(docRef)
      setFavorites(docSnap.data().favourites)
  }

  //switching backgrounds
  let bg = data?.weather[0].main === 'Haze' || 'Clouds' ? require(`../assets/bgs/bgcloudy.png`) : data?.weather[0].main === 'Rain' ? require(`../assets/bgs/bgrainy.png`) : require(`../assets/bgs/bgsunny.png`)
  console.log(bg, 'from bg')

  let bgColor = data?.weather[0].main === 'Haze' || 'Clouds'  ? '#54717a' : data?.weather[0].main === 'Rain' ? '#34495e' : '#f1c40f'
  
  
  return (
    <View style = {styles.basic}>
        <View style = {styles.top}>
          <ImageBackground source={bg} style={styles.image} resizeMethod="resize" resizeMode="cover">
            <View >
              <TextInput placeholder='Enter City name and press enter'
                style={styles.input}
                onChangeText={text => setInput(text)}
                value={input}
                placeholderTextColor='black'
                onSubmitEditing={fetchDataHandler}
              />
          </View>
          


        {loading && <Text>Loading...</Text>}

        {data && <View style={styles.infoView}>
          <Text style={styles.tempText}>{ Math.round(data?.main?.temp)}°C</Text>
            <Text style={styles.tempText2}>{data?.weather[0]?.main}</Text>
            <Text style={styles.tempText2}>
              {data.name}, {data.sys.country}
            </Text>
              <TouchableOpacity style={styles.button}
                onPress={signOutHandler}
                >
              <Text>SIGN OUT</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.button}
                onPress={() => addToFavourites({ "name": data?.name})}
              >
            <Text>Add to favourites</Text>
            </TouchableOpacity>
            
         
          </View>
            
          }
          <ModalComp favorites = {favorites} /> 
          
          
            
      </ImageBackground>
      </View>
      <Forecasts data={data} isLoading={loading} forecasts = {forecasts} color = {bgColor} />

    </View>
  )
}

export default HomeScreen



// Styles
const styles = StyleSheet.create({
  basic: {
    height: '100%',
    width: '100%',
  },
  top: {
    height: '50%',
    width: '100%',
    // backgroundColor: 'red',
  },
  image: {
    height: '100%',
    width: '100%',
  },
   input: {
     height: 40,
     marginHorizontal: 12,
     marginTop: 12,
    borderWidth: 1,
     padding: 10,
     color: 'black',
     backgroundColor: 'white',
     borderRadius: 10,
     outline: 'none',
    borderColor: 'white',

  },
  infoView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  tempText: {
    color: 'white',
    fontSize: 48,


  },
  tempText2: {
    color: 'white',
    fontSize: 28,
    marginHorizontal: 'auto',
    // marginTop: '.2rem',

  },

  lower: {
    height: '51%',
    width: '100%',
    backgroundColor: "#47ab2f",
    marginTop: -1,
  },
  forecastHead: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    paddingVertical: 8,
    color: 'white',
    marginBottom: 20,
  },
  headTop: {
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: 'white',
  },
  headBottom: {
    color: 'white',
    letterSpacing: 1,
    fontSize: 14,
  },
  headers: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecasts:{
  paddingHorizontal: 20,
    
  },
  forecast: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    color: 'white',
  },
  icon: {
    marginLeft: -24,
  },

  iconImage: {
    width: 35,
    height: 35,

  },
  forecastText: {
    color: 'white',
    fontSize: 16,
  }, 
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    width: '40%',
    borderRadius: 10,
    padding: 8,
    marginTop: 8
  }
 
});
