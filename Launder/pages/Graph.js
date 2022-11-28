import { StyleSheet, Text, View, ScrollView, Button, SafeAreaView} from "react-native";
import { useState, useEffect } from "react";
import Svg, { Rect, Circle, Line } from "react-native-svg";
import { Text as SVGText } from "react-native-svg";
import GraphSVG from "../components/GraphSVG";


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
          title={"Electricity Price ($/MWh)"}
        />

        <Button
          title={props.day === "currentDay" ? "Current Day" : "Next Day"}
          onPress={() => props.setDay(props.day == "currentDay" ? "nextDay" : "currentDay")}
        />

        <GraphSVG height={350} width={"90%"} points={props.renewPoints} 
          startHour={props.nowInterval / 2}
          availability={props.availability} maxVal={maxRenewProd} timeField={"hour"} valField={"combined"}
          title="Wind + Solar Production (MW)"
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
