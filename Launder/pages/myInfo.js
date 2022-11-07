import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
function myInfo(props) {
  return (
    <View style={styles.container}>
      <Text>My Free Hours</Text>
      <Text>Wash time</Text>
      <Text>Dry Time</Text>
      <Text>Location</Text>
      <Button onPress={props.goHome} title="Go home" />
    </View>
  );
}

export default myInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
