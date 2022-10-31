import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function openScreen() {
    return (
      <View style={styles.container}>
        <Text>FirstButton</Text>
        <Button
          onPress={props.goSchedule}
          title="Schedule"
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