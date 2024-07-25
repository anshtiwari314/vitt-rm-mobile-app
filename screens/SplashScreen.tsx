import { View,Image,Text ,Animated,Dimensions} from 'react-native';
import {useRef,useEffect} from 'react';
import React from 'react';

export default function SplashScreen(){

    const {width,height} = Dimensions.get('window')
    const translation = useRef(new Animated.Value(20)).current;
    const translation2 = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(translation, {
        toValue: -20,useNativeDriver:true
      }).start();
      Animated.timing(translation2, {
        toValue: 1,useNativeDriver:true
      }).start();
      
    }, []);

    return (
        <View style={{flex:1,justifyContent:'center',backgroundColor:'rgb(68, 174, 246)',alignItems:'center'}}>
            <Animated.View style={{height:height/2.5,alignItems:'center'
            
            }}>
            <Image
            style={{width:width,height:180,resizeMode:'contain'}}
            source={require('../assets/vitt-blue.png')}
            />
            <Animated.Text style={{color:"white",fontSize:20,opacity:translation2,transform:[{translateY:translation}] }}> Simplifying Finance </Animated.Text>
            </Animated.View>
        </View>
    )
}