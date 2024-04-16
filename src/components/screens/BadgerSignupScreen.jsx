import { Alert, Button, StyleSheet, Text, View } from "react-native";

function BadgerSignupScreen(props) {

    //NOTE: props.handleGuestSignup doesnt work unless you put it in onPress becuase when we made it
    // we didnt make it as a varible containing the function of the code, it was simply a function
    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Want to create your own posts?</Text>
        <Text>Sign up. Its free!</Text>
        <Text/>
        <Button title="Sign up" color="darkred" onPress={props.handleGuestSignup}/>

    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: "50%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default BadgerSignupScreen;