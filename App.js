import './menu.js';
import VewsMenu from './menu.js';


import SignIn from './SignIn';
import SignOut from './SignOut';

//import CamRecorder from './recordVew.js';
import VideoPlayback from './videoPlayer.js';
import VewsMap from './mapVew.js';
import CaptureVew from './captureVew.js';
import CapturePlayer from './capturePlayer.js';
import Gallery from './gallery.js';
import React, { Component } from 'react';
import Orientation from 'react-native-orientation';


import {
    Text,
   // Navigator,
    AppRegistry,
    StyleSheet,
    Dimensions,
    View,
    StatusBar,
    TouchableOpacity,
    Linking,
    AsyncStorage
} from 'react-native';


import { Navigator } from 'react-native-deprecated-custom-components';
import Meteor, { createContainer, connectMeteor } from 'react-native-meteor';
//import MapExample from './mapxample.js';
import Toast from 'react-native-root-toast';
import RNFS from 'react-native-fs';

import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

const videoFolder = RNFS.DocumentDirectoryPath + '/vewCollection/videos'
const thumbnailFolder = RNFS.DocumentDirectoryPath + '/vewCollection/thumbnails'
RNFS.mkdir(videoFolder);
RNFS.mkdir(thumbnailFolder);

//Meteor.connect('http://104.236.183.62:80/websocket',{autoConnect:true,autoReconnect:true});
Meteor.connect('https://getvew.com:443/websocket',{autoConnect:true,autoReconnect:true, reconnectInterval:1 });
//Meteor.connect('http://192.168.100.5:3000/websocket',{autoConnect:true,autoReconnect:true});
//http://pick
@connectMeteor
class App extends Component {

  constructor(){
    super();
    this.state = {appReady:true,pointsList:[],seenIDs:[],deleteds:{}};
    this.data = {};

  }
  componentDidMount(){
    Orientation.lockToLandscapeRight();
    this.getThumbnails(); //Using thumbnails to track physical storage kinda ghetto but ok
    this.getDeleteds();
    this.getCurrentPosition();
    this.cpInterval = this.setInterval(this.getCurrentPosition.bind(this),5000);
    Linking.addEventListener('url', this.handleDeepLink);
  }

  userSignedIn(){

  }

  componentWillUnmount(){
    clearInterval(this.updatePoints);
    this._isMounted = false;
    Linking.removeEventListener('url', this.handleDeepLink);
  }

  handleDeepLink(e) {
  const route = e.url.replace(/.*?:\/\//g, "");
  this._navigator.replace(this.state.routes[route]);
  console.log('link opened')
  }

  getMeteorData() {
    return {
      user: Meteor.user(),
    };
  }

  getThumbnails(){
    RNFS.readDir(thumbnailFolder).then((array) => {
      var newArray = [];
      for(var i = 0; i < array.length ; i++){
        let vewID = array[i].name.slice(0,-4);
        newArray.push(vewID);
      }
      this.setState({thumbnails:array,seenIDs:newArray});
  })
  .catch((err) => {
    console.log(err);
  });
  }

  getCurrentPosition(){
    console.log('get currentPosition');
    navigator.geolocation.getCurrentPosition(
      this.geoSuccess.bind(this),
      this.geoError.bind(this),
      {enableHighAccuracy: true, timeout: 2000, maximumAge: 2000}
    )
  }

  geoSuccess(position){

      this.setState({currentPosition:position});
      console.log(this.state.seenIDs);
      Meteor.call('getNearbyPoints',{position:position.coords},this.getPointsCallback.bind(this));

  }

  getPointsCallback(err,data){

    if(err){
      console.log(err);
      //alert('failed to initialize')
    }
    else{
    //Toast.hide(this.gettingToast);
    this.setState({rawPoints:data});
    this.checkPoints();
    this.setState({appReady:true});

    }
  }

  getComments(){
    Meteor.call('getCommentCount',{capturedVews:seenIDs},this.getComments.bind(this));
  }

  async updateDeleteds(){

    try {
      //console.log('yahhh');
      //console.log(this.state.deleteds)
      await AsyncStorage.setItem('deleteds', JSON.stringify(this.state.deleteds));
    } catch (error) {
      //console.log(error);
      //  console.log('error updating deleteds')
  // Error saving data
    }

  }

  async getDeleteds(){

    try {
      const value = await AsyncStorage.getItem('deleteds');
    if (value !== null){
      // We have data!!

      console.log(value);
      this.setState({'deleteds':JSON.parse(value)})
    }
      } catch (error) {
        console.log('nayyy');
    // Error retrieving data
    }
  }

  geoError(error){
    //alert(error.message);
  }

  checkPoints(){
    var pointsList = [];
    var seenIt = this.state.seenIDs;
    //seenIt.concat(this.state.deleteds);
    let data = this.state.rawPoints;
    if(data){
    for(var i = 0; i < data.length;i++){
        if(seenIt && seenIt.indexOf(data[i]._id) == -1){
            if(!this.state.deleteds[data[i]._id]){
            pointsList.push(data[i]);
          }
        }
        else{
          if(!seenIt){
            if(!this.state.deleteds[data[i]._id]){
            pointsList.push(data[i]);
            }
          }

        }
    }
    this.setState({pointsList:pointsList});
  }
    //Toast.show('Points updated');
  }

  seenVideo(vidID){
    let seenIDs = this.state.seenIDs;
    seenIDs.push(vidID);
    this.setState({seenIDs:seenIDs});

    //console.log(this.state.seenIDs)
    this.checkPoints();
    this.getThumbnails();
  }

  recordClick(){
    this.setState({nowRecording :!this.state.nowRecording});
  }

  resetCapture(){
    this.setState({resetCapture:true});
    this.setTimeout(this.reshow.bind(this),1000);
  }

  reshow(){
    this.setState({resetCapture:false});
  }

  render() {
        if (!this.data.user) {
          return ( <View style={{flex:1}}>
            <SignIn signIn={this.userSignedIn.bind(this)}/>
            <StatusBar hidden={true}/>
            </View>)
        }

        return ( <View style={{flex:1}}><Navigator initialRoute = {{
                    index: 3
                }} renderScene={ this.renderScene.bind(this) }
           />{this.renderBlock()}
           <StatusBar hidden={true}/>
           </View>);

  }

  deleteVew(vewID){
    this.getThumbnails();
    let delObj = this.state.deleteds;

    delObj[vewID] = true;
  //  console.log(arr);
    this.setState({'deleteds':delObj});
    this.updateDeleteds();
  }

  renderBlock(){
    if(this.state.appReady){
      return;
    }
    else{
      return(<View style={styles.overlay}/>)
    }

  }

  gotoMap(navigator){
    navigator.push({index:4});
  }

  goBack(navigator){
    navigator.pop();
  }


  renderScene(route, navigator) {
   if(route.index == 0) {
     return (<VewsMenu navigator={navigator}/>);
   }
   if(route.index == 1) {
     return (null);
   }
   if(route.index == 2) {
     return (<VideoPlayback navigator={navigator} videoData={route.videoData} />);
   }
   if(route.index == 3) {

     return (
<View style={{flex:1}}>
        <CaptureVew resetCapture={this.state.resetCapture} style={{flex:1}} seenVideo={this.seenVideo.bind(this)} navigator={navigator} currentPosition={this.state.currentPosition} points={this.state.pointsList} />
</View>
   );
   }
   if(route.index == 4) {
     let centerPoint = route.mapPoint ? route.mapPoint : false;
     return (
       <View style={{flex:1}}>
       <VewsMap navigator={navigator} mapCenter={centerPoint} points={this.state.pointsList} />
       </View>
     );
   }
   if(route.index == 5) {
     return (<CapturePlayer deleteVew={this.deleteVew.bind(this)} username={this.data.user.username} navigator={navigator} mode={route.mode} thumb={route.thumb} resetCapture={this.resetCapture.bind(this)} videoPath={route.vidPath} vewID={route.vewID}/>);
   }
   if(route.index == 6) {
     return (
       <View style={{flex:1}}>
        <Gallery navigator={navigator} thumbnails={this.state.thumbnails}/>
        <TouchableOpacity style={styles.backButtonHolder} onPressIn={this.goBack.bind(this,navigator)}><Text style={styles.backButton} >[back]</Text></TouchableOpacity>
     </View>);
   }
   if(route.index == 7) {
     return (
      <SignOut navigator={navigator}/>
    )
   }
   if(route.index == 8) {
    return (
     <VewsMenu username={this.data.user.username} 
     email={this.data.user.emails[0]['address']}
     navigator={navigator}/>
   )
  }

  }
}

const styles = StyleSheet.create({
  overlay:{
    position:'absolute',
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    bottom:0,
    right:0,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
    opacity:.8,
    zIndex:10

  },
  backButtonHolder:{
      height:100,
      width:100,
    //  backgroundColor:'red',
      position:'absolute',
      top:5,
      left:7,
      alignItems:'center',
      flexDirection:'column',
      justifyContent:'center',
  },

  backButton: {
    fontSize:30,
    height:70,
    width:160,
    position:'absolute',
    fontWeight:'bold',
    color: '#999999',
    top:0,
    left:15
},

});
reactMixin(App.prototype,TimerMixin);

  //AppRegistry.registerComponent('lovelife',() => App)
export default App;