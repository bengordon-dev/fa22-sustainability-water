import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
const customData = require('../sample-data.json');

export default function Schedule(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Schedule</Text>
            <View style = {styles.schedule}>
                <View style = {styles.washDryAlign}>
                    <View style = {styles.wash}> 
                        <Text style = {styles.washDryText}>Wash</Text>
                        <View style = {styles.blueBlockHeader}>
                            <Text style = {{marginRight: 10, fontSize: 20}}>Start</Text>
                            <Text style = {{marginRight: 10, fontSize: 20}}>End</Text>
                        </View>
                        <View style = {{flexDirection: 'row', width: "65%", alignItems: 'center'}}>
                            <View style = {[styles.rectangle, {borderRightWidth: 1}]}></View>
                            <View style = {styles.rectangle}></View>
                        </View>
                    </View>
                    <View style = {styles.dry}>
                        <Text style = {styles.washDryText}>Dry</Text>
                        <View style = {styles.blueBlockHeader}>
                            <Text style = {{marginRight: 10, fontSize: 20}}>Start</Text>
                            <Text style = {{marginRight: 10, fontSize: 20}}>End</Text>
                        </View>
                        <View style = {{flexDirection: 'row', width: "65%", alignItems: 'center'}}>
                        <View style = {[styles.rectangle, {borderRightWidth: 1}]}></View>
                            <View style = {styles.rectangle}></View>
                        </View>
                    </View>
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
        marginTop: 70,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        // flex: 1,
        fontSize: 64,
    },
    schedule: {
        flex: 3,
        flexDirection: 'column',
        // justifyContent: 'space-between',
    },
    washDryAlign: {
        marginTop: 60,
        // justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
        width: "100%",
    },
    wash: {
        flexDirection: 'column',
        flex: 0.5,
        alignItems: 'center',
    },
    dry: {
        flexDirection: 'column',
        flex: 0.5,
        alignItems: 'center',

    },
    blueBlockHeader: {
        flexDirection: 'row',
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    rectangle: {
        backgroundColor: "#B1C6E1",
        height: 228,
        width: "50%",
    },
    washDryText: {
        fontSize: 40,
    },
    buttons: {
        flexDirection: 'column',
    },
    buttonOne: {
        flexDirection: 'row',
    },
});
