import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Button, SafeAreaView} from "react-native";
import { useState, useEffect } from "react";
import Svg, { Rect, Circle, Line } from "react-native-svg";
import { Text as SVGText } from "react-native-svg";

export default function Graph(props) {
  const [graphData, setGraphData] = useState({});
  const [renewData, setRenewData] = useState({});
  const [region, setRegion] = useState("lzLcra");
  const [day, setDay] = useState("currentDay"); // damSppData or rtSppData
  const [points, setPoints] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1);
  const [renewPoints, setRenewPoints] = useState([]);
  const [maxRenewProd, setMaxRenewProd] = useState(1);

  useEffect(() => {
    //console.log(props.availability)
    fetch("http://127.0.0.1:5000/getSystemWidePrices")
      .then((res) => res.json())
      .then((res) => {
        setGraphData(res);
      });
    fetch("http://127.0.0.1:5000/getCombinedWindandSolar")
      .then((res) => res.json())
      .then((res) => setRenewData(res));
  }, []);

  // change the points after the graph data gets changed
  useEffect(() => {
    if (graphData.rtSppData && graphData.damSppData) {
      let newRTPoints = [...graphData.rtSppData.map(e => {
        const now = new Date(e.interval)
        const hoursElapsed = (e.interval - (e.interval - 1000*(now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds() ))) / 3600000 
        return ({
          hoursElapsed: hoursElapsed,
          price: e[region]
        })}
      )]
      let maxTimeStamp = Math.max(...newRTPoints.map(e => e.hoursElapsed))
      let newDAMPoints = [...graphData.damSppData.map(e => {
        const now = new Date(e.interval)
        const hoursElapsed = (e.interval - (e.interval - 1000*(now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds() ))) / 3600000 
        return ({
          hoursElapsed: hoursElapsed,
          price: e[region]
        })}
      ).filter(e => e.hoursElapsed > maxTimeStamp)
      ]
      setPoints([...newRTPoints, ...newDAMPoints])
    }
  }, [graphData]);

  useEffect(() => {
    if (renewData[day]) {
      let newRenewData = [];
      if (day === "currentDay") {
        for (const hrEntry of Object.entries(renewData[day].data)) {
          const hourEntry = hrEntry[1]
          let entry = {hour: hourEntry.hourEnding}
          if (hourEntry.actualWind && hourEntry.actualSolar) {
            entry.combined = hourEntry.actualWind + hourEntry.actualSolar;
          } else {
            entry.combined = hourEntry.copHslWind + hourEntry.copHslSolar;
          }
          newRenewData.push(entry);
        }
      } else {
        for (const hrEntry of Object.entries(renewData[day].data)) {
          const hourEntry = hrEntry[1]
          let entry = {hour: hourEntry.hourEnding}
          entry.combined = hourEntry.copHslSolar + hourEntry.copHslWind
          newRenewData.push(entry)
        }  
      }
      console.log(newRenewData)
      setRenewPoints(newRenewData)
      setMaxRenewProd(1 + Math.max(...newRenewData.map(e => e.combined)))
    } 
  }, [renewData, day])

  useEffect(() => { 
    console.log(points)
    points.length > 0 && setMaxPrice(Math.max(...points.map(e => e.price)))
  }, [points])
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="Go Home" onPress={props.goHome}></Button>
      <ScrollView contentContainerStyle={styles.container}>
        <View width="100%" height={400} alignItems="center" justifyContent="center">
          <Svg height="100%" width="90%" viewBox="0 0 170 120" >
            <Line x1="20" y1="100" x2="170" y2="100" stroke="black" strokeWidth="2" />
            <Line x1="21" y1="0" x2="21" y2="100" stroke="black" strokeWidth="2" />
            {points.length > 0 && points.map((point, i) => {
                //const now = new Date(point.timeStamp)
                //const hoursElapsed = (point.timeStamp - (point.timeStamp - 1000*(now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds() ))) / 3600000 
                //console.log(hoursElapsed)
                return (<Circle cx={20 + point.hoursElapsed/24*150} 
                        cy={100-(point.price)/(maxPrice)*100} 
                        r={.5} key={i} fill="red">
                        </Circle>) 
              }
            )}
            {[...Array(13).keys()].map(e => <SVGText x={20 + e/13*150 + 150/48} y={110} fill="black" fontSize="5">{e*2}</SVGText>)}
            <SVGText x={10} y={100} fill="black" fontSize="5">{0}</SVGText>
            <SVGText x={5} y={5} fill="black" fontSize="5">{maxPrice}</SVGText>
            {props.availability.length > 0 && props.availability.map((interval, i) => <Rect x={20 + interval[0]/1440*150} y={0} height={100} fill="blue" opacity=".1" width={interval[1]/1440*150}></Rect>)}

          </Svg>
        </View>
        <Text>High: {Math.max(...points.map((e) => e.price))}</Text>
        <Text>Low: {Math.min(...points.map((e) => e.price))}</Text>
        <Text>
          First:{" "}
          {points.length > 0 && new Date(points[0].timeStamp).toTimeString()}
        </Text>
        <Text>
          Last:{" "}
          {points.length > 0 &&
            new Date(points[points.length - 1].timeStamp - 1000).toTimeString()}
        </Text>
        <Button
          title={day === "currentDay" ? "Current Day" : "Next Day"}
          onPress={() => setDay(day == "currentDay" ? "nextDay" : "currentDay")}
        />

        <View
          width="100%"
          height={400}
          alignItems="center"
          justifyContent="center"
        >
          <Svg height="100%" width="90%" viewBox="0 0 170 120">
            <Line
              x1="20"
              y1="100"
              x2="170"
              y2="100"
              stroke="black"
              strokeWidth="2"
            />
            <Line
              x1="21"
              y1="0"
              x2="21"
              y2="100"
              stroke="black"
              strokeWidth="2"
            />
            {renewPoints.length > 0 &&
              renewPoints.map((point, i) => {
                //console.log(hoursElapsed)
                return (
                  <Circle
                    cx={20 + (point.hour / 24) * 150}
                    cy={100 - (point.combined / maxRenewProd) * 100}
                    r={0.5}
                    key={i}
                    fill="red"
                  ></Circle>
                );
              })}
            {[...Array(13).keys()].map((e) => (
              <SVGText
                x={20 + (e / 13) * 150 + 150 / 48}
                y={110}
                fill="black"
                fontSize="5"
              >
                {e * 2}
              </SVGText>
            ))}
            <SVGText x={10} y={100} fill="black" fontSize="5">
              {0}
            </SVGText>
            <SVGText x={5} y={5} fill="black" fontSize="5">
              {maxRenewProd}
            </SVGText>
            {props.availability.length > 0 &&
              props.availability.map((interval, i) => (
                <Rect
                  x={20 + (interval[0] / 1440) * 150}
                  y={0}
                  height={100}
                  fill="blue"
                  opacity=".1"
                  width={(interval[1] / 1440) * 150}
                ></Rect>
              ))}
          </Svg>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
