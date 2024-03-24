import React, { useEffect,useRef } from 'react'
import {View,Text, Image,ImageBackground, TouchableOpacity} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useData } from '../context/DataWrapper'


export default function UsersScreen({navigation,route}:any){

    //@ts-ignore
    const {users,setUsers,setChats,baseUrl,getUsersList,userFormat,usersArrRef,setRmId} = useData()
    const {userId} = route.params
    let arr = [
        {
            id:1,
            name:'varun',
            notifications:10,
            last_msg:'22/02/2024'
        },
        {
            id:2,
            name:'Anupam',
            notifications:0,
            last_msg:'20/01/2022'
        },
        {
            id:3,
            name:'vikas',
            notifications:8,
            last_msg:'20/01/2024'
        },
        {
            id:4,
            name:'vikas',
            notifications:8,
            last_msg:'20/01/2024'
        },{
            id:5,
            name:'varun',
            notifications:10,
            last_msg:'22/02/2024'
        },
        {
            id:6,
            name:'Anupam',
            notifications:0,
            last_msg:'20/01/2022'
        },
        {
            id:7,
            name:'vikas',
            notifications:8,
            last_msg:'20/01/2024'
        },
        {
            id:8,
            name:'vikas',
            notifications:8,
            last_msg:'20/01/2024'
        },{
            id:9,
            name:'varun',
            notifications:10,
            last_msg:'22/02/2024'
        },
        {
            id:10,
            name:'Anupam',
            notifications:0,
            last_msg:'20/01/2022'
        },
        {
            id:11,
            name:'vikas',
            notifications:8,
            last_msg:'20/01/2024'
        },
        {
            id:12,
            name:'vikas',
            notifications:8,
            last_msg:'20/01/2024'
        },
        //{"clientid": "83538", "mobno": "43976346724", "name": "bibuthi"}
        
    ]


    useEffect(()=>{
        setRmId(userId)
    },[])
    


    return(
        <View style={{flex:1,backgroundColor:'#53d2fc'}}>
            
            <ImageBackground
                style={{flex:1}}
                source={{uri:'https://i.pinimg.com/736x/2a/33/4c/2a334ccc45f940ef779d5090d7e9a35e.jpg'}}

            >

            <View style={{
                flexDirection:'row',
                justifyContent:'space-between',
                backgroundColor:'#69d9ff',
                
                alignItems:'center',
                paddingVertical:8,
                
            }}>
                <View style={{marginLeft:5}}>
                    <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>Vitt RM App</Text>
                    <Text style={{color:'white',fontSize:12}}>(AI Powered Sales)</Text>
                </View>
                <View style={{marginRight:10}}>
                    <Image
                        style={{height:60,width:40}}
                        source={{uri:'https://vitt.ai/static/media/Robo.6aa2a6d1c0b68aa0cec2.png'}}
                    />
                </View>
            </View>

            <ScrollView
                
            >
                {users.map((e:any,i:number)=>(

            <TouchableOpacity 
                key={i}
                onPress={()=>{setChats([]),navigation.navigate('Chats',{mobile:e.mobile,name:e.name,clientId:e.clientId} )}}
                // style={{zIndex:2}}
                >
            <View style={{
                borderWidth:1,
                borderColor:'#edeff0',
                flexDirection:'row',
                backgroundColor:'white',
                paddingVertical:8,
                alignItems:'center',
                }}
                //
                key={i}
                >
                <View >
                    <Image
                        style={{
                            height:40,
                            width:40,
                            margin:2
                        }}
                        source={{uri:'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'}}
                    />
                </View>

                    <View style={{ 
                        width:'82%',
                        marginLeft:5,
                        // borderColor:'red',
                        // borderWidth:1
                        }} >
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>{e.name}</Text>
                            <Text style={{color:'black'}}>{e.lastMsgDate.day}/{e.lastMsgDate.month}/{e.lastMsgDate.year}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:2}}>
                            <Text style={{color:'black'}}>
                                {e.lastMsg.length < 30 ? e.lastMsg : `${e.lastMsg.split('',30).join('')}...` }
                                
                            </Text>
                            {e.unreadMsgCount===0 ? 
                            null :
                            
                            <View style={{
                                width:20,
                                height:20,
                                borderRadius:10,
                                backgroundColor:'#04d427',
                                justifyContent:'center',
                                alignItems:'center'
                                }}>
                                <Text style={{color:'white',fontSize:12}}>{e.unreadMsgCount}</Text>
                                
                            </View>
                            }
                        </View>
                    </View>
            </View>
            </TouchableOpacity>
                ))}
            </ScrollView>

            
            </ImageBackground>
        </View>
    )
}