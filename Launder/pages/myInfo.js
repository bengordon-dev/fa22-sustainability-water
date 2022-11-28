import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import AvailabilitySelector from "../components/AvailabilitySelector";

export default function myInfo(props) {
  const [availabilityShown, showAvailability] = useState(false);
  //const [number, onChangeNumber] = React.useState(null);
  //const [number2, onChangeNumber2] = React.useState(null);

  useEffect(() => {
    const time = new Date()
    props.setNowInterval(Math.floor((time.getHours()*60 + time.getMinutes()) / 30))
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <Text onPress={() => showAvailability(!availabilityShown)}>
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
      <Text>Wash Time (Minutes)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setWashTime(parseInt(text))}
        value={props.washTime.toString()}
        placeholder="Wash Time"
        keyboardType="numeric"
      />
      <Text>Dry Time (Minutes)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setDryTime(parseInt(text))}
        value={props.dryTime.toString()}
        placeholder="Dry Time"
        keyboardType="numeric"
      />
      <Text>Washing Machine Power (Watts)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setWashPower(parseInt(text))}
        value={props.washPower.toString()}
        placeholder="Washer Power"
        keyboardType="numeric"
      />
      <Text>Dryer Power (Watts)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => props.setDryPower(parseInt(text))}
        value={props.dryPower.toString()}
        placeholder="Dryer Power"
        keyboardType="numeric"
      />
      <Button onPress={props.goHome} title="Go home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
