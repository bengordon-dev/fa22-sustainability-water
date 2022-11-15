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
import { useState } from "react";
import AvailabilitySelector from "../components/AvailabilitySelector";

export default function myInfo(props) {
  const [availabilityShown, showAvailability] = useState(false);
  //const [number, onChangeNumber] = React.useState(null);
  //const [number2, onChangeNumber2] = React.useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <Text onPress={() => showAvailability(!availabilityShown)}>
        My Free Hours
      </Text>
      {availabilityShown && (
        <View style={{ height: 500 }}>
          <AvailabilitySelector
            freeIntervals={props.freeIntervals}
            setFreeIntervals={props.setFreeIntervals}
          />
        </View>
      )}
      <Text>Wash Time (Minutes)</Text>
      <TextInput
        setWashTime={props.setWashTime}
        washTime={props.washTime}
        style={styles.input}
        onChangeText={props.setWashTime}
        value={props.washTime}
        placeholder="WashTime"
        keyboardType="numeric"
      />
      <Text>Dry Time (Minutes)</Text>
      <TextInput
        setDryTime={props.setDryTime}
        dryTime={props.dryTime}
        style={styles.input}
        onChangeText={props.setDryTime}
        value={props.dryTime}
        placeholder="DryTime"
        keyboardType="numeric"
      />
      <Text>Location</Text>
      <Button onPress={props.goHome} title="Go home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
