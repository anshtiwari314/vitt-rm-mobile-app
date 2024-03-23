import {TextInput, View,Image, TouchableOpacity, Button} from 'react-native'

export default function LoginScreen({navigation}:any){



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
                        
                        placeholderTextColor={'black'}
                    />
                    <TextInput
                        style={{color:'black',fontSize:18,borderBottomWidth:1,borderColor:'black',marginVertical:10}}
                        placeholder='password'
                        textContentType='password'
                        secureTextEntry={true}
                        placeholderTextColor={'black'}
                    />
                    
                </View>
                <View style={{marginVertical:10,borderWidth:1,borderColor:'white',width:'45%'}}>
                    <Button
                        title='Submit'
                    />
                </View>
                
            </View>
        </View>
    )
}