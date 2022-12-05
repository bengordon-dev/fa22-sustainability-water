import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import AvailabilitySelector from "../components/AvailabilitySelector";

export default function myInfo(props) {
  const [availabilityShown, showAvailability] = useState(false);
  //const [number, onChangeNumber] = React.useState(null);
  //const [number2, onChangeNumber2] = React.useState(null);

  useEffect(() => {
    const time = new Date();
    props.setNowInterval(
      Math.floor((time.getHours() * 60 + time.getMinutes()) / 30)
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.5}
        onPress={props.goHome}
      >
        <Image
          source={require("../assets/return.jpg")}
          //style={styles.buttonImageIconStyle}
        />
      </TouchableOpacity>
      <Text style={styles.backButtonText}>My Info</Text>

      <Text
        onPress={() => showAvailability(!availabilityShown)}
        style={styles.headers}
      >
        My Free Hours
      </Text>
      {availabilityShown && (
        <View style={{ maxHeight: 500, minHeight: 300 }}>
          <AvailabilitySelector
            day={props.day}
            setDay={props.setDay}
            freeIntervals={props.freeIntervals}
            setFreeIntervals={props.setFreeIntervals}
            nowInterval={props.nowInterval}
          />
        </View>
      )}
      <Text style={styles.headers}>Wash Time (Minutes)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setWashTime(parseInt(text))}
        value={props.washTime.toString()}
        placeholder="Wash Time"
        keyboardType="numeric"
      />
      <Text style={styles.headers}>Dry Time (Minutes)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setDryTime(parseInt(text))}
        value={props.dryTime.toString()}
        placeholder="Dry Time"
        keyboardType="numeric"
      />
      <Text style={styles.headers}>Washing Machine Power (Watts)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setWashPower(parseInt(text))}
        value={props.washPower.toString()}
        placeholder="Washer Power"
        keyboardType="numeric"
      />
      <Text style={styles.headers}>Dryer Power (Watts)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setDryPower(parseInt(text))}
        value={props.dryPower.toString()}
        placeholder="Dryer Power"
        keyboardType="numeric"
      />
      {/* <Button onPress={props.goHome} title="Go home" /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //paddingTop: 40,
    // paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    height: 50,
    width: 80,
    textAlign: "center",
    fontFamily: "nunito-regular",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#D9D9D9",
    borderRadius: 50,
  },
  backButton: {
    //flexDirection: "row",
    top: 10,
    left: -195,
  },
  headers: {
    fontFamily: "nunito-regular",
    fontSize: 24,
  },
  backButtonText: {
    fontFamily: "nunito-extrabold",
    fontSize: 48,
    top: -42.5,
    //left: -90,
    textAlign: "center",
  },
});
