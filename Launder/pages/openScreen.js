import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Button,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";

export default function OpenScreen(props) {
  useEffect(() => {
    const time = new Date()
    props.setNowInterval(Math.floor((time.getHours()*60 + time.getMinutes()) / 30))
  }, [])
  
  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/BackOpenScreen.jpg")}
      // make svg > ../assets/OpenScreenBackground.svg
    >
      {/*  Add price <Text>Per MWh</Text> */}
      <Pressable
        style={styles.scheduleButton}
        onPress={() => props.setPage("schedule")}
      >
        <Text style={styles.scheduleButtonText}>Schedule</Text>
      </Pressable>
      <Pressable
        style={styles.energyDataButton}
        onPress={() => props.setPage("graph")}
      >
        <Text style={styles.enerdyDataButtonText}>Energy Data</Text>
      </Pressable>
      <Pressable
        style={styles.myInfoButton}
        onPress={() => props.setPage("myinfo")}
      >
        <Text style={styles.myInfoButtonText}>My Info</Text>
      </Pressable>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  //fix button texts
  scheduleButton: {
    backgroundColor: "lightgreen",
    width: 290,
    height: 70,
    bottom: -50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  energyDataButton: {
    backgroundColor: "green",
    width: 290,
    height: 70,
    bottom: -75,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  myInfoButton: {
    backgroundColor: "#0D305C",
    width: 290,
    height: 70,
    bottom: -100,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  scheduleButtonText: {
    fontSize: 33,
    //lineHeight: 21,
    fontWeight: "600",
    //fontFamily: "Open Sans",
    //fontStyle:["normal", "italic"],
    //letterSpacing: 0.25,
    color: "white",
    bottom: -15,
    left: 75,
  },
  enerdyDataButtonText: {
    fontSize: 33,
    //lineHeight: 21,
    fontWeight: "600",
    //fontFamily: "Open Sans",
    //fontStyle:["normal", "italic"],
    //letterSpacing: 0.25,
    color: "white",
    bottom: -13,
    left: 55,
  },
  myInfoButtonText: {
    fontSize: 33,
    //lineHeight: 21,
    fontWeight: "600",
    //fontFamily: "Open Sans",
    //fontStyle:["normal", "italic"],
    //letterSpacing: 0.25,
    color: "white",
    bottom: -12,
    left: 90,
  },
});
