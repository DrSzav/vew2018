'use strict';
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import Toast from 'react-native-root-toast';
import Meteor from 'react-native-meteor';
//import DDPClient from 'ddp-client';
//import RNViewShot from "react-native-view-shot";
//let ddpClient = new DDPClient();



//Meteor.connect('http://52.11.161.237/websocket',{autoConnect:true,autoReconnect:true});

export default class VideoPlayback extends Component{
  constructor(){
    super();
    this.state = {paused:false,hideButtons:false,rate:1}
  }

  componentDidMount(){

  }

render(){
 let vidPath = this.props.videoData.path;

 return(<View ref="full" style={{flex:1}}>
  <Video source={{uri: vidPath}} // Can be a URL or a local file.
         rate={this.state.rate}                   // 0 is paused, 1 is normal.
         volume={1.0}                 // 0 is muted, 1 is normal.
         muted={false}                // Mutes the audio entirely.
         paused={this.state.paused}               // Pauses playback entirely.
         resizeMode="cover"           // Fill the whole screen at aspect ratio.
         repeat={true}                // Repeat forever.
    //     onLoadStart={this.loadStart} // Callback when video starts to load
  //       onLoad={this.setDuration}    // Callback when video loads
  //       onProgress={this.setTime}    // Callback every ~250ms with currentTime
  //       onEnd={this.onEnd}           // Callback when playback finishes
  //       onError={this.videoError}    // Callback when video cannot be loaded
         style={styles.backgroundVideo}
         ref="videoPlayer"/>
         {this.renderButtons()}
         </View>
)}

  renderButtons(){
    if(!this.state.hideButtons){
      return(
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.button} onPressIn={this.recordAgain.bind(this)}>
        <Text style={styles.backButton}>[cancel]</Text>
        </TouchableOpacity>
        <TouchableOpacity onPressIn={this.uploadButton.bind(this)}>
          <Text style={styles.uploadButton}>[upload]</Text>
        </TouchableOpacity>
        </View>
      )
    }
    else{
      return
    }
  }


  recordAgain(){
    this.props.navigator.pop();
  }

  uploadButton(){

    this.setState({hideButtons:true,rate:0,paused:true});
    this.uploadToast = Toast.show('Uploading vew...', {
    duration: 3000,
    position: 20,
    shadow: true,
    animation: false,
    hideonPressIn: false,
    delay: 0,
    onShow: () => {
        // calls on toast\`s appear animation start
    },
    onShown: () => {
        // calls on toast\`s appear animation end.
    },
    onHide: () => {
        // calls on toast\`s hide animation start.
    },
    onHidden: () => {
        // calls on toast\`s hide animation end.
    }
});
    //  this.props.navigator.popToTop();
   RNFS.readFile(this.props.videoData.thumbnailPath,'base64').then(this.addThumbnailData.bind(this));


  }

  addThumbnailData(file){
      this.setState({thumbnailData:file});
      RNFS.readFile(this.props.videoData.path,'base64').then(this.uploadFile.bind(this));
  }

  uploadFile(file){
  /*  var myPromise = new Promise(this.uploadCallBack);
    myPromise.then(
      // Log the fulfillment value
      function(val) {
      console.log(val);
      return val;
      })
  .catch(
      // Log the rejection reason
      function(reason) {
        console.log(reason);
        return reason;
      });
 */
      Meteor.call('uploadVew',
      {file:file,"location":this.props.videoData.location,thumbnailFile:this.state.thumbnailData},
      this.uploadCallBack.bind(this));
      this.props.navigator.popToTop();
  }

  uploadCallBack(err,result){
    if(err){
     Toast.show("upload failed");
    }
    else{
      let toast = Toast.show('upload finished!', {
      duration: 1000,
      position: 20,
      shadow: true,
      animation: false,
      hideonPressIn: false,
      delay: 0,
      onShow: () => {
          // calls on toast\`s appear animation start
      },
      onShown: () => {
          // calls on toast\`s appear animation end.
      },
      onHide: () => {
          // calls on toast\`s hide animation start.
      },
      onHidden: () => {
          // calls on toast\`s hide animation end.
      }

  });
    Toast.hide(this.uploadToast);

  }

  }


}
var styles = StyleSheet.create({
  overlay:{
    position:'absolute',
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
  //  bottom:0,
  //  right:0,
    //flexDirection:'column',
    //alignItems:'center',
    //justifyContent:'center',
    zIndex:9999999

  },
  button:{
    flex:1
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backButton: {
    position:'absolute',
    color: '#999999',
    bottom:0,
    left:20,
    fontSize:30,
    fontWeight:'bold',
    height:70,
    width:150
},
uploadButton: {
  //flex: 1,
  position:'absolute',
  color: '#999999',
  bottom:0,
  right:0,
  fontSize:30,
  fontWeight:'bold',
  height:70,
  width:150
//  flex:1
}
});
