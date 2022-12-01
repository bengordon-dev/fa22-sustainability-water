import { StatusBar } from "expo-status-bar";
import React from "react";
import * as Font from "expo-font";
import { StyleSheet, Text, View, Button } from "react-native";
import { useState, useEffect } from "react";
import Graph from "./pages/Graph";
import OpenScreen from "./pages/openScreen";
import Schedule from "./pages/Schedule";
import MyInfo from "./pages/myInfo";
import AppLoading from "expo-app-loading";

const getFonts = () =>
  Font.loadAsync({
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "nunito-semibold": require("./assets/fonts/Nunito-SemiBold.ttf"),
  });

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [page, setPage] = useState("home");
  const [availability, setAvailability] = useState([
    [480, 180],
    [780, 120],
  ]); // current day
  const [nextAvailability, setNextAvailability] = useState([]); // next day
  const [washTime, setWashTime] = useState(30);
  const [dryTime, setDryTime] = useState(60);
  const [washPower, setWashPower] = useState(850);
  const [dryPower, setDryPower] = useState(4000);
  const [graphData, setGraphData] = useState({});
  const [renewData, setRenewData] = useState({});
  const [points, setPoints] = useState([]);
  const [renewPoints, setRenewPoints] = useState([]); // current day
  const [nextRenewPoints, setNextRenewPoints] = useState([]); // next day
  const [day, setDay] = useState("currentDay"); // damSppData or rtSppData
  const [region, setRegion] = useState("lzLcra");

  // floor(minutes since midnight / 30). Updated whenever switching between pages/components.
  const [nowInterval, setNowInterval] = useState(0);

  useEffect(() => {
    if (renewData["currentDay"] && renewData["nextDay"]) {
      let newRenewData = [];
      let newNextRenewData = [];
      for (const hrEntry of Object.entries(renewData["currentDay"].data)) {
        const hourEntry = hrEntry[1];
        let entry = { hour: hourEntry.hourEnding };
        if (hourEntry.actualWind && hourEntry.actualSolar) {
          entry.combined = hourEntry.actualWind + hourEntry.actualSolar;
        } else {
          entry.combined = hourEntry.copHslWind + hourEntry.copHslSolar;
        }
        newRenewData.push(entry);
      }
      for (const hrEntry of Object.entries(renewData["nextDay"].data)) {
        const hourEntry = hrEntry[1];
        let entry = { hour: hourEntry.hourEnding };
        entry.combined = hourEntry.copHslSolar + hourEntry.copHslWind;
        newNextRenewData.push(entry);
      }
      //console.log(newRenewData)
      setRenewPoints(newRenewData);
      setNextRenewPoints(newNextRenewData);
    }
  }, [renewData]);

  useEffect(() => {
    //console.log(props.availability)
    const time = new Date();
    setNowInterval(Math.floor((time.getHours() * 60 + time.getMinutes()) / 30));
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
      let newRTPoints = [
        ...graphData.rtSppData.map((e) => {
          const now = new Date(e.interval);
          const hoursElapsed =
            (e.interval -
              (e.interval -
                1000 *
                  (now.getHours() * 3600 +
                    now.getMinutes() * 60 +
                    now.getSeconds()))) /
            3600000;
          return {
            hoursElapsed: hoursElapsed,
            price: e[region],
          };
        }),
      ];
      let maxTimeStamp = Math.max(...newRTPoints.map((e) => e.hoursElapsed));
      let newDAMPoints = [
        ...graphData.damSppData
          .map((e) => {
            const now = new Date(e.interval);
            const hoursElapsed =
              (e.interval -
                (e.interval -
                  1000 *
                    (now.getHours() * 3600 +
                      now.getMinutes() * 60 +
                      now.getSeconds()))) /
              3600000;
            return {
              hoursElapsed: hoursElapsed,
              price: e[region],
            };
          })
          .filter((e) => e.hoursElapsed > maxTimeStamp),
      ];
      setPoints([...newRTPoints, ...newDAMPoints]);
    }
  }, [graphData]);

  if (fontsLoaded) {
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
      />
    ) : page === "schedule" ? (
      <Schedule
        goHome={() => setPage("home")}
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
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={() => console.log("error")}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
