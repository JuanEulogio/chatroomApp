import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useRef, useState } from "react";

function BadgerLoginScreen(props) {

    const username = useRef('')
    const password = useRef('')

    const [error, setError] = useState(null)

    const validateLogin= () => {
        let isTextIntputFilled= (username.current !== "") && (password.current !== "")
        let isUseRefValValid=  username.current && password.current

        if(isTextIntputFilled && isUseRefValValid){
            let apiRequestFeedback= props.handleLogin( username.current, password.current)
            console.log(apiRequestFeedback)
            //api check. If we inputed wrong username and password, we reciever "undefined"
            if(! apiRequestFeedback){
                setError("That username or password is incorrect!")
            }
        }else{
            setError("Please enter a valid Username and Password")
        }
    }


    return <View style={styles.container}>
       <Text style={styles.title}>BadgerChat Login</Text>

       <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 40}}>
            <TextInput 
                style={styles.textInput}
                placeholder="Email"
                title="Email"
                onChangeText={(text) => username.current = text}
                autoCapitalize="none"/>
            <TextInput
                style={styles.textInput}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize="none"
                autoComplete="off"
                onChangeText={(text) => password.current = text}/>
        </View>


        {error && 
            <Text style={{color: "red"}}>{error}</Text>
        }
        <View style={{...styles.buttonContainer, marginTop: 20}}><Button color="white" title="Login" onPress={validateLogin} /></View>


        <Text style={{...styles.text, paddingTop: 100}}>New here?</Text>
        <View style={styles.signUpAndGuestButtonContainer}>
            <View style={{...styles.buttonContainer, backgroundColor: "transparent"}}><Button  color="crimson" title="Signup" onPress={() => props.setIsRegistering(true)} /></View>
            <View style={{...styles.buttonContainer, backgroundColor: "transparent"}}><Button color="crimson" title="Continue as Guest" onPress={() => props.setIsGuest(true)} /></View>
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
        padding: 12,
        height: 40,
        margin: 12,
        marginHorizontal: 20,
    },
    signUpAndGuestButtonContainer: {
        flexDirection: 'row',
    },
    buttonContainer: {
        borderRadius: 14,
        margin: 4, //NOTE: padding expands our background color. NOTE IN THE CONTAINER
        paddingHorizontal: 4,
        backgroundColor: 'crimson',
        width: "50%" //key to align 2 col buttons. tweek with width
    },
    text: {
        padding: 8,
        fontSize: 14,
    }
});

export default BadgerLoginScreen;