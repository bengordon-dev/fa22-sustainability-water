import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
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
      <View style={styles.scheduleButton}>
        <Button
          onPress={() => props.setPage("schedule")}
          title="Schedule"
          color="#ffffff"
        />
      </View>
      <View style={styles.energyDataButton}>
        <Button
          onPress={() => props.setPage("graph")}
          title="Energy Data"
          color="#ffffff"
        />
      </View>
      <View style={styles.myInfoButton}>
        <Button
          onPress={() => props.setPage("myinfo")}
          //onPress={() => console.log("myInfoPage")}
          title="My Info"
          color="#ffffff"
        />
      </View>
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
});
