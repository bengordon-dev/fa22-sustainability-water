import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import { useState } from "react";
import AvailabilitySelector from "../components/AvailabilitySelector";
export default function myInfo(props) {
  const [availabilityShown, showAvailability] = useState(false)
  return (
    <SafeAreaView style={styles.container}>
      <Text onPress={() => showAvailability(!availabilityShown)}>My Free Hours</Text>
      {availabilityShown && <View style={{height: 500}}><AvailabilitySelector 
                              freeIntervals={props.freeIntervals}
                              setFreeIntervals={props.setFreeIntervals}
                            /></View>
      }
      <Text>Wash time</Text>
      <Text>Dry Time</Text>
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
});
