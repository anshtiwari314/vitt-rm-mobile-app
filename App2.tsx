import PushNotification from 'react-native-push-notification'
import {Button, Text,View,PermissionsAndroid, Pressable} from 'react-native'
import { useEffect } from 'react'

export default function App() {
  
  function showNotification(){
    const key = Date.now().toString(); // Key must be unique everytime
    PushNotification.createChannel(
        {
            channelId: key, // (required)
            channelName: "Local messasge", // (required)
            channelDescription: "Notification for Local message", // (optional) default: undefined.
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.localNotification({
        channelId: key, //this must be same with channelid in createchannel
        title: 'my message',
        message: 'Hello world !!',
    })
  }

  function showNotification2(){

    const key = Date.now().toString(); // Key must be unique everytime
    PushNotification.createChannel(
        {
            channelId: key, // (required)
            channelName: "Local messasge", // (required)
            channelDescription: "Notification for Local message", // (optional) default: undefined.
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: key, // (required) channelId, if the channel doesn't exist, notification will not trigger.
      ticker: "My Notification Ticker", // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
      largeIconUrl: "https://i.pinimg.com/736x/f2/a8/be/f2a8bef42b2608a394cb86c2637d78fc.jpg", // (optional) default: undefined
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      bigText: "My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)", // (optional) default: "message" prop
      subText: "This is a subText", // (optional) default: none
      bigPictureUrl: "https://i.pinimg.com/736x/98/2a/f7/982af7ce7bd14e124dc11ac7abe83e32.jpg", // (optional) default: undefined
      bigLargeIcon: "ic_launcher", // (optional) default: undefined
      bigLargeIconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQARkVy4GYX7OWOYf-yDgLdgmI2kRWevLN2vw&s", // (optional) default: undefined
      color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: "some_tag", // (optional) add tag to message
      group: "group", // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: "high", // (optional) set notification priority, default: high
      visibility: "private", // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      
      when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
    
      messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
    
      actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
    
      /* iOS only properties */
      category: "", // (optional) default: empty string
      subtitle: "My Notification Subtitle", // (optional) smaller title below notification title
    
      /* iOS and Android properties */
      id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: "Anuj(8368751774)", // (optional)
      message: "Hokkah bar", // (required)
      picture: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d364921d-105f-4998-a93f-b7aeb2ca8e68/df88tmi-31f1eee5-ad8a-4896-9127-8cb6e4471afa.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2QzNjQ5MjFkLTEwNWYtNDk5OC1hOTNmLWI3YWViMmNhOGU2OFwvZGY4OHRtaS0zMWYxZWVlNS1hZDhhLTQ4OTYtOTEyNy04Y2I2ZTQ0NzFhZmEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.30q2bsQac4-gQ01DutvSY5W3TcKQ1h3I-pgwEeCuNjM", // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
      userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
  }

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('notifications permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  function handleNotification(){
    PushNotification.checkPermissions((permissions) => {
      if(permissions.alert===false){
        requestCameraPermission()
      }else{
        showNotification2()
      }
    });
  }

  return (
    <View>
      <Text>Hello world</Text>

      
      <Pressable onPress={()=>requestCameraPermission()}
      style={{backgroundColor:'blue',marginVertical:20,paddingVertical:8,alignItems:'center'}}>
        <Text> permissions</Text>
      </Pressable>

      <Pressable onPress={()=>handleNotification()} 
        style={{backgroundColor:'blue',marginVertical:10,paddingVertical:8,alignItems:'center'}}>
        <Text> notified</Text>
      </Pressable>
      {/* <Button 
      onPress={()=>{requestCameraPermission();}} 
      title={"permissions"} 
      //style={{marginVertical:10}}
      />
      <Button onPress={()=>{handleNotification()}} title={"notified"}/> */}
    </View>
  )
}
