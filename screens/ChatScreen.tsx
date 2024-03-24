import React, { useEffect, useState,useRef } from 'react'
import { ScrollView, ImageBackground,Keyboard } from 'react-native'
import {Button, Image, Text, TextInput, TouchableOpacity, View} from 'react-native'
import { useData } from '../context/DataWrapper'

export default function ChatScreen({navigation,route}:any){

    const [msg,setMsg] = useState('')
    //@ts-ignore
    const {chats,setChats,baseUrl,chatsFormat,usersArrRef, chatsArrRef,rmId,users,setUsers} = useData()
    const {mobile,name,clientId} = route.params 
    const scrollViewRef = useRef<any>(null);
    const [scrollPosition,setScrollPosition] = useState(null)

    function getAllChats(url:string,mobile:'string'){
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
        
                body:JSON.stringify({
                    rm_id:rmId,
                    user_num:mobile
                }),
                //@ts-ignore
                cache:'default',}).then(res=>{
                   //console.log("res from audio server",res)
                   return res.json()
                }).then((result)=>{
                  
                  //setMsg((prev)=>[...prev,...result])
                  //console.log(result)
                 //setUsers(result.message)
                 resolve(result.message) 
                })
        })
    }

    useEffect(()=>{
        navigation.setOptions({ title: name })
       // console.log('use-eff',name)
    },[])

    useEffect(()=>{
        // if users in second screen then msg count not increase
      
        let tempUsers:any = []
        usersArrRef.current.map((user:any,i:number)=>{
         if(user.mobile ===mobile){
            user.unreadMsgCount = 0
         }
         
        })

        //usersArrRef.current = []
        setUsers([...usersArrRef.current])
    },[chats])

    useEffect(()=>{
        //setChats()
        let url = `${baseUrl}/usr_chat_history`
        //@ts-ignore
        let tempArr =[]
        getAllChats(url,mobile).then((result:any)=>{
            //console.log('i am result',result)
            let keys=Object.keys(result)
            //console.log('i am mobile from chat screen',mobile)
            keys.map((e)=>{
                let tempChat = {...chatsFormat}
                tempChat.sender = result[e].conv_initiated
                tempChat.msg = result[e].msg 
                tempChat.mobile = result[e].user_num
                //console.log('from inside chtscreen',e.split(' '))
                tempChat.time =e.split(' ')[1]
                tempChat.date = e.split(' ')[0]

                tempArr.push(tempChat)
                //console.log(result[e])
             
            })
            //@ts-ignore
            chatsArrRef.current = [...tempArr]
            //@ts-ignore
            setChats(tempArr)
            
        })
    },[])

    useEffect (()=>{
        //set scroll to end 
        scrollViewRef.current.scrollToEnd({animated:true})
    },[])

    function handleMsg(){
        let url = `${baseUrl}/rm_message_handler`
        
        fetch(url,{
            method:'POST',
            headers:{
               'Accept':'application.json',
               'Content-Type':'application/json'
            },
    
            body:JSON.stringify({
                rm_id:rmId,
                agent_response:msg,
                user_num:mobile
            }),
            //@ts-ignore
            cache:'default',}).then(res=>{
               //console.log("res from audio server",res)
               return res.json()
            }).then((result)=>{
              
              //setMsg((prev)=>[...prev,...result])
              //console.log('handle msg',result)
             //setUsers(result.message)
             //resolve(result.message) 

            })
        
        let tempChat = {...chatsFormat}
        
        tempChat.sender = 'rm'
        tempChat.msg = msg  
        tempChat.mobile = mobile
        
        //tempChat.time =e.split(' ')[1]
        //tempChat.date = e.split(' ')[0]
        chatsArrRef.current = [...chatsArrRef.current,tempChat]
        setChats([...chatsArrRef.current])
        setMsg('')
    }

    function disconnectUser(){
        let url = `${baseUrl}/disconnect_user`
        
        fetch(url,{
            method:'POST',
            headers:{
               'Accept':'application.json',
               'Content-Type':'application/json'
            },
    
            body:JSON.stringify({
                user_num: mobile,  
                status: false
            }),
            //@ts-ignore
            cache:'default',}).then(res=>{
               //console.log("res from audio server",res)
               return res.json()
            }).then((result)=>{
              
              //setMsg((prev)=>[...prev,...result])
             // console.log('disconnected user',result)
             //setUsers(result.message)
             //resolve(result.message) 

            })
    }

    function getScrollPosition(event:any){
        //console.log("content offset",)
        setScrollPosition(event.nativeEvent.contentOffset)
    }

    function handleScrollEffect(width:number,height:number){
        //scrollViewRef.current.to `     q-;l
    
        //console.log("handle scroll effect ",height,scrollPosition?.y)
        
        //if scroll position is within 30 then it should scroll down to new msg 
        //otherwise stays there 
        
        // if(height-scrollPosition.y<=800){
        //     scrollViewRef.current.scrollToEnd({animated:true})
        // }
        scrollViewRef.current.scrollToEnd({animated:true})
    }

    useEffect(()=>{
        let d = new Date()
      //  console.log("only date effect",d.getDay(),d.getTime(),d.getMonth())
    },[])
    
    //style={{backgroundColor:'#69d9ff'}}
    return (
        <View style={{flex:1}}>

            <ImageBackground
               // style={{}}
                source={{uri:'https://i.pinimg.com/736x/2a/33/4c/2a334ccc45f940ef779d5090d7e9a35e.jpg'}}
                style={{flex:1}}
            >
            <View
                style={{
                    flex:Keyboard.isVisible()? 0.73:0.85
                }}
            >
                <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={handleScrollEffect}
                onScroll={getScrollPosition}
                >
                    {chats.map((e:any,i:number)=>{
                       // console.log(e.sender,e)
                        if(e.sender==='rm'){
                            return <View style={{display:'flex',alignItems:'flex-end'}} key={i*19}>
                                <View style={{
                                    width:'auto',
                                    maxWidth:'80%',
                                    //height:20,
            
                                    backgroundColor:'#179dfc',
                                    marginRight:5,
                                    marginVertical:5,
                                    paddingVertical:8,
                                    paddingHorizontal:10,
                                    borderRadius:5
                                }}>
                                    <Text style={{color:'white',fontSize:15}}>
                                        {e.msg}
                                    </Text>
                                </View>
                            </View>
                        }else{
                            return <View style={{display:'flex',alignItems:'flex-start'}} key={i*19}>
                                <View style={{
                                    width:'auto',
                                    maxWidth:'80%',
                                    //height:20,
                                    backgroundColor:'#173dfc',
                                    marginLeft:5,
                                    marginVertical:5,
                                    paddingVertical:8,
                                    paddingHorizontal:10,
                                    borderRadius:5
                                }}>
                                    <Text style={{color:'white'}}>
                                    {e.msg}
                                    </Text>
                                </View>
                            </View>
                        }
                    })}
                
                

                
                </ScrollView>
                
                
            </View>
            <View style={{
                flex:Keyboard.isVisible()? 0.12 :0.07,
                marginVertical:5,alignItems:"center",
                // borderColor:'red',
                // borderWidth:1,
                }}>
                <View style={{width:"90%",alignItems:"center"}}>
                <Button 
                    onPress={disconnectUser} 
                    title="Disconnect user"
                    color={"#173dfc"}
                    
                />
                </View>
            </View>
            
            
            <View style={{
                flex:Keyboard.isVisible()? 0.15:0.08,
                backgroundColor:'black',flexDirection:'row',alignItems:'center',
                // borderColor:'red',
                // borderWidth:1,
                }}>
                <TextInput
                    style={{
                        width:'85%',
                        height:'100%',
                        // borderWidth:1,
                        // borderColor:'red',
                        color:'white',
                        backgroundColor:'#333333',
                        paddingLeft:10
                    }}
                    //onChangeText={onChangeNumber}
                    //value={number}
                    placeholder="Message"
                    placeholderTextColor='#f0ebeb'
                    onChangeText={setMsg}
                    value={msg}
                />
                <TouchableOpacity
                    
                    style={{
                        // borderColor:'red',
                        // borderWidth:1,
                        width:'15%',
                        height:'100%',
                        alignItems:'center',
                        justifyContent:'center'

                    }}
                    onPress={handleMsg}
                >
                    <Image
                        style={{width:'100%',height:'100%',backgroundColor:'black'}}
                        source={{uri:'https://cdn-icons-png.flaticon.com/512/3814/3814305.png'}}
                        
                    />
                </TouchableOpacity>
            </View>
            </ImageBackground>
        </View>
    )
}