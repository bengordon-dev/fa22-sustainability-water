import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

export default function myInfo(props) {
  return (
    <View style={styles.container}>
      <Text>My Free Hours</Text>
      <Text>Wash Time</Text>
      <Text>Dry Time</Text>
      <Text>Location</Text>
      <Button onPress={props.goHome} title="Go home" />
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
});
