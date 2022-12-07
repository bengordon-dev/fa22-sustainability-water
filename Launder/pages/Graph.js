import { StyleSheet, Image, TouchableOpacity, Text, View, SafeAreaView, Pressable
} from "react-native";
import { useState, useEffect } from "react";
import GraphSVG from "../components/GraphSVG";

export default function Graph(props) {
  const [maxPrice, setMaxPrice] = useState(1);
  const [maxRenewProd, setMaxRenewProd] = useState(1);

  // change the points after the graph data gets changed
  useEffect(() => {
    const time = new Date();
    props.setNowInterval(
      Math.floor((time.getHours() * 60 + time.getMinutes()) / 30)
    );
  }, []);

  useEffect(() => {
    setMaxRenewProd(1 + Math.max(...props.renewPoints.map((e) => e.combined)));
  }, [props.renewPoints]);

  useEffect(() => {
    props.points.length > 0 &&
      setMaxPrice(Math.max(...props.points.map((e) => e.price)));
  }, [props.points]);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center"}}>
     <View style={styles.backButtonRow}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.5}
          onPress={() => props.setPage("home")}
        >
          <Image
            source={require("../assets/return.jpg")}
          />
        </TouchableOpacity>
        <Text style={styles.backButtonText}>Data</Text>
      </View>
        <GraphSVG
          height={290} width={"90%"}
          points={props.points}
          startHour={props.nowInterval / 2}
          availability={props.availability}
          maxVal={maxPrice}
          timeField={"hoursElapsed"} valField={"price"}
          title={"Electricity Price ($/MWh)"}
          chosenTime={props.chosenTime}
          day={props.day}
        />

        <TouchableOpacity
          onPress={() =>
            props.setDay(props.day == "currentDay" ? "nextDay" : "currentDay")
          }
        >
          <Text style={styles.daySelector}>{props.day === "currentDay" ? "Current Day" : "Next Day"}</Text>
        </TouchableOpacity>

        <GraphSVG
          height={290} width={"90%"}
          points={props.renewPoints}
          startHour={props.nowInterval / 2}
          availability={props.availability}
          maxVal={maxRenewProd}
          timeField={"hour"} valField={"combined"}
          title="Wind + Solar Production (MW)"
          chosenTime={props.chosenTime}
          day={props.day}
        />
        <Pressable
          style={styles.scheduleButton}
          onPress={() => props.setPage("schedule")}
        >
          <Text style={styles.scheduleButtonText}>Schedule</Text>
        </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    flexGrow: 1,
    //height: "100%"
  },
  backButtonRow: {
    flexDirection: "row", 
    alignItems: "center", 
    width: "100%", 
  },
  backButton: {
    left: 15,
    marginRight: "auto"
  },
  backButtonText: {
    fontFamily: "Nunito-extrabold",
    fontSize: 48,
    marginRight: "36%",
  },
  scheduleButton: {
    backgroundColor: "#48C16D",
    width: 230,
    height: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  scheduleButtonText: {
    flexDirection: "row",
    textAlign: "center",
    fontFamily: "Nunito-SemiBold",
    fontSize: 24,
  },
  daySelector: {
    color: "#007AFF", 
    fontSize: 20, 
    fontFamily: "nunito-semibold",
    marginBottom: 10
  }
});
