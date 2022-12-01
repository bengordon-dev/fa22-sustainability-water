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
  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/BackOpenScreen.jpg")}
      // make svg > ../assets/OpenScreenBackground.svg
    >
      {/*  Add price <Text>Per MWh</Text> */}
      {/* <Image
        style={styles.logo}
        source={require("../assets/launderLogo.jpg")}
  />*/}
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
  logo: {
    width: 200,
    height: 200,
    top: -160,
    left: -10,
  },
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
    //lineHeight: 21,
    //fontFamily: "Open Sans",
    //fontStyle:["normal", "italic"],
    //letterSpacing: 0.25,
    fontFamily: "nunito-semibold",
    fontSize: 36,
    //fontWeight: "600",
    color: "white",
    bottom: -10,
    left: 70,
  },
  enerdyDataButtonText: {
    //fontFamily: "Open Sans",
    //fontStyle:["normal", "italic"],
    //letterSpacing: 0.25,
    //lineHeight: 21,
    fontSize: 36,
    fontFamily: "nunito-semibold",
    //fontWeight: "600",
    color: "white",
    bottom: -10,
    left: 45,
  },
  myInfoButtonText: {
    //fontFamily: "Open Sans",
    //fontStyle:["normal", "italic"],
    //letterSpacing: 0.25,
    //lineHeight: 21,
    //fontWeight: "600",
    fontSize: 36,
    fontFamily: "nunito-semibold",
    color: "white",
    bottom: -10,
    left: 85,
  },
});
