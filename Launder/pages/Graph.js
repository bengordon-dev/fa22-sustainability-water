import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Button, SafeAreaView} from "react-native";
import { useState, useEffect } from "react";
import Svg, { Rect, Circle, Line } from "react-native-svg";
import { Text as SVGText } from "react-native-svg";

function GraphSVG(props) {
  const hourRange = 24 - props.startHour
  return (
    <View width="100%" height={props.height} style={{alignItems: "center", justifyContent: "center"}}>
      <Svg height="100%" width={props.width} viewBox="0 0 170 120" >
        <Line x1="19" y1="100" x2="170" y2="100" stroke="black" strokeWidth="2" />
        <Line x1="20" y1="0" x2="20" y2="100" stroke="black" strokeWidth="2" />
        {props.points.length > 0 && props.points.map((point, i) => {
          return (<Circle cx={20 + (point[props.timeField] - props.startHour)/hourRange*150} 
                  cy={100-(point[props.valField])/(props.maxVal)*100} 
                  r={.5} key={i} fill="red">
                  </Circle>) 
          }
        )}
        {[...Array(9).keys()].map(e => <SVGText x={20 + e*150/8 + 150/48} y={110} fill="black" fontSize="5">{props.startHour + e*hourRange/8}</SVGText>)}
        <SVGText x={14} y={100} fill="black" fontSize="5">{0}</SVGText>
        <SVGText x={17 - 3*(Math.floor(props.maxVal/2)).toString().length} y={50} fill="black" fontSize="5">{Math.floor(props.maxVal/2)}</SVGText>
        <SVGText x={17 - 3*(Math.floor(props.maxVal)).toString().length} y={5} fill="black" fontSize="5">{Math.floor(props.maxVal)}</SVGText>
        {props.availability.length > 0 && 
          props.availability.filter(e => Math.floor((e[0] + e[1])/30) > props.startHour*2).map((interval, i) => {
            const width = Math.min(interval[1] + interval[0] - props.startHour*60, interval[1])
            return (
            <Rect 
              x={20 + Math.max(0, (interval[0] - props.startHour*60)/(hourRange*60))*150} 
              y={0} height={100} fill="blue" opacity=".1" width={width/1440*150}/>
            )
          }

        )}

      </Svg>
    </View>
  )
}


export default function Graph(props) {
  const [maxPrice, setMaxPrice] = useState(1);
  const [maxRenewProd, setMaxRenewProd] = useState(1);

  // change the points after the graph data gets changed
  useEffect(() => {
    const time = new Date()
    props.setNowInterval(Math.floor((time.getHours()*60 + time.getMinutes()) / 30))
  }, [])

  
  useEffect(() => {
    setMaxRenewProd(1 + Math.max(...props.renewPoints.map(e => e.combined)))
  }, [props.renewPoints])

  useEffect(() => { 
    props.points.length > 0 && setMaxPrice(Math.max(...props.points.map(e => e.price)))
  }, [props.points])
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="Go Home" onPress={() => props.setPage("home")}></Button>
      <ScrollView contentContainerStyle={styles.container}>
        <GraphSVG height={350} width={"90%"} points={props.points} 
          startHour={props.nowInterval / 2}
          availability={props.availability} maxVal={maxPrice} timeField={"hoursElapsed"} valField={"price"}
        />

        <Button
          title={props.day === "currentDay" ? "Current Day" : "Next Day"}
          onPress={() => props.setDay(props.day == "currentDay" ? "nextDay" : "currentDay")}
        />

        <GraphSVG height={350} width={"90%"} points={props.renewPoints} 
          startHour={props.nowInterval / 2}
          availability={props.availability} maxVal={maxRenewProd} timeField={"hour"} valField={"combined"}
        />
      </ScrollView>
      <Button title="Schedule" onPress={() => props.setPage("schedule")}></Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    flexGrow: 1,
    //height: "100%"
  },
});
