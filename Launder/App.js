import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { useState, useEffect } from "react";
import Graph from "./pages/Graph";
import OpenScreen from "./pages/openScreen";
import Schedule from "./pages/Schedule";
import MyInfo from "./pages/myInfo";

export default function App() {
  const [page, setPage] = useState("home");
  const [freeIntervals, setFreeIntervals] = useState([])
  const [availability, setAvailability] = useState([[480, 180], [780, 120]])
  return page === "graph" ? (
    <Graph availability={availability} goHome={() => setPage("home") }/>
  ) : page === "schedule" ? (
    <Schedule goHome={() => setPage("home")} />
  ) : page === "myinfo" ? (
    <MyInfo goHome={() => setPage("home")} freeIntervals={freeIntervals} setFreeIntervals={setFreeIntervals}/>
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
