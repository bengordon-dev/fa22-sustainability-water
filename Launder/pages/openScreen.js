import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { useState, useEffect } from "react";

export default function OpenScreen(props) {
  return (
    <View style={styles.container}>
      {/*  <Text>Per MWh</Text> */}
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/launderLogo.jpg")}
        />
        <Text>Launder</Text>
      </View>
      <View style={styles.scheduleButton}>
        <Button
          onPress={() => props.setPage("schedule")}
          title="Schedule"
          color="#841584"
        />
      </View>
      <View style={styles.energyDataButton}>
        <Button
          onPress={() => props.setPage("graph")}
          title="Energy Data"
          color="#841584"
        />
      </View>
      <View style={styles.myInfoButton}>
        <Button
          onPress={() => console.log("myInfoPage")}
          title="My Info"
          color="#841584"
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    position: "absolute",
    bottom: 60,
    left: 100,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  scheduleButton: {
    backgroundColor: "lightgreen",
    width: 290,
    height: 70,
    bottom: -10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  energyDataButton: {
    backgroundColor: "green",
    width: 290,
    height: 70,
    bottom: -35,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  myInfoButton: {
    backgroundColor: "#0D305C",
    width: 290,
    height: 70,
    bottom: -60,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
