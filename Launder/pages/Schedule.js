import { StyleSheet, Text, View, TouchableOpacity,Image, Pressable, SafeAreaView
} from "react-native";
import { useEffect } from "react";
import {Notifications} from 'react-native-notifications';

function ButtonRow(props) {
  return <View style={styles.buttonRow}>
    <Text style={{ fontFamily: "Nunito-Regular", fontSize: 16, marginRight: 5, marginLeft: 20 }}>
      {props.text}
    </Text>
    {props.options && props.options.map((option, i) => 
      <View key={i}>
      <TouchableOpacity
        onPress={() => props.callback(option)}
        style={[{backgroundColor: props.stateVar === option ? "green" : "white"}, styles.buttonRowButton]}
      >
        <Text style={[styles.buttonRowButtonText, {color: props.stateVar === option ? "white" : "blue"}]}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </Text>
      </TouchableOpacity>
      </View>
    )}
  </View>
}

export default function Schedule(props) {
  const currentTime = new Date()
  const month = currentTime.getMonth()
  const today = currentTime.getDate()  

  // time is in minutes
  function displayTime(obj, minute) {
    let hour = Math.floor(minute / 60) % 12
    const half = Math.floor(minute / 60) >= 12 ? "P" : "A"
    hour = (hour === 0) ? 12 : hour
    return `${`${month + 1}/${today + obj.day}`} ${hour}:${minute % 60 < 10 ? "0" : ""}${minute % 60} ${half}M`
  }

  // UNITS: $
  function priceForMinute(minute, multiplier) {
    let data = props.points
    if (data.length === 0) return NaN
    // naive approach
    let index = 0;
    while (index < data.length && data[index].hoursElapsed*60 < minute) {
      index++
    }
    if (index === 0) {
      return multiplier * data[0].price/60/1000000
    } 
    if (index === data.length) {
      return multiplier * data[data.length - 1].price/60/1000000
    }
    // note - price is price per megawatt hour. washPower and dryPower are in watts
    // the interval of time here is a minute
    return multiplier * (data[index - 1].price + 
      (data[index].price - data[index - 1].price) * 
      (minute - (data[index - 1].hoursElapsed*60)) / 
      ((data[index].hoursElapsed*60) - (data[index - 1].hoursElapsed*60)))
      / 60 / 1000000    
  }

  // units: MW
  function renewablesAtMinute(minute, day) {
    let data = day === 0 ? props.renewPoints : props.nextRenewPoints
    if (data.length === 0) return NaN
    // naive approach
    let index = 0;
    while (index < data.length && data[index].hour*60 < minute) {
      index++
    }
    if (index === 0) {
      return data[0].combined
    } 
    if (index === data.length) {
      return data[data.length - 1].combined
    }
    return data[index - 1].combined + 
      (data[index].combined - data[index - 1].combined) * 
      (minute - (data[index - 1].hour*60)) / 
      ((data[index].hour*60) - (data[index - 1].hour*60))
  }

  // Scheduling algorithm. Each argument corresponds to a button row
  function selectTimes(optimizeVal, daysIncluded) {
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
    availability = availability.filter(e => e[1] >= props.washTime + props.dryTime)

    const maxRenewables = Math.max(...[...props.renewPoints.map(e => e.combined), ...props.nextRenewPoints.map(e => e.combined)])

    const optimizeFunc = (totalPrice, totalRenew) => {
      return optimizeVal === "price" ? totalPrice
           : optimizeVal === "renewables" ? maxRenewables - (totalRenew / (props.washTime + props.dryTime))
           : optimizeVal === "both" ? (maxRenewables - (totalRenew / (props.washTime + props.dryTime))) * totalPrice // maybe try an average instead
           : 0
    }

    let rankings = [];
    for (let timeIndex = 0; timeIndex < availability.length; timeIndex++) {
      // algorithm for finding the first time price
      let interval = availability[timeIndex]
      let startTime = interval[0];
      let intervalLength = interval[1]; 
      let day = interval[2]
      let totalRenew = 0
      let totalPrice = 0;

      for (let i = 0; i < props.washTime; i++) {
        totalPrice += priceForMinute(startTime + i, props.washPower);
        totalRenew += renewablesAtMinute(startTime + i, day)
      }
      for (let i = 0; i < props.dryTime; i++) {
        totalPrice += priceForMinute(startTime + props.washTime + i, props.dryPower);
        totalRenew += renewablesAtMinute(startTime + i, day)
      }
      let lastPrice = totalPrice; 
      let minPrice = totalPrice
      let bestTime = startTime;
      let lastRenew = totalRenew;
      let minVal = optimizeFunc(lastPrice, lastRenew)

      // algorithm for finding the best time's price (based on sliding window)
      let optimizations = 0;
      for (let i = 1; i < intervalLength - props.washTime - props.dryTime; i++) {
        totalPrice = lastPrice + 
          priceForMinute(startTime + props.washTime + props.dryTime + i, props.dryPower) 
          - priceForMinute(startTime + i - 1, props.washPower)
          + priceForMinute(startTime + props.washTime + i, props.washPower - props.dryPower)
        totalRenew = lastRenew +
          renewablesAtMinute(startTime + props.washTime + props.dryTime + i, day) 
          - renewablesAtMinute(startTime + i - 1, day)
        let val = optimizeFunc(totalPrice, totalRenew)
        if (val < minVal) {
          minPrice = totalPrice;
          minVal = val
          bestTime = startTime + i;
          optimizations++;
        }
        lastPrice = totalPrice;
        lastRenew = totalRenew
      }
      rankings.push({day: interval[2], startTime: bestTime, price: minPrice, val: minVal})
    }
    rankings.sort((a, b) => a.val - b.val)
    props.setSelectIndex(-1)
    props.setTimeList(rankings)
  }

  useEffect(() => {
    const time = new Date();
    props.setNowInterval(
      Math.floor((time.getHours() * 60 + time.getMinutes()) / 30)
    );
  }, []);

  function postNotification() {
    if (props.selectIndex >= 0) {
      const time = new Date()
      const entry = props.timeList[props.selectIndex]
      const fire = new Date(time.getFullYear(), time.getMonth(), 
      entry.day + time.getDate(), entry.startTime)
      Notifications.postLocalNotification({
        body: 'Time to start laundry!',
        title: 'Launder',
        sound: 'chime.aiff',
        silent: 'false',
        category: "SOME_CATEGORY",
        userInfo: { },
        fireDate: fire.toISOString()// only iOS
      }, 0);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.backButtonText}>Schedule</Text>
      </View>

      <ButtonRow
        text="Days included:"
        options={["today", "tomorrow", "both"]}
        stateVar={props.daysIncluded}
        callback={props.setDaysIncluded}
      />
      <ButtonRow
        style={{
          fontFamily: "nunito-regular",
        }}
        text="Optimize for:"
        options={["price", "renewables", "both"]}
        stateVar={props.optimizeVal}
        callback={props.setOptimizeVal}
      />

      <TouchableOpacity
        onPress={() => selectTimes(props.optimizeVal, props.daysIncluded)}
        style={[styles.buttonRowButton, {backgroundColor: "green", marginBottom: 5}]}
      >
        <Text style={[styles.buttonRowButtonText, {color: "white"}]}>Select Times</Text>
      </TouchableOpacity>
      <View style={styles.schedule}>
        <View style={styles.column}>
          <Text style={styles.washDryText}>Wash</Text>
          <View style={styles.twoRectWrapper}>
            <View style={styles.rectWrapper}>
              <Text style={styles.startEnd}>Start</Text>
              <View style={[styles.rectangle, { borderRightWidth: 1 }]}>
                {props.timeList &&
                  props.timeList.map((e, i) => (
                    <Text key={i}
                      style={[styles.rowEntry,
                        {backgroundColor: props.selectIndex === i ? "orange" : "#B1C6E1"}
                      ]}
                      onPress={() => props.setSelectIndex(i)}
                    >
                      {displayTime(e, e.startTime)}
                    </Text>
                  ))}
              </View>
            </View>
            <View style={styles.rectWrapper}>
              <Text style={styles.startEnd}>End</Text>
              <View style={styles.rectangle}>
                {props.timeList &&
                  props.timeList.map((e, i) => (
                    <Text key={i}
                      style={[styles.rowEntry,
                        {backgroundColor: props.selectIndex === i ? "orange" : "#B1C6E1"}
                      ]}
                      onPress={() => props.setSelectIndex(i)}
                    >
                      {displayTime(e, e.startTime + props.washTime)}
                    </Text>
                  ))}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.washDryText}>Dry</Text>
          <View style={styles.twoRectWrapper}>
            <View style={styles.rectWrapper}>
              <Text style={styles.startEnd}>End</Text>
              <View style={[styles.rectangle, { borderRightWidth: 1 }]}>
                {props.timeList &&
                  props.timeList.map((e, i) => (
                    <Text key={i}
                      style={[styles.rowEntry,
                        {backgroundColor: props.selectIndex === i ? "orange" : "#B1C6E1"}
                      ]}
                      onPress={() => props.setSelectIndex(i)}
                    >
                      {displayTime(e, e.startTime + props.washTime + props.dryTime)}
                    </Text>
                  ))}
              </View>
            </View>
            <View style={styles.rectWrapper}>
              <Text style={styles.startEnd}>Price</Text>
              <View style={styles.rectangle}>
                {props.timeList &&
                  props.timeList.map((e, i) => (
                    <Text key={i}
                      style={[styles.rowEntry,
                        {backgroundColor: props.selectIndex === i ? "orange" : "#B1C6E1"}
                      ]}
                      onPress={() => props.setSelectIndex(i)}
                    >
                      {Math.round(e.price * 1000) / 10} cents
                    </Text>
                  ))}
              </View>
            </View>
          </View>
        </View>
      </View>
      <Pressable
        style={[styles.remindButton, styles.bottomButton]}
        onPress={() => postNotification()}
      >
        <Text style={styles.bottomButtonText}>Remind Me</Text>
      </Pressable>
      <Pressable
        style={[styles.energyDataButton, styles.bottomButton]}
        onPress={() => props.setPage("graph")}
      >
        <Text style={[styles.bottomButtonText, {color: "white"}]}>Energy Data</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  schedule: {
    flexDirection: "column",
    width: "100%",
    marginTop: 30,
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
    flex: 0.5,
    alignItems: "center",
  },
  twoRectWrapper: {
    flexDirection: "row",
    width: "95%",
    alignItems: "center",
    marginTop: 15,
  },
  rectWrapper: {
    width: "50%",
    alignItems: "center",
  },
  rectangle: {
    backgroundColor: "#B1C6E1",
    height: 228,
    width: "100%",
  },
  washDryText: {
    fontSize: 40,
    fontFamily: "Nunito-SemiBold",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 5
  },
  buttons: {
    flexDirection: "column",
  },
  backButtonRow: {
    flexDirection: "row", 
    alignItems: "center", 
    width: "100%", 
    marginBottom: 15
  },
  backButton: {
    left: 15,
    marginRight: "auto"
  },
  backButtonText: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 48,
    marginRight: "23%",
  },
  bottomButton: {
    width: 250,
    height: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomButtonText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 24,
  },
  remindButton: {
    backgroundColor: "#B1C6E1",
    marginTop: 35,
  },
  energyDataButton: {
    backgroundColor: "#31864B",
    marginTop: 25,
  },
  buttonRowButton: {
    borderRadius: 50, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
  },
  buttonRowButtonText: {
    fontSize: 16, 
    fontFamily: "Nunito-Regular", 
  },
  startEnd: {
    fontSize: 20,
    fontFamily: "nunito-regular",
  },
  rowEntry: {
    fontFamily: "nunito-regular",
    fontSize: 13,
    paddingHorizontal: 1
  }
});