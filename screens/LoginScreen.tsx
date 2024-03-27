import {useState} from 'react'
import {TextInput, View,Image, TouchableOpacity, Button} from 'react-native'
import { useData } from '../context/DataWrapper'

export default function LoginScreen({navigation}:any){

    const [userName,setUserName] = useState('918368751774')
    const [password,setPassword] = useState('test')
   
    
    function handleSubmit(){
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
              
            // console.log('login result',result,result['success '])
             if(result['success ']===true){
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