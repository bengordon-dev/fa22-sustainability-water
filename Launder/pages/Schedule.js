import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
const customData = require('../sample-data.json');

export default function Schedule(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Schedule</Text>
            <View style = {styles.schedule}>
                <View style = {styles.washDryAlign}>
                    <Text style = {styles.washDryText}>Wash</Text>
                    <Text style = {styles.washDryText}>Dry</Text>
                </View>
            </View>
            <View style = {styles.buttons}>
                <View style = {styles.buttonOne}>
                    <Button onPress={props.goHome} title="Go home" />
                    <Button title = "Remind me" />
                </View>
                <View>
                    <Button title = "Energy data" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
        marginTop:20,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        fontSize: 32,
    },
    schedule: {
        flex: 3,
        flexDirection: 'column',
    },
    washDryAlign: {
        justifyContent: 'space-between', // fix this
        flexDirection: 'row',
    },
    washDryText: {
        fontSize: 32,
    },
    buttons: {
        flexDirection: 'column',
    },
    buttonOne: {
        flexDirection: 'row',
    },
});
