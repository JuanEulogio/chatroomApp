import { Alert, StyleSheet, Text, View, FlatList, Button, Modal, TextInput } from "react-native";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import { useState, useEffect, useRef } from "react";
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [isLoading, setIsLoading] = useState(false);

    const [posts, setPosts] = useState([])
    const modalTextTitle = useRef('')
    const modalTextBody = useRef('')

    const [isModalOn, setIsModalOn]= useState(false)

    function refresh() {
        setIsLoading(true)
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}` , {
            method: "GET",
            headers: {
                "X-CS571-ID": "bid_bd9f302dcfe2e5763b040931166022f14311f102a211f9bf85814ee894b4f83a",
            }
        })
        .then(res => res.json())
        .then(data => {
            setPosts(data.messages)
            setIsLoading(false);
        }).catch(e => console.log(`error: ${e}`))
    }

    //NOTE: exectures refresh as function to make the refresh multi use
    useEffect(() => {
        refresh();
    }, [])


    //TODO: delete function
    // 1) deletes that post using id
    // 2) alerts the user its been deleted
    // 3) refreshes posts useState
    function deletePost(id) {
        SecureStore.getItemAsync("jwtToken").then((token) => {
            console.log(token)

            fetch(`https://cs571.org/api/s24/hw9/messages?id=${id}` , {
                method: "DELETE",
                headers: {
                    "X-CS571-ID": "bid_bd9f302dcfe2e5763b040931166022f14311f102a211f9bf85814ee894b4f83a",
                    "Authorization": `Bearer ${token}`,
                }
            })
            .then(res => {
                if (res.status === 200) {
                return true

                }else if(res.status === 401){
                console.log("error 401")
                return false;

                }else{
                console.log(`error ${res.status} happened`)
                return false;
                }

                //NOTE: we return .json into anothe .then to utilize it 
            }).then(data => {
                if(data=== false) return data
                
                refresh()
                Alert.alert("Post Deleted")
            }).catch(e => console.log(`error: ${e}`))
        })        
    }


    //TODO: post function
    // 1) make modal with title, body, button
    // 2) disable button if title or body lacks content
    // 3) on post, give an alert
    // 4) refresh posts
    // 4) should go back up to first pg of posts
    function addPost() {
        //NOTE: in order to get things from an async, you have to use .then to catch the return,
        // and then manually return
        //ALSO NOTE: make sure you trace and set code so async code gets/makes code that you will
        // need later
        //EX: in here we really needed that token, so we put our fetch inside
        SecureStore.getItemAsync("jwtToken").then((token) => {
            console.log(token)

            fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}` , {
                method: "POST",
                headers: {
                    "X-CS571-ID": "bid_bd9f302dcfe2e5763b040931166022f14311f102a211f9bf85814ee894b4f83a",
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                title: modalTextTitle.current,
                content: modalTextBody.current
                })
            })
            .then(res => {
                if (res.status === 200) {
                return true

                }else if(res.status === 401){
                console.log("error 401")
                return false;

                }else{
                console.log(`error ${res.status} happened`)
                return false;
                }

                //NOTE: we return .json into anothe .then to utilize it 
            }).then(data => {
                if(data=== false) return data
                refresh();
                Alert.alert("Post Created")
                setIsModalOn(false)        

            }).catch(e => console.log(`error: ${e}`))
        })
    }

    

    return <View style={{ flex: 1}}>
        <FlatList
            data={posts}
            onRefresh={refresh}
            refreshing={isLoading}
            // method to add key
            // right now we are iterating through "data" where we called above
            // in our first var in FlatList. 
            // p is the current index of the iteration
            keyExtractor={p => p.id}
            // Be warned! renderItem takes a callback function, where the parameter is
            // an object of `index` and the current `item`
            renderItem={renderMessage => <BadgerChatMessage
                    poster={renderMessage.item.poster}
                    title={renderMessage.item.title}
                    content={renderMessage.item.content}
                    created= {renderMessage.item.created}
                    id={renderMessage.item.id}

                    username={props.username}
                    deletePost={deletePost}>
                </BadgerChatMessage>}
        ></FlatList>

        <View style= {{backgroundColor: props.isGuest ? "black" : "darkred", paddingBottom: 16 }}>
            <Button
                title= {props.isGuest ? "Login To make a Post" : "Add Post"} 
                disabled= {props.isGuest}
                color={"white"}
                onPress={() => setIsModalOn(true)}/>
        </View>

        <Modal
            visible={isModalOn}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={{...styles.modalText, fontSize: 24}}>Create a Post</Text>

                    <Text style={styles.modalText}>Title</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => modalTextTitle.current = text}
                        value={modalTextTitle}
                    ></TextInput>

                    <Text style={styles.modalText}>Body</Text>
                    <TextInput 
                        style={styles.textInput}
                        onChangeText={(text) => modalTextBody.current = text}
                        value={modalTextBody}
                    ></TextInput>

                    <View style={styles.signUpAndGuestButtonContainer}>
                        <View style={styles.buttonContainer}><Button color="crimson" title="Create Post" onPress={addPost} /></View>
                        <View style={styles.buttonContainer}><Button color="crimson" title="Cancel" onPress={() => setIsModalOn(false)} /></View>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    textInput: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 300,
    },
    signUpAndGuestButtonContainer: {
        flexDirection: 'row',
    },
    buttonContainer: {
        borderRadius: 14,
        margin: 4, //NOTE: padding expands our background color. NOTE IN THE CONTAINER
        paddingHorizontal: 4,
        backgroundColor: 'transparent',
        width: "50%" //key to align 2 col buttons. tweek with width
    },
});

export default BadgerChatroomScreen;