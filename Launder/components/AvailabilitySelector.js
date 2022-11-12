import { StyleSheet, Text, View, ScrollView, Button } from "react-native";

export default function AvailabilitySelector(props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {[...Array(24 * 4).keys()].map((e, i) => {
        const time = new Date();
        time.setHours(Math.floor((e * 15) / 60));
        time.setMinutes((e * 15) % 60);
        let timeString = time.toTimeString().split(" ")[0];
        timeString = timeString.substring(0, timeString.length - 3);
        return (
          <View style={{ width: "100%", flexDirection: "row" }} key={i}>
            <Text style={{ width: "20%" }}>{timeString}</Text>
            <View
              style={{ width: "80%", height: 20 }}
              backgroundColor="#9f9"
            ></View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: "#eee",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
