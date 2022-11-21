import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useState, useEffect } from "react";
import Graph from "./pages/Graph";
import OpenScreen from "./pages/openScreen";
import Schedule from "./pages/Schedule";
import MyInfo from "./pages/myInfo";

export default function App() {
  const [page, setPage] = useState("home");
  const [availability, setAvailability] = useState([
    [480, 180],
    [780, 120],
  ]);
  const [washTime, setWashTime] = useState(0);
  const [dryTime, setDryTime] = useState(0);
  const [graphData, setGraphData] = useState({});
  const [renewData, setRenewData] = useState({});
  const [points, setPoints] = useState([]);
  const [renewPoints, setRenewPoints] = useState([]);
  const [day, setDay] = useState("currentDay"); // damSppData or rtSppData
  const [region, setRegion] = useState("lzLcra");

  // floor(minutes since midnight / 30). Updated whenever switching between pages/components.
  const [nowInterval, setNowInterval] = useState(0) 

  useEffect(() => {
    if (renewData[day]) {
      let newRenewData = [];
      if (day === "currentDay") {
        for (const hrEntry of Object.entries(renewData[day].data)) {
          const hourEntry = hrEntry[1]
          let entry = {hour: hourEntry.hourEnding}
          if (hourEntry.actualWind && hourEntry.actualSolar) {
            entry.combined = hourEntry.actualWind + hourEntry.actualSolar;
          } else {
            entry.combined = hourEntry.copHslWind + hourEntry.copHslSolar;
          }
          newRenewData.push(entry);
        }
      } else {
        for (const hrEntry of Object.entries(renewData[day].data)) {
          const hourEntry = hrEntry[1]
          let entry = {hour: hourEntry.hourEnding}
          entry.combined = hourEntry.copHslSolar + hourEntry.copHslWind
          newRenewData.push(entry)
        }  
      }
      //console.log(newRenewData)
      setRenewPoints(newRenewData)
    } 
  }, [renewData, day])


  useEffect(() => {
    //console.log(props.availability)
    const time = new Date()
    setNowInterval(Math.floor((time.getHours()*60 + time.getMinutes()) / 30))
    fetch("http://127.0.0.1:5000/getSystemWidePrices")
      .then((res) => res.json())
      .then((res) => {
        setGraphData(res);
      });
    fetch("http://127.0.0.1:5000/getCombinedWindandSolar")
      .then((res) => res.json())
      .then((res) => setRenewData(res));
  }, []);

  useEffect(() => {
    if (graphData.rtSppData && graphData.damSppData) {
      let newRTPoints = [...graphData.rtSppData.map(e => {
        const now = new Date(e.interval)
        const hoursElapsed = (e.interval - (e.interval - 1000*(now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds() ))) / 3600000 
        return ({
          hoursElapsed: hoursElapsed,
          price: e[region]
        })}
      )]
      let maxTimeStamp = Math.max(...newRTPoints.map(e => e.hoursElapsed))
      let newDAMPoints = [...graphData.damSppData.map(e => {
        const now = new Date(e.interval)
        const hoursElapsed = (e.interval - (e.interval - 1000*(now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds() ))) / 3600000 
        return ({
          hoursElapsed: hoursElapsed,
          price: e[region]
        })}
      ).filter(e => e.hoursElapsed > maxTimeStamp)
      ]
      setPoints([...newRTPoints, ...newDAMPoints])
    }
  }, [graphData]);


  useEffect(() => {
    console.log(availability)
  }, [availability])

  return page === "graph" ? (
    <Graph availability={availability} setPage={setPage}
      points={points.filter(e => Math.floor(e.hoursElapsed*2) >= (day === "currentDay" ? nowInterval : 0))} 
      renewPoints={renewPoints.filter(e => Math.floor(e.hour*2) >= (day === "currentDay" ? nowInterval : 0))} 
      day={day} setDay={setDay}
      nowInterval={day === "currentDay" ? nowInterval : 0}
      setNowInterval={setNowInterval}
    />
  ) : page === "schedule" ? (
    <Schedule goHome={() => setPage("home")} />
  ) : page === "myinfo" ? (
    <MyInfo
      goHome={() => setPage("home")}
      freeIntervals={availability}
      setFreeIntervals={setAvailability}
      washTime={washTime}
      dryTime={dryTime}
      setWashTime={setWashTime}
      setDryTime={setDryTime}
      nowInterval={nowInterval}
      setNowInterval={setNowInterval}
    />
  ) : (
    <OpenScreen setPage={setPage} />
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
