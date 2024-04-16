import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import { Alert } from 'react-native';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerSignupScreen from './screens/BadgerSignupScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  //NOTE: we set up login in the main page. We keep track if they are logged in 
  //here. Making there be no use of Context
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  //Tells main page if we should display landing, login, or register
  const [isRegistering, setIsRegistering] = useState(false);

  const [isGuest, setIsGuest] = useState(false)

  const [chatrooms, setChatrooms] = useState([]);

  const [username, setUsername] = useState('');



  useEffect(() => {
    fetch(`https://cs571.org/api/s24/hw9/chatrooms` , {
            method: "GET",
            headers: {
                "X-CS571-ID": "bid_bd9f302dcfe2e5763b040931166022f14311f102a211f9bf85814ee894b4f83a",
            }
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setChatrooms(data) // for example purposes only
        })
  }, []);


  function handleLogin(username, password) {

    fetch("https://cs571.org/api/s24/hw9/login", {
            method: "POST",
            headers: {
                "X-CS571-ID": "bid_bd9f302dcfe2e5763b040931166022f14311f102a211f9bf85814ee894b4f83a",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: username,
              password: password
            })
          })
          .then(res => {
            if (res.status === 200) {
              return res.json()

            }else if(res.status === 401){
              console.log("error 401")
              return false;

            }else{
              console.log(`error ${res.status} happened`)
              return false;
            }

          //NOTE: we return .json into anothe .then to utilize it
          }).then(data => {
            if(data===false) return false
              
            handleTokenStore(data)
            setUsername(username)  
    })
  }

  //https://cs571.org/api/s24/hw9/register
  function handleSignup(username, password) {

    fetch("https://cs571.org/api/s24/hw9/register", {
            method: "POST",
            //credentials: "include",
            headers: {
                "X-CS571-ID": "bid_bd9f302dcfe2e5763b040931166022f14311f102a211f9bf85814ee894b4f83a",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: username,
              password: password
            })
          })
          .then(res => {
            if (res.status === 200) {
              return res.json()

            }else if(res.status === 409){
              console.log("error 409")
              return false;

            }else{
              console.log(`error ${res.status} happened`)
              return false;
            }

          //NOTE: we return .json into anothe .then to utilize it
          }).then(data => {
            if(data===false) return false

            handleTokenStore(data)
            setUsername(username)
        }).catch(e => console.log(`error: ${e}`))
      
  }

  function handleTokenStore(apiData) {
    SecureStore.setItemAsync("jwtToken", apiData.token).then(() => {
      setIsLoggedIn(true)
      setIsRegistering(false)
    }).catch(e => console.log(`error: ${e}`))
  }


  function handleLogout() {
    SecureStore.deleteItemAsync("jwtToken").then(() => {
      Alert.alert("Logging out")
      setIsLoggedIn(false)

    }).catch(e => console.log(`error: ${e}`))
  }

  function handleGuestSignup() {
    setIsGuest(false)
    setIsRegistering(true);
  }


  if (isLoggedIn || isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>

          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />

          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen {...props} name={chatroom} isGuest={isGuest} username={username}/>}
              </ChatDrawer.Screen>
            })
          }

          <ChatDrawer.Screen key={isGuest ? "guest" : "loggedIn"} name={isGuest ? "Signup" : "Logout"}>
            {(isGuest) ? (props) => <BadgerSignupScreen {...props} handleGuestSignup={handleGuestSignup}/>
              :
              (props) => <BadgerLogoutScreen {...props} handleLogout={handleLogout}/>
            }
          </ChatDrawer.Screen>
          

        </ChatDrawer.Navigator>
      </NavigationContainer>
    );

  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
 
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsGuest={setIsGuest} setIsRegistering={setIsRegistering} />
  }
}