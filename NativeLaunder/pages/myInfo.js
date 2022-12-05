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
import AsyncStorage from '@react-native-async-storage/async-storage';


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

  setValuesAsync = async (dryPower, washPower, dryTime, washTime) => {
      try {
      await AsyncStorage.setItem('@dryerPower', dryPower.toString())
      await AsyncStorage.setItem('@washerPower', washPower.toString())
      await AsyncStorage.setItem('@dryerTime', dryTime.toString())
      await AsyncStorage.setItem('@washerTime', washTime.toString())
    } catch(e) {
      // save error
    }
  }

  async function goHome() {
    await setValuesAsync(props.dryPower, props.washPower, props.dryTime, props.washTime)
    .then(() => props.goHome())
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.backButtonRow}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.5}
        onPress={() => goHome()}
      >
        <Image
          source={require("../assets/return.jpg")}
        />
      </TouchableOpacity>
      <Text style={styles.backButtonText}>My Info</Text>
      </View>

      
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
        onChangeText={(text) => props.setWashTime(text ? parseInt(text) : 0)}
        value={props.washTime.toString()}
        placeholder="Wash Time"
        keyboardType="numeric"
      />
      <Text style={styles.headers}>Dry Time (Minutes)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setDryTime(text ? parseInt(text) : 0)}
        value={props.dryTime.toString()}
        placeholder="Dry Time"
        keyboardType="numeric"
      />
      <Text style={styles.headers}>Washing Machine Power (W)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setWashPower(text ? parseInt(text) : 0)}
        value={props.washPower.toString()}
        placeholder="Washer Power"
        keyboardType="numeric"
      />
      <Text style={styles.headers}>Dryer Power (W)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setDryPower(text ? parseInt(text) : 0)}
        value={props.dryPower.toString()}
        placeholder="Dryer Power"
        keyboardType="numeric"
      />
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
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#D9D9D9",
    borderRadius: 50,
  },
  backButton: {
    //flexDirection: "row",
    left: 15,
    marginRight: "auto"
  },
  backButtonText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 48,
    marginRight: "30%",
  },
  backButtonRow: {
    flexDirection: "row", 
    alignItems: "center", 
    width: "100%", 
    marginBottom: 10
  },
  headers: {
    fontSize: 24,
    fontFamily: "nunito-regular",
    marginTop: 25
  },
});
