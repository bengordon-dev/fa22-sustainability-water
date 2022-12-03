import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import {Notifications} from 'react-native-notifications';



function ButtonRow(props) {
  return <View style={styles.buttonRow}>
    <Text style={{ fontSize: 16, marginRight: 5, marginLeft: 20 }}>
      {props.text}
    </Text>
    {props.options && props.options.map((option, i) => 
      <View key={i} style={{backgroundColor: props.stateVar === option ? "green" : "white"}}>
        <Button
          onPress={() => props.callback(option)}
          title={option.charAt(0).toUpperCase() + option.slice(1)}
          color={props.stateVar === option ? "white" : "blue"}
        />
      </View>
    )}
  </View>
}


export default function Schedule(props) {
  const [daysIncluded, setDaysIncluded] = useState("today") // "today", "tomorrow", or "both"
  const [optimizeVal, setOptimizeVal] = useState("both") // "price", "renewables", or "both"
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
    let curTime = data[0].hoursElapsed*60;
    let index = 0;
    while (index < data.length && curTime < minute) {
      curTime = data[index].hoursElapsed*60;
      index++
    }
    if (index === 0) {
      return multiplier * data[0].price/60/1000000
    } 
    if (index === data.length) {
      return multiplier * data[data.length - 1].price/60/1000000
    }
    return multiplier * (data[index - 1].price + 
      (data[index].price - data[index - 1].price) * 
      (minute - (data[index - 1].hoursElapsed*60)) / 
      ((data[index].hoursElapsed*60) - (data[index - 1].hoursElapsed*60)))
      / 60 / 1000000    
  }

  function renewablesAtMinute(minute, day) {
    let data = day === 0 ? props.renewPoints : props.nextRenewPoints
    if (data.length === 0) return NaN
    // naive approach
    let curTime = data[0].hour*60;
    let index = 0;
    while (index < data.length && curTime < minute) {
      curTime = data[index].hour*60;
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

  // "renewables", "price", "both"
  function selectTimes(optimizeVal) {
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
      //let minPrice = Number.MAX_SAFE_INTEGER
      //let bestTime = 0;
      // algorithm for finding the first time price
      let interval = availability[timeIndex]
      let startTime = interval[0];
      let intervalLength = interval[1]; 
      let day = interval[2]
      let totalRenew = 0
      let totalPrice = 0;

      // note - price is price per megawatt hour. washPower and dryPower are in watts, and the time interval of each minute is obviously a minute

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
      let minRenew = totalRenew;
      let minVal = optimizeFunc(lastPrice, lastRenew)

      // algorithm for finding the next time's price (based on sliding window)
      let optimizations = 0;
      for (let i = 1; i < intervalLength - props.washTime - props.dryTime; i++) {
        totalPrice = lastPrice + 
          priceForMinute(startTime + props.washTime + props.dryTime + i, props.dryPower) 
          - priceForMinute(startTime + i - 1, props.washPower)
          + priceForMinute(startTime + props.washTime + i, props.washPower - props.dryPower)
        totalRenew = lastRenew +
          renewablesAtMinute(startTime + props.washTime + props.dryTime + i, day) 
          - renewablesAtMinute(startTime + i - 1, day)
          //+ optimizeFunc(startTime + props.washTime + i, props.washPower - props.dryPower, day)
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
      entry.day, entry.startTime)
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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.5}
        onPress={() => props.setPage("home")}
      >
        <Image
          source={require("../assets/schedulePage_return.jpg")}
          //style={styles.buttonImageIconStyle}
        />
      </TouchableOpacity>
      <Text style={styles.title}> </Text>
      <ButtonRow 
        text="Days included:" 
        options={["today", "tomorrow", "both"]}
        stateVar={daysIncluded}
        callback={setDaysIncluded}
      />
      <ButtonRow 
        text="Optimize for:" 
        options={["price", "renewables", "both"]}
        stateVar={optimizeVal}
        callback={setOptimizeVal}
      />
      
      <Button onPress={() => selectTimes(optimizeVal)} title="Pick Times" />
      <View style={styles.schedule}>
        <View style={styles.column}>
          <Text style={styles.washDryText}>Wash</Text>
          <View style={styles.twoRectWrapper}>
            <View style={styles.rectWrapper}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>Start</Text>
              <View style={[styles.rectangle, { borderRightWidth: 1 }]}>
                {props.timeList && props.timeList.map((e, i) => <Text key={i} 
                  style={{backgroundColor: props.selectIndex === i ? "orange" : "#B1C6E1"}} 
                  onPress={() => props.setSelectIndex(i)}>
                  {displayTime(e, e.startTime)}
                </Text>)}
              </View>
            </View>
            <View style={styles.rectWrapper}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>End</Text>
              <View style={styles.rectangle}>
              {props.timeList && props.timeList.map((e, i) => <Text key={i} 
                  style={{backgroundColor: props.selectIndex === i ? "orange" : "#B1C6E1"}} 
                  onPress={() => props.setSelectIndex(i)}>
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
              {props.timeList && props.timeList.map((e, i) => <Text key={i} 
                  style={{backgroundColor: props.selectIndex === i ? "orange" : "#B1C6E1"}} 
                  onPress={() => props.setSelectIndex(i)}>
                {displayTime(e, e.startTime + props.washTime + props.dryTime)}
              </Text>)}
              </View>
            </View>
            <View style={styles.rectWrapper}>
              <Text style={{ marginRight: 10, fontSize: 20 }}>Price</Text>
              <View style={styles.rectangle}>
                {props.timeList && props.timeList.map((e, i) => <Text key={i} 
                  style={{backgroundColor: props.selectIndex === i ? "orange" : "#B1C6E1"}} 
                  onPress={() => props.setSelectIndex(i)}>
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
          <Button onPress={() => postNotification() }title="Remind me" />
        </View>
        <View>
          <Button onPress={() => props.setPage("graph")} title="Energy data" />
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
    justifyContent: "flex-start",
  },
  title: {
    // flex: 1,
    fontSize: 64,
  },
  schedule: {
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
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
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
