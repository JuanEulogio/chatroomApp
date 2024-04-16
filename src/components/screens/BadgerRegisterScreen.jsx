import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";

import { useRef, useState } from "react";

function BadgerRegisterScreen(props) {

    const username = useRef(null)
    const password = useRef(null)
    const passwordConfirm = useRef(null)

    const [error, setError] = useState(null)

    const validateSignUp= () => {
        let isTextIntputFilled= (username.current !== "") && (password.current !== "") && (passwordConfirm.current !== "")
        let isUseRefValValid=  username.current && password.current && passwordConfirm.current
        let isPasswordConfirmed= (passwordConfirm.current=== password.current)

        if(isTextIntputFilled && isUseRefValValid && isPasswordConfirmed){

            let apiRequestFeedback= props.handleSignup( username.current, password.current)
            //api check. If we get undefined, username was taken
            if(! apiRequestFeedback){
                setError("That username has already been taken!")
            }

        }else if(!isPasswordConfirmed){
            setError("Passwords dont match")
        }else{
            setError("Please enter a valid Username and Password")
        }
    }

    return <View style={styles.container}>
        <Text style={styles.title}>Join BadgerChat!</Text>

        <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 40}}>
            <TextInput 
                style={styles.textInput}
                placeholder="Email"
                title="Email"
                autoCapitalize="none"
                onChangeText={(text) => username.current = text}
            />
            <TextInput
                style={styles.textInput}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize="none"
                autoComplete="off"
                onChangeText={(text) => password.current = text}
            />
            <TextInput
                style={styles.textInput}
                secureTextEntry={true}
                placeholder="Confirm Password"
                onChangeText={(text) => passwordConfirm.current = text}
            />
        </View>

        {error && 
            <Text style={{color: "red"}}>{error}</Text>
        }

        <View style={styles.signUpAndNevermindButtonContainer}>
            <View style={{...styles.buttonContainer}}><Button  color="white" title="Signup" onPress={validateSignUp} /></View>
            <View style={{...styles.buttonContainer}}><Button color="white" title="Nevermind!" onPress={() => props.setIsRegistering(false)} /></View>
        </View>

    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        paddingVertical: 100
    },
    textInput: {
        fontSize: 20,
        paddingVertical: 12,
        alignItems: 'center',
        width: "100%",
    },
    signUpAndNevermindButtonContainer: {
        flexDirection: 'row',
    },
    buttonContainer: {
        borderRadius: 14,
        margin: 4, //NOTE: padding expands our background color. NOTE IN THE CONTAINER
        paddingHorizontal: 4,
        backgroundColor: 'crimson',
        width: "30%"

    },
    text: {
        padding: 8,
        fontSize: 14,
    }
});

export default BadgerRegisterScreen;