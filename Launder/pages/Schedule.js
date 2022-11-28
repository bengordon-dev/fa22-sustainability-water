import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
const customData = require("../sample-data.json");
import { useState, useEffect } from "react";


export default function Schedule(props) {
  const [daysIncluded, setDaysIncluded] = useState("today") // "today", "tomorrow", or "both"

  
  function selectTimes() {
    console.log("highly complex algorithm")
  }

  useEffect(() => {
    const time = new Date()
    props.setNowInterval(Math.floor((time.getHours()*60 + time.getMinutes()) / 30))
  }, [])
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule</Text>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%"}}>
        <Text style={{fontSize: 16, marginRight: 5, marginLeft: 20}}>Days included:</Text>
        <View style={{backgroundColor: daysIncluded === "today" ? "green" : "white"}}>
          <Button onPress={() => setDaysIncluded("today")} title="Today"
            color={daysIncluded === "today" ? "white" : "blue"}
          />
        </View>
        <View style={{backgroundColor: daysIncluded === "tomorrow" ? "green" : "white"}}>
          <Button onPress={() => setDaysIncluded("tomorrow")} title="Tommorrow"
            color={daysIncluded === "tomorrow" ? "white" : "blue"}
          />
        </View>
        <View style={{backgroundColor: daysIncluded === "both" ? "green" : "white"}}>
          <Button onPress={() => setDaysIncluded("both")} title="Both"
           color={daysIncluded === "both" ? "white" : "blue"}
          />
        </View>
      </View>
      <Button onPress={() => selectTimes()} title="Pick Times"/>
      <View style={styles.schedule}>
        <View style={styles.washDryAlign}>
          <View style={styles.wash}>
            <Text style={styles.washDryText}>Wash</Text>
            <View style={styles.blueBlockHeader}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>Start</Text>
              <Text style={{ marginRight: 10, fontSize: 20 }}>End</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "65%",
                alignItems: "center",
              }}
            >
              <View style={[styles.rectangle, { borderRightWidth: 1 }]}></View>
              <View style={styles.rectangle}></View>
            </View>
          </View>
          <View style={styles.dry}>
            <Text style={styles.washDryText}>Dry</Text>
            <View style={styles.blueBlockHeader}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>Start</Text>
              <Text style={{ marginRight: 10, fontSize: 20 }}>End</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "65%",
                alignItems: "center",
              }}
            >
              <View style={[styles.rectangle, { borderRightWidth: 1 }]}></View>
              <View style={styles.rectangle}></View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        <View style={styles.buttonOne}>
          <Button onPress={props.goHome} title="Go home" />
          <Button title="Remind me" />
        </View>
        <View>
          <Button title="Energy data" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
    marginTop: 70,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    // flex: 1,
    fontSize: 64,
  },
  schedule: {
    flex: 3,
    flexDirection: "column",
    // justifyContent: 'space-between',
  },
  washDryAlign: {
    marginTop: 60,
    // justifyContent: 'space-between',
    flexDirection: "row",
    flex: 1,
    width: "100%",
  },
  wash: {
    flexDirection: "column",
    flex: 0.5,
    alignItems: "center",
  },
  dry: {
    flexDirection: "column",
    flex: 0.5,
    alignItems: "center",
  },
  blueBlockHeader: {
    flexDirection: "row",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  rectangle: {
    backgroundColor: "#B1C6E1",
    height: 228,
    width: "50%",
  },
  washDryText: {
    fontSize: 40,
  },
  buttons: {
    flexDirection: "column",
  },
  buttonOne: {
    flexDirection: "row",
  },
});
