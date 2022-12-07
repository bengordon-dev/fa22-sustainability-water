import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from "react-native";
import { useState, useEffect } from "react";

export default function AvailabilitySelector(props) {
  const [selectedSectors, setSelectedSectors] = useState([])

  useEffect(() => {
    let newSectors = []
    props.freeIntervals && props.freeIntervals.forEach((interval) => {
      const firstSector = interval[0]/30
      const numSectors = interval[1]/30
      for (let i = firstSector; i < firstSector + numSectors; i++) {
        newSectors.push(i)
      }
    })
    props.freeIntervals && setSelectedSectors(newSectors)
  }, [props.freeIntervals])

  function pressSector(index) {

    const startTime = index*30
    const endTime = startTime + 30

    if (selectedSectors.includes(index)) { // deselect
      // find what interval we're in 
      let intervalIndex = -1
      for (let i = 0; intervalIndex < 0 && i < props.freeIntervals.length; i++) {
        const interval = props.freeIntervals[i]
        if (interval[0] <= startTime && endTime <= interval[0] + interval[1]) {
          intervalIndex = i
        }
      }
      let newInterval = [...props.freeIntervals[intervalIndex]]   
      // deleting an interval entirely (nothing before, nothing after)
      if (startTime === newInterval[0] && endTime === newInterval[0] + newInterval[1]) {
        props.setFreeIntervals([...props.freeIntervals.slice(0, intervalIndex), ...props.freeIntervals.slice(intervalIndex + 1)])
      }
      // chopping off the front of an interval (something after)
      else if (startTime === newInterval[0] ) {
        newInterval[0] += 30
        newInterval[1] -= 30
        props.setFreeIntervals([...props.freeIntervals.slice(0, intervalIndex), newInterval, ...props.freeIntervals.slice(intervalIndex + 1)])
      } 
      // chopping off the end of an interval (something before)
      else if (endTime === newInterval[0] + newInterval[1]) {
        newInterval[1] -= 30
        props.setFreeIntervals([...props.freeIntervals.slice(0, intervalIndex), newInterval, ...props.freeIntervals.slice(intervalIndex + 1)])
      }
      // splitting an interval in 2
      else {
        const oldEnd = newInterval[0] + newInterval[1]
        newInterval[1] = startTime - newInterval[0]
        let otherInterval = [endTime, oldEnd - endTime]
        props.setFreeIntervals([...props.freeIntervals.slice(0, intervalIndex), newInterval, otherInterval, ...props.freeIntervals.slice(intervalIndex + 1)])
      }

    } else { 
      let beforeIndex = -1
      let afterIndex = -1
      for (let i = 0; beforeIndex < 0 && i < props.freeIntervals.length; i++) {
        const interval = props.freeIntervals[i]
        if (interval[0] <= startTime - 30 && endTime - 30 <= interval[0] + interval[1]) {
          beforeIndex = i
        }
      }
      for (let i = 0; afterIndex < 0 && i < props.freeIntervals.length; i++) {
        const interval = props.freeIntervals[i]
        if (interval[0] <= startTime + 30 && endTime + 30 <= interval[0] + interval[1]) {
          afterIndex = i
        }
      }
      // making a new interval (nothing before, nothing after)
      if (beforeIndex == -1 && afterIndex == -1) {
        let newInterval = [startTime, 30]
        let insertIndex = 0;
        for (; insertIndex < props.freeIntervals.length; insertIndex++) {
          if (props.freeIntervals[insertIndex][0] > startTime) {
            break;
          }
        }
        props.setFreeIntervals([...props.freeIntervals.slice(0, insertIndex), newInterval, ...props.freeIntervals.slice(insertIndex)])
      }
      // adding to the end of an interval (something before)
      else if (afterIndex == -1) {
        let interval = [...props.freeIntervals[beforeIndex]]
        interval[1] += 30
        props.setFreeIntervals([...props.freeIntervals.slice(0, beforeIndex), interval, ...props.freeIntervals.slice(beforeIndex + 1)])
      }
      // adding to the front of an interval (something after)
      else if (beforeIndex == -1) {
        let interval = [...props.freeIntervals[afterIndex]]
        interval[0] -= 30
        interval[1] += 30
        props.setFreeIntervals([...props.freeIntervals.slice(0, afterIndex), interval, ...props.freeIntervals.slice(afterIndex + 1)])
      }
      // combining 2 intervals (something before and something after)
      else {
        let firstInterval = [...props.freeIntervals[beforeIndex]]
        firstInterval[1] += props.freeIntervals[afterIndex][1] + 30
        props.setFreeIntervals([...props.freeIntervals.slice(0, beforeIndex), firstInterval, ...props.freeIntervals.slice(afterIndex + 1)])
      }
    }
  }

  return (
    <View>
      <TouchableOpacity
        title={props.day === "currentDay" ? "Current Day" : "Next Day"}
        onPress={() => props.setDay(props.day == "currentDay" ? "nextDay" : "currentDay")}
        style={{alignItems: "center", justifyContent: "center"}}
      >
        <Text style={styles.daySelector}>{props.day === "currentDay" ? "Current Day" : "Next Day"}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        {[...Array(24*2 - props.nowInterval).keys()].map((e, i) => {
          const time = new Date()
          let hours = (Math.floor((e + props.nowInterval)*30 / 60)) % 24
          const minutes = (e + props.nowInterval)*30 % 60
          let secondHrs = (hours + (minutes + 30 >= 60 ? 1 : 0)) % 24
          const firstHalf = hours < 12 ? "AM" : "PM"
          const secondHalf = secondHrs < 12 ? "AM" : "PM"
          secondHrs = (secondHrs % 12 === 0 ? 12 : secondHrs % 12)
          hours = (hours % 12 === 0 ? 12 : hours % 12)
          const secondMins = (minutes + 30) % 60

          timeString = `${hours}:${minutes < 10 ?  "0" : ""}${minutes}${firstHalf !== secondHalf ? " " + firstHalf.toString() : ""} - ${secondHrs}:${secondMins < 10 ?  "0" : ""}${secondMins} ${secondHalf}`
          return (
          <View style={{width: "100%", flexDirection: "row"}} key={i}>
            <Text style={{width: "42%", fontFamily: "nunito-regular", paddingLeft: 4}}>{timeString}</Text>
            <TouchableOpacity 
              style={{width: "80%", height: 20, backgroundColor: selectedSectors.includes(e + props.nowInterval) ? "#9f9" : "#999"}} 
              onPress={() => pressSector(e + props.nowInterval)
            }/>
          </View>
          )
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    backgroundColor: "#eee",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  daySelector: {
    color: "#007AFF", 
    fontSize: 20, 
    fontFamily: "nunito-semibold",
    marginBottom: 5
  }
});
