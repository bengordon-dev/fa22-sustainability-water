import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
const customData = require("../sample-data.json");
import { useState, useEffect } from "react";

export default function Schedule(props) {
  const [daysIncluded, setDaysIncluded] = useState("today") // "today", "tomorrow", or "both"
  const [timeList, setTimeList] = useState([])
  const [selectIndex, setSelectIndex] = useState(-1)
  
  const currentTime = new Date()
  const month = currentTime.getMonth()
  const today = currentTime.getDate()

  function displayTime(obj, time) {
    return `${`${month + 1}/${today + obj.day}`} ${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${time % 60}`
  }


  // UNITS: $/watt
  function priceForMinute(time) {


    let data = props.points
    // naive approach
    let curTime = data[0].hoursElapsed*60;
    let index = 0;
    while (curTime < time) {
      curTime = data[++index].hoursElapsed*60;
    }
    
    return (data[index - 1].price + 
      (data[index].price - data[index - 1].price) * 
      (time - (data[index - 1].hoursElapsed*60)) / 
      ((data[index].hoursElapsed*60) - (data[index - 1].hoursElapsed*60)))
      / 60
      / 1000000    
  }

  function selectTimes() {
    let availability = []
    if (daysIncluded === "today") {
      availability = [...props.todayAvailability.map(e => [...e, 0])]
    } else if (daysIncluded === "tomorrow") {
      availability = [...props.tomorrowAvailability.map(e => [...e, 1])]
    } else {
      availability = [
        ...props.todayAvailability.map(e => [...e, 0]),
        ...props.tomorrowAvailability.map(e => [...e, 1])
      ]
    }

    let rankings = [];
    console.log("highly complex algorithm")
    for (let timeIndex = 0; timeIndex < availability.length; timeIndex++) {
      let minPrice = Number.MAX_SAFE_INTEGER;
      let bestTime = 0;
      // algorithm for finding the first time price
      let interval = availability[timeIndex]
      let startTime = interval[0];
      let intervalLength = interval[1]; 
      let totalPrice = 0;

      // note - price is price per megawatt hour.
      // washPower and dryPower are in watts, and the time interval of each
      // minute is obviously a minute

    
      for (let i = 0; i < props.washTime; i++) {
        totalPrice += props.washPower * priceForMinute(startTime + i);
    
      }
      for (let i = 0; i < props.dryTime; i++) {
        totalPrice += props.dryPower * priceForMinute(startTime + props.washTime + i);
      }
      if (totalPrice < minPrice) {
        minPrice = totalPrice; 
        bestTime = startTime;
      }

      let lastPrice = totalPrice;
      // algorithm for finding the next time's price (based on sliding window)
      let optimizations = 0;
      for (let i = 1; i < intervalLength - props.washTime - props.dryTime; i++) {
        totalPrice = lastPrice + 
          (priceForMinute(startTime + props.washTime + props.dryTime + i) * props.dryPower) 
          - (priceForMinute(startTime + i - 1) * props.washPower)
          + priceForMinute(startTime + props.washTime + i)*(props.washPower - props.dryPower)
        if (totalPrice < minPrice) {
          minPrice = totalPrice;
          bestTime = startTime + i;
          optimizations++;
        }
        lastPrice = totalPrice;
      }
      console.log(optimizations)
      rankings.push({day: interval[2], startTime: bestTime, price: minPrice})
    }
    
    rankings.sort((a, b) => a.price - b.price)
    console.log(rankings)
    setTimeList(rankings)
  }
   


  useEffect(() => {
    const time = new Date();
    props.setNowInterval(
      Math.floor((time.getHours() * 60 + time.getMinutes()) / 30)
    );
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.5}
        onPress={() => props.goHome()}
      >
        <Image
          source={require("../assets/schedulePage_return.jpg")}
          //style={styles.buttonImageIconStyle}
        />
      </TouchableOpacity>
      <Text style={styles.title}> </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <Text style={{ fontSize: 16, marginRight: 5, marginLeft: 20 }}>
          Days included:
        </Text>
        <View
          style={{
            backgroundColor: daysIncluded === "today" ? "green" : "white",
          }}
        >
          <Button
            onPress={() => setDaysIncluded("today")}
            title="Today"
            color={daysIncluded === "today" ? "white" : "blue"}
          />
        </View>
        <View
          style={{
            backgroundColor: daysIncluded === "tomorrow" ? "green" : "white",
          }}
        >
          <Button
            onPress={() => setDaysIncluded("tomorrow")}
            title="Tommorrow"
            color={daysIncluded === "tomorrow" ? "white" : "blue"}
          />
        </View>
        <View
          style={{
            backgroundColor: daysIncluded === "both" ? "green" : "white",
          }}
        >
          <Button
            onPress={() => setDaysIncluded("both")}
            title="Both"
            color={daysIncluded === "both" ? "white" : "blue"}
          />
        </View>
      </View>
      <Button onPress={() => selectTimes()} title="Pick Times" />
      <View style={styles.schedule}>
        <View style={styles.column}>
          <Text style={styles.washDryText}>Wash</Text>
          <View style={styles.twoRectWrapper}>
            <View style={styles.rectWrapper}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>Start</Text>
              <View style={[styles.rectangle, { borderRightWidth: 1 }]}>
                {timeList && timeList.map((e, i) => <Text key={i} 
                  style={{backgroundColor: selectIndex === i ? "orange" : "#B1C6E1"}} 
                  onPress={() => setSelectIndex(i)}>
                  {displayTime(e, e.startTime)}
                </Text>)}
              </View>
            </View>
            <View style={styles.rectWrapper}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>End</Text>
              <View style={styles.rectangle}>
              {timeList && timeList.map((e, i) => <Text key={i} 
                  style={{backgroundColor: selectIndex === i ? "orange" : "#B1C6E1"}} 
                  onPress={() => setSelectIndex(i)}>
                {displayTime(e, e.startTime + props.washTime)}
              </Text>)}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.washDryText}>Dry</Text>
          <View style={styles.twoRectWrapper}>
            <View style={styles.rectWrapper}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>End</Text>
              <View style={[styles.rectangle, { borderRightWidth: 1 }]}>
              {timeList && timeList.map((e, i) => <Text key={i} 
                  style={{backgroundColor: selectIndex === i ? "orange" : "#B1C6E1"}} 
                  onPress={() => setSelectIndex(i)}>
                {displayTime(e, e.startTime + props.washTime + props.dryTime)}
              </Text>)}
              </View>
            </View>
            <View style={styles.rectWrapper}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>Price</Text>
              <View style={styles.rectangle}>
                {timeList && timeList.map((e, i) => <Text key={i} 
                  style={{backgroundColor: selectIndex === i ? "orange" : "#B1C6E1"}} 
                  onPress={() => setSelectIndex(i)}>
                  {Math.round(e.price*1000)/10} cents
                </Text>)}
              </View>
            </View>
          </View>          
        </View>
      </View>
      <View style={styles.buttons}>
        <View style={styles.buttonOne}>
          {/*<Button onPress={props.goHome} title="Go home" />*/}
          <Button title="Remind me" />
        </View>
        <View>
          <Button title="Energy data" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
    marginTop: 70,
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    // flex: 1,
    fontSize: 64,
  },
  schedule: {
    flex: 3,
    flexDirection: "column",
    width: "100%",
    marginTop: 50,
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
    flex: 0.5,
    alignItems: "center",
  },
  twoRectWrapper: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    marginTop: 15,
  },
  rectWrapper: {
    width: "50%",
    alignItems: "center"
  },
  rectangle: {
    backgroundColor: "#B1C6E1",
    height: 228,
    width: "100%",
  },
  washDryText: {
    fontSize: 40,
  },
  buttons: {
    flexDirection: "column",
  },
  buttonOne: {
    flexDirection: "row",
  },
  backButton: {
    //flexDirection: "row",
    left: -85,
  },
});
