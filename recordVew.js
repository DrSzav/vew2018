'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Camera from 'react-native-camera';


export default class CamRecorder extends Component {
  constructor(){
    super();
    var self = this;
    this.state = {
      hideControls:false,
      secondTimer:5,
      captureMode:Camera.constants.CaptureMode.still,
      captureQuality:Camera.constants.CaptureQuality['480p']

    };

    this.startRecording = this.startRecording.bind(this);

  }

  geoError(error){
    alert(error.message);
    console.log("GeoError: " + error.message);
  }

componentDidMount(){
    this.setState({hideControls:false,isMounted:true});
}


componentWillUnmount(){
  this.setState({isMounted:false})
  navigator.geolocation.clearWatch(this.watchID);
}

render() {
    return (
      <View style={styles.container}>

        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={0}
          captureMode={this.state.captureMode}
          captureTarget={Camera.constants.CaptureTarget.temp}
          captureQuality={this.state.captureQuality}
          captureAudio={true}
          orientation={3}>
        </Camera>
  {this.recordControls()}
      </View>
      );
}

  recordControls(){
    let shrinky = secondTimer / 2;

  if(!this.state.hideControls){
    return(<View>
      <View style={styles.backButtonParent} onPress={this.gotoMenu.bind(this)} >
        <Text style={styles.backButton} onPress={this.gotoMenu.bind(this)}>bak</Text>
      </View>
    <TouchableOpacity onPress={this.recordButton.bind(this)} >
      <View>
        <View style={{
              width: 100,
              height: 100,
            //  marginBottom:50,
              borderRadius: 100/2,
              backgroundColor: '#FF5D3B',
              borderWidth:13,

              borderColor:'#E8BA45',
              position:'absolute',
              bottom:10,
              transform:[{scale:shrinky}],
              right:10 }}>

        </View>
      </View>
    </TouchableOpacity>
    </View>);
  }
  else {
    return(<View>
    <View style={{
          width: 100,
          height: 100,
        //  marginBottom:50,
          borderRadius: 100/2,
          backgroundColor: '#FF5D3B',
          borderWidth:13,
          borderColor:'#E8BA45',
          position:'absolute',
          bottom:30,
          transform:[{scale:shrinky}],
          right:50 }}></View>
    </View>);
  }
}

  recordButton(){
  //  this.setState({captureQuality:Camera.constants.CaptureQuality.low});
    this.takeThumbnail();
  }

  startRecording() {
    console.log('yo');
    this.camera.capture()
      .then(this.videoData.bind(this))
    //  .then((data) => self.cameraData = data)
      .catch(err => console.error(err));
      this.setState({secondTimer:5,hideControls:true});
      this.shrinkInterval = setInterval(this.shrink.bind(this), 100);
      setTimeout(this.stopRecording.bind(this),5000);
  }

  takeThumbnail(){
    this.camera.capture()
      .then(this.thumbnailData.bind(this))
    //  .then((data) => self.cameraData = data)
      .catch(err => console.error(err));

  }

  videoData(data){
    var videoPath = data.path;
  //  console.log(videoPath);
    this.resetCapture();
    this.props.navigator.replace({index:2,videoData:{path:videoPath,location:this.props.currentPosition,thumbnailPath:this.state.thumbnailPath}});
  }


  thumbnailData(data){
    console.log(data.path);
    this.setState({
        thumbnailPath:data.path,
        captureMode:Camera.constants.CaptureMode.video
      });
    this.startRecording();
  }

  resetCapture(){
    this.setState({
      hideControls:false,
      secondTimer:7,
      captureMode:Camera.constants.CaptureMode.still,
  })
}

  shrink(){
    this.setState({secondTimer:(this.state.secondTimer - .01)});
  }

  stopRecording(){
    this.camera.stopCapture();
    clearInterval(this.shrinkInterval);
  }

  gotoMenu(){
    this.props.navigator.pop();
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
    justifyContent:'center'

  },

  circle:{
        width: 100,
        height: 100,
      //  marginBottom:50,
        borderRadius: 100/2,
        backgroundColor: '#FF5D3B',
        borderWidth:13,
        borderColor:'#E8BA45',
        position:'absolute',
        bottom:10,
        right:10

  },
  container: {
   flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',

  //  height: Dimensions.get('window').height,
//    width: Dimensions.get('window').width
  },
  countDown: {
    position:'absolute',
    top:10,
    right:10,
    color:'#fff',
    fontSize:20,
    fontWeight:'bold'
  },
  backButton: {
    flex: 1,
  //  position:'absolute',
    backgroundColor: '#45CDFF',
    //borderColor: '#45CDFF',
  //  borderRadius: 15,
    //color: '#45CDFF',
  //  borderWidth:13,
//    padding: 20,
    margin: 0,
//    bottom:10,
//    left:10,
    fontSize:40,
    fontWeight:'bold'

  }
,
  backButtonParent: {
    position:'absolute',
    backgroundColor: '#45CDFF',
  //  borderRadius: 15,
  //  color: '#45CDFF',
    padding: 5,
    bottom:10,
    left:10,
  //  height:100
  //  fontSize:30,
  //  fontWeight:'bold',

  }

});
