import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { useState, useEffect } from "react";
import Graph from "./pages/Graph";
import OpenScreen from "./pages/openScreen";
import Schedule from "./pages/Schedule";

export default function App() {
  const [page, setPage] = useState("home");
  return page === "graph" ? (
    <Graph goHome={() => setPage("home")} />
  ) : page === "schedule" ? (
    <Schedule goHome={() => setPage("home")} />
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
