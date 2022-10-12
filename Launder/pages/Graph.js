import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
const customData = require('../sample-data.json');

export default function Graph(props) {
  return (
    <View style={styles.container}>
      <Text>graph graph graph</Text>
      <Button
        onPress={props.goHome}
        title="Go home"
        color="#841584"
      />
      <Text>{customData.lastUpdated}</Text>
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
