import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';
import Svg, { Rect, Circle, Line } from 'react-native-svg';


export default function Graph(props) {
  const [graphData, setGraphData] = useState({})
  const [region, setRegion] = useState("lzLcra")
  const [day, setDay] = useState("damSppData"); // damSppData or rtSppData
  const [points, setPoints] = useState([])
  const [maxPrice, setMaxPrice] = useState(1)
  
  useEffect(() => {
    fetch("http://127.0.0.1:5000/getSystemWidePrices").then((res) => res.json())
    .then((res) => {
      setGraphData(res)
    })
  }, [])

  // change the points after the graph data gets changed 
  useEffect(() => {
    graphData[day] && setPoints(graphData[day].map(e => ({
      timeStamp: e.interval,
       price: e[region]
      })))
  }, [graphData, day])

  useEffect(() => {
    graphData && graphData.damSppData && graphData.rtSppData && 
      setMaxPrice(Math.max(...graphData.damSppData.map(e => e[region]), ...graphData.rtSppData.map(e => e[region])))
  }, [graphData])
  
  return (
    <View style={styles.container}>
      <Button
        onPress={props.goHome}
        title="Go home"
        color="#841584"
      />
      <Button title={day === "damSppData" ? "Day Ahead data" : "Real-time data"}
        onPress={() => setDay(day == "damSppData" ? "rtSppData" : "damSppData")}/>
      <View width="100%" alignItems="center" justifyContent="center">
        <Svg height="50%" width="80%" viewBox="0 0 150 100" >
          <Line x1="0" y1="100" x2="150" y2="100" stroke="black" strokeWidth="2" />
          <Line x1="1" y1="0" x2="1" y2="100" stroke="black" strokeWidth="2" />
          {points.length > 0 && points.map((point, i) => {
              const now = new Date(point.timeStamp)
              const hoursElapsed = (point.timeStamp - (point.timeStamp - 1000*(now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds() ))) / 3600000 
              //console.log(hoursElapsed)

              return (<Circle cx={ /*(point.timeStamp-firstTime)/(lastTime-firstTime)*/hoursElapsed/24*150} 
                      cy={100-(point.price)/(maxPrice)*100} 
                      r={1} key={i} fill="red">
                      </Circle>) 
            }
          )}
        </Svg>
        <View width="100%" height={50} flexDirection="row" justifyContent="center">{[...Array(4).keys()].map(e => <Text marginLeft={50} color="black">{e}</Text>)}</View>
      </View>
      <Text>High: {Math.max(...points.map(e => e.price))}</Text>
      <Text>Low: {Math.min(...points.map(e => e.price))}</Text>
      <Text>First: {points.length > 0  && (new Date(points[0].timeStamp)).toTimeString()}</Text>
      <Text>Last: {points.length > 0  && (new Date(points[points.length-1].timeStamp - 1000)).toTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
