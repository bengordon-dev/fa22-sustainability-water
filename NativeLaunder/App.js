import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useState, useEffect } from "react";
import Graph from "./pages/Graph";
import OpenScreen from "./pages/openScreen";
import Schedule from "./pages/Schedule";
import MyInfo from "./pages/myInfo";
import {Notifications} from 'react-native-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [page, setPage] = useState("home");
  const [availability, setAvailability] = useState([]); // current day
  const [nextAvailability, setNextAvailability] = useState([]); // next day
  const [washTime, setWashTime] = useState(30);
  const [dryTime, setDryTime] = useState(60);
  const [washPower, setWashPower] = useState(850);
  const [dryPower, setDryPower] = useState(4000);
  const [points, setPoints] = useState([]);
  const [renewPoints, setRenewPoints] = useState([]); // current day
  const [nextRenewPoints, setNextRenewPoints] = useState([]); // next day
  const [day, setDay] = useState("currentDay"); // damSppData or rtSppData
  const [timeList, setTimeList] = useState([])
  const [selectIndex, setSelectIndex] = useState(-1)
  const region = "lzLcra";
  // floor(minutes since midnight / 30). Updated whenever switching between pages/components.
  const [nowInterval, setNowInterval] = useState(0);


  useEffect( () => {
    Notifications.registerRemoteNotifications();
    const time = new Date();
    setNowInterval(Math.floor((time.getHours() * 60 + time.getMinutes()) / 30));
    fetch(`http://127.0.0.1:5000/getSystemWidePrices/${region}`)
      .then((res) => res.json())
      .then((res) => {
        setPoints(res.points);
      });
    fetch("http://127.0.0.1:5000/getCombinedWindandSolar")
      .then((res) => res.json())
      .then((res) => {
        res.today && setRenewPoints(res.today)
        res.tomorrow && setNextRenewPoints(res.tomorrow)
      })
    async function loadInValues() {
      try {
        const storedDryPower = await AsyncStorage.getItem('@dryerPower')
        const storedWashPower = await AsyncStorage.getItem('@washerPower')
        const storedDryTime = await AsyncStorage.getItem('@dryerTime')
        const storedWashTime = await AsyncStorage.getItem('@washerTime')
        storedDryPower && setDryPower(parseInt(storedDryPower))
        storedWashPower && setWashPower(parseInt(storedWashPower))
        storedDryTime && setDryTime(parseInt(storedDryTime))
        storedWashTime && setWashTime(parseInt(storedWashTime))
      } catch(e) {
        // read error
      }
    }
    loadInValues()
  }, []);

  // filter out obsolete intervals from the past 
  useEffect(() => {
    setAvailability([...availability
                      .filter(e => e[0] + e[1] > nowInterval)
                      .map(e => {
                        const newStart = Math.max(e[0], nowInterval*30)
                        return [newStart, e[0] + e[1] - newStart]
                      })
                    ])
  }, [nowInterval])
  return page === "graph" ? (
    <Graph
      availability={day === "currentDay" ? availability : nextAvailability}
      setPage={setPage}
      points={points.filter(
        (e) =>
          Math.floor(e.hoursElapsed * 2) >=
          (day === "currentDay" ? nowInterval : 0)
      )}
      renewPoints={
        day === "currentDay"
          ? renewPoints.filter((e) => Math.floor(e.hour * 2) >= nowInterval)
          : nextRenewPoints
      }
      day={day}
      setDay={setDay}
      nowInterval={day === "currentDay" ? nowInterval : 0}
      setNowInterval={setNowInterval}
      chosenTime={selectIndex >= 0 ? {...timeList[selectIndex], width: dryTime + washTime} : null}
    />
  ) : page === "schedule" ? (
    <Schedule
      setPage={setPage}
      points={points}
      renewPoints={renewPoints.filter(
        (e) => Math.floor(e.hour * 2) >= nowInterval
      )}
      nextRenewPoints={nextRenewPoints}
      day={day}
      setDay={setDay}
      nowInterval={nowInterval}
      setNowInterval={setNowInterval}
      washTime={washTime}
      washPower={washPower}
      dryTime={dryTime}
      dryPower={dryPower}
      todayAvailability={availability}
      tomorrowAvailability={nextAvailability}
      timeList={timeList}
      setTimeList={setTimeList}
      selectIndex={selectIndex}
      setSelectIndex={setSelectIndex}
      
    />
  ) : page === "myinfo" ? (
    <MyInfo
      goHome={() => setPage("home")}
      freeIntervals={day === "currentDay" ? availability : nextAvailability}
      setFreeIntervals={
        day === "currentDay" ? setAvailability : setNextAvailability
      }
      washTime={washTime}
      washPower={washPower}
      dryTime={dryTime}
      dryPower={dryPower}
      setWashTime={setWashTime}
      setWashPower={setWashPower}
      setDryTime={setDryTime}
      setDryPower={setDryPower}
      nowInterval={day === "currentDay" ? nowInterval : 0}
      setNowInterval={setNowInterval}
      day={day}
      setDay={setDay}
    />
  ) : (
    <OpenScreen setPage={setPage} setNowInterval={setNowInterval} />
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
