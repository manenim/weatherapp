
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ReactDOM from "react-dom/client";
import RegisterScreen from './screens/RegisterScreen';



const Stack = createNativeStackNavigator();



export default function App() {
  return (
        <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
          <Stack.Screen options={{headerShown: false}} name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      
  );
}




// const styles = StyleSheet.create({
  
//   top: {
//     height: '70%',
//     width: '100%',
//     // backgroundColor: 'red',
//   },
//   image: {
//     height: '100%',
//     width: '100%',
//   },
//   infoView: {
//     marginHorizontal: 'auto',
//     marginTop: '1rem',
//   },
//   tempText: {
//     color: 'white',
//     fontSize: '4.5rem',
    

//   },
//   tempText2: {
//     color: 'white',
//     fontSize: '2.5rem',
//     marginHorizontal: 'auto',
//     // marginTop: '.2rem',

//   },

//   lower: {
//     height: '70vh',
//     backgroundColor: "#47ab2f",
//   },
//   forecastHead: {
//     display: 'flex',
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     justifyContent: 'space-between',
//     borderBottomColor: 'white',
//     borderBottomWidth: "1px",
//     paddingVertical: '8px',
//     color: 'white',
//     marginBottom: '20px',
//   },
//   headTop: {
//     fontWeight: 'bold',
//     fontFamily: 'sans-serif',
//     fontSize: '1.1rem',
//     color: 'white',
//   },
//   headBottom: {
//     color: 'white',
//     letterSpacing: '1px',
//     fontSize: '0.8rem',
//   },
//   forecasts:{
//   paddingHorizontal: 20,
    
//   },
//   forecast: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: '8px',
//     color: 'white',
//   },
//   icon: {
//     marginLeft: '-25px',
//   },

//   iconImage: {
//     width: '35px',
//     height: '35px',

//   },
//   forecastText: {
//     color: 'white',
//     fontSize: '1.1rem',
//   }
  
 
// });
