import {useState,useEffect} from 'react'
import {TextInput, View,Image, TouchableOpacity, Button,ToastAndroid,PermissionsAndroid} from 'react-native'
import { useData } from '../context/DataWrapper'
import PushNotification from 'react-native-push-notification'

export default function LoginScreen({navigation}:any){

    const rmId = '918708213235'
    const pass = 'test'
    const [userName,setUserName] = useState(rmId)
    const [password,setPassword] = useState(pass)
    const {setRmId} = useData()
    
    
    useEffect(()=>{
       // console.log("i am ",PushNotification)
    },[])

    const requestNotificationsPermissions = async () => {
        try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You will get Notifications');

        } else {
            console.log('notifications permission denied');
            ToastAndroid.show('Notification Permission denied', ToastAndroid.LONG)
        }
        } catch (err) {
        console.warn(err);
        }
    };

    function handleNotification(){
        PushNotification.checkPermissions((permissions) => {
        if(permissions.alert===false){
            requestNotificationsPermissions()
        }else{
            console.log('notifications allowed');
        }
        });
    }

    useEffect(()=>{
        handleNotification();
    },[])


    function handleSubmit(){
        console.log(userName,password)
        //918708213235
        //navigation.navigate('Users',{userId:'918368751774'})
        let url = `https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/check-abwmtest-login`
        fetch(url,{
            method:'POST',
            headers:{
               'Accept':'application.json',
               'Content-Type':'application/json'
            },
    
            body:JSON.stringify({
                userid: userName,
                password: password
            }),
            //@ts-ignore
            cache:'default',}).then(res=>{
               //console.log("res from audio server",res)
               return res.json()
            }).then((result)=>{
              
            console.log('login result',result,result['success '])
             if(result['success ']===true){
                setRmId(userName)
                navigation.navigate('Users',{userId:userName})
             }
            })
    }

    
    return (
        <View style={{backgroundColor:'white',flex:1,justifyContent:'center',alignItems:'center'}}>
            <View style={{width:'80%',alignItems:'center',
            //borderWidth:1,borderColor:'white'
            }}>
                
                <Image 
                        style={{height:100,width:140,objectFit:'contain'}}
                        source={{uri:'https://jarvis-in-person-cues5.netlify.app/assets/logo-transformed-b8a25b8c.png'}}
                />
                
                <View style={{width:'100%'}}>
                    <TextInput 
                        style={{color:'black',fontSize:18,borderBottomWidth:1,borderColor:'black',marginVertical:10}}
                        placeholder='username'
                        onChangeText={(e)=>setUserName(e)}
                        value={userName}
                        placeholderTextColor={'black'}
                        //defaultValue='919834275238'
                    />
                    <TextInput
                        style={{color:'black',fontSize:18,borderBottomWidth:1,borderColor:'black',marginVertical:10}}
                        placeholder='password'
                        value={password}
                        onChangeText={(e)=>setPassword(e)}
                        textContentType='password'
                        defaultValue='test'
                        secureTextEntry={true}
                        placeholderTextColor={'black'}
                    />
                    
                </View>
                <View style={{marginVertical:10,borderWidth:1,borderColor:'white',width:'45%'}}>
                    <Button
                        onPress={handleSubmit}
                        title='Submit'
                    />
                </View>
                
            </View>
        </View>
    )
}