import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState } from "react";
import Graph from './pages/Graph';

export default function App() {
  const [page, setPage] = useState("home")
  return ( page === "graph" ? 
    <Graph goHome={() => setPage("home") }/> : 
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        onPress={() => setPage("graph")}
        title="Go to graph"
        color="#841584"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
