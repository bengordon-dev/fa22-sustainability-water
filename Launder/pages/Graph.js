import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';
const customData = require('../sample-data.json');
import Svg, { Rect, Circle } from 'react-native-svg';


export default function Graph(props) {
  const [graphData, setGraphData] = useState({})
  useEffect(() => {
    fetch("http://127.0.0.1:5000/getSystemWidePrices").then((res) => res.json())
    .then((res) => {
      setGraphData(res)
      //console.log(res)
    })

  }, [])
  return (
    <View style={styles.container}>
      <Text>graph graph graph</Text>
      <Button
        onPress={props.goHome}
        title="Go home"
        color="#841584"
      />
      <Text>{customData.lastUpdated}</Text>
      <Svg height="50%" width="50%" viewBox="0 0 100 100" >
        <Circle cx="50" cy="50" r="50" stroke="purple" strokeWidth=".5" fill="violet" />
      </Svg>
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
