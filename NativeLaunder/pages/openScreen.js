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
      <Image
        style={styles.logo}
        source={require("../assets/launderLogo.jpg")}
      />
      <Text style={styles.title}>
        {" "}
        Launder{" "}
      </Text>
      <Pressable
        style={[styles.scheduleButton, styles.bigButton]}
        onPress={() => props.setPage("schedule")}
      >
        <Text style={styles.buttonText}>Schedule</Text>
      </Pressable>
      <Pressable
        style={[styles.energyDataButton, styles.bigButton]}
        onPress={() => props.setPage("graph")}
      >
        <Text style={styles.buttonText}>Energy Data</Text>
      </Pressable>
      <Pressable
        style={[styles.myInfoButton, styles.bigButton]}
        onPress={() => props.setPage("myinfo")}
      >
        <Text style={styles.buttonText}>My Info</Text>
      </Pressable>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 45,
    marginRight: 25
  },
  title: {
    fontFamily: "nunito-semibold",
    fontSize: 36,
    color: "black",
    marginBottom: 80
  },
  scheduleButton: {
    backgroundColor: "lightgreen",
  },
  energyDataButton: {
    backgroundColor: "green",
  },
  myInfoButton: {
    backgroundColor: "#0D305C",
  },
  bigButton: {
    width: 290,
    height: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  },
  buttonText: {
    fontFamily: "nunito-semibold",
    fontSize: 36,
    color: "white",
  }
});
