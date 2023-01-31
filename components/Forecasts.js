import React, { useState } from 'react'
import { ImageBackground, Text, StyleSheet, View, Image, TextInput } from 'react-native'


const Forecast = ({ data, color }) => { 
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesd', 'Thursday', 'Friday', 'Saturday']
  const [icon, setIcon] = useState('clear@3x')


  let day = days[new Date(data.Date).getDay()]
  console.log(day, 'from forecasted day')



  //convert fareinheit to celcius
  const fareinheitToCelcius = (temp) => {
    return Math.round((temp - 32) * 5 / 9) 
  }
    


  console.log(data.Day.IconPhrase, icon, 'from forecasted iconphrase')
  return (
    <View style={styles.forecast}>
                <View style={styles.day}>
                  <Text style={styles.forecastText}>{day}</Text>
                </View>
                <View style={styles.icon}>
                  <Image source={require(`../assets/icons/clear.png`)} style={styles.iconImage}/>
                </View>
                <View style={styles.temp}>
                <Text style={styles.forecastText}>{fareinheitToCelcius(data.Temperature.Maximum.Value)}°</Text>
                </View>
          </View>
  )
}



const Forecasts = ({ data, isLoading, forecasts, color }) => {
    const [current, setCurrent] = useState('')
    const kelvinToCelcius = (temp) => {
        return Math.round(temp - 273.15)
  }
  !isLoading && console.log(forecasts, 'from lower forecast')
  console.log(data, 'from lower datsa')
  console.log(isLoading, 'from lower ')
  !isLoading && console.log(new Date(forecasts[0]?.Date).getDay(), 'from lower forecast temp')
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let day = days[new Date(forecasts[0]?.Date).getDay()]
    
    
  return (
    <View style = {styles.basic}>
      {/* lower */}
      <View style={{ ...styles.container, backgroundColor: color }}>
        <View style={styles.forecastHead}>
          
          <View style={styles.headers}>
            {!isLoading && <Text style={styles.headTop}>{data?.main?.temp_min > 50 ? `${kelvinToCelcius(Math.round(data?.main?.temp_min))}°` : `${Math.round(data?.main?.temp_min)}°`  }</Text>}
            <Text style={styles.headBottom}>Min</Text>
          </View>

          <View style={styles.headers}>
            {!isLoading && <Text style={styles.headTop}>{data?.main?.temp > 50 ? `${kelvinToCelcius(Math.round(data?.main?.temp))}°` : `${Math.round(data?.main?.temp)}°`  }</Text>}
            <Text style={styles.headBottom}>Current</Text>
          </View>

          <View style={styles.headers}>
            {!isLoading && <Text style={styles.headTop}>{data?.main?.temp_max > 50 ? `${kelvinToCelcius(Math.round(data?.main?.temp_max))}°` : `${Math.round(data?.main?.temp_max)}°`  }</Text>}
            <Text style={styles.headBottom}>Max</Text>
          </View>
        </View>

        <View style={styles.forecasts}>
          {forecasts && forecasts.map((forecast, index) => (
            <Forecast key={index} data={forecast} />
          ))}          

          </View>
            
        </View>


    </View>
  )
}

export default Forecasts


const styles = StyleSheet.create({
 
  container: {
    height: '100%',
    width: '100%',
    // backgroundColor: "#47ab2f",
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
    marginLeft: -18,
  },

  iconImage: {
    width: 35,
    height: 35,

  },
  forecastText: {
    color: 'white',
    fontSize: 16,
  }
  
 
});
