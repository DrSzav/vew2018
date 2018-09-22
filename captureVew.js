'use strict';
import React, { Component} from 'react';
import {DeviceEventEmitter} from 'react-native';
import MiniMenu from './minimenu.js';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
//import Circle from './shapes.js'
import { RNCamera } from 'react-native-camera';
import {DeviceAngles}from 'react-native-device-angles';
import ReactNativeHeading from 'react-native-heading';
import Meteor from 'react-native-meteor';
import Toast from 'react-native-root-toast';
import RNFS from 'react-native-fs';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
require('geolib');

const captureTemp = RNFS.DocumentDirectoryPath + '/vewCollection/captureTemp'
const videoFolder = RNFS.DocumentDirectoryPath + '/vewCollection/videos'
const thumbnailFolder = RNFS.DocumentDirectoryPath + '/vewCollection/thumbnails'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class CaptureVew extends Component {
  constructor(){
    super();
    var self = this;
    var position = {};
    position.coords = {latitude:0,longitude:0};

    this.state = {nearby:[],position:position,readyPlay:false,vewLoaded:false,yawCorrection:0,secondTimer:0};
    DeviceAngles.setDeviceMotionUpdateInterval(.2);
  //  Location.setDistanceFilter(1);
//    Location.setDesiredAccuracy(1);
    //this.smoothYaw = new Array(20).fill(0);
    this.borderWidth = 0;
    this.genColorKey();
    this.vewsLoaded = {};
    this.closestPointKey = -1;
  }

  genColorKey(){
    this.colorKey = [];
    for(var i = 0; i < 10 ; i++){
      this.colorKey.push([randomColor(),randomColor()]);
    }
  }

  componentWillReceiveProps(newProps,newState){
      if(this._isMounted){
        this.receivePoints();
        if(newProps.currentPosition){
          this.doSomeMath(newProps.currentPosition);
        }
      }
    }



  doSomeMath(position){
    //Heading data sucks
    this.setState({position:position});
    if(this.state.nearby[this.closestPointKey]){
    this.closestPointDistance = this.state.nearby[this.closestPointKey].distance;
    }
    else{
      this.closestPointDistance = 9999;
    }
    if(this.state.convertedPoints){
      var pointsList = this.state.convertedPoints;
      var length = pointsList.length;

      if(pointsList.length > 0){
        let closestPointDistance = 9999;
        let length = pointsList.length;

        for(var i = 0;i < length; i++){
            let distance = geolib.getDistance(this.state.position.coords,pointsList[i])
            distance = parseInt(distance);
            pointsList[i].distance = distance;
            if(distance < closestPointDistance){
              if(this.closestPointKey == -1 || this.closestPointDistance > 10){
              this.closestPointKey = i;
              this.closestPointDistance = distance;
              }
              closestPointDistance = distance;

            }
            let bearing = geolib.getBearing(this.state.position.coords,pointsList[i]);
            pointsList[i].bearing = bearing + 360;
         }
          pointsList.sort((a,b)=>{
            a.distance - b.distance
          })
          this.setState({nearby:pointsList});


        if(closestPointDistance < 100){
          this.preloadVideo(pointsList[this.closestPointKey].videoID);
        }
        if(closestPointDistance < 30){
          this.setState({loading:true});

          if(this.vewsLoaded[pointsList[this.closestPointKey].videoID] ) {
          this.setState({readyPlay:true});
          this.checkVewLoaded();
          }
          this.checkForFiles();
        }
        else{
          this.setState({readyPlay:false,loading:false});
        //  this.setState({loading:false});
      //    this.setState({loading:false});
        }
      }
    }
  }

  preloadVideo(vewsID){
    if(this.state.loadingID != vewsID){
      this.setState({loadingID:vewsID});
      this.checkForFiles();
      }
  }

  checkForFiles(){
    this.checkThumbnailExists();
    this.checkVideoExists();
  }

  checkVewLoaded(){
    if(this.state.thumbnailLoad && this.state.videoLoad){
      this.setState({vewLoaded:true});
      this.vewsLoaded[this.state.loadingID] = 1;
     }
     else{
       if(!this.state.vewLoaded){
         if(this.state.loadingID){
           this.setState({vewLoaded:"loading"});
          }
            this.loadVideo();
        }
      this.setState({vewLoaded:false});
     }
  }

  checkThumbnailExists(){
    RNFS.exists(captureTemp + '/' + this.state.loadingID + '.jpg').then((thumBool) =>{
      console.log('thumbnail exists:' + thumBool);
        this.setState({thumbnailLoad:thumBool});
        this.checkVewLoaded();
      }).catch((err) =>{
          this.setState({thumbnailLoad:false});
        });
      }

  checkVideoExists(){
    RNFS.exists(captureTemp + '/' + this.state.loadingID + '.mov').then((movBool) => {
      console.log('video exists:' + movBool);
      this.setState({videoLoad:movBool});
      this.checkVewLoaded();
    }).catch((err) =>{
        this.setState({videoLoad:false});
      });
  }

loadVideo(){
  Meteor.call('getVew',{position:this.state.position.coords,_id:this.state.loadingID},this.getVewCallback.bind(this));
}
  getVewCallback(err,data){
    if(err){
      console.log(err);
    }
    else{
      if(data){

      var vewPath = captureTemp + '/' +  data._id + '.mov';
      var thumbnailPath = captureTemp + '/' +  data._id + '.jpg';
    //  console.log("writing");

      RNFS.writeFile(thumbnailPath, data.thumbnailFile, 'base64')
      .then((success) => {
      //  this.setState({thumbPath:thumbnailPath});
      })
      .catch((err) => {
        console.log(err.message);
      });

      RNFS.writeFile(vewPath, data.videoFile, 'base64')
      .then(this.setVewsLoad.bind(this))
      .catch((err) => {
        console.log(err.message);
      });


      }
    }
    //  var pointsList = [];
  }

setVewsLoad(){
  if(this._isMounted){
    this.setState({vewLoaded:true});
  }
}
  geoError(error){
    alert(error.message);
  }

componentWillMount(){
  this.receivePoints();
  RNFS.mkdir(captureTemp);

  ReactNativeHeading.start(20)
  .then(didStart => {

  });

  DeviceEventEmitter.addListener('headingUpdated',this.headingListener.bind(this));
  DeviceEventEmitter.addListener('AnglesData', this.attitudeListener.bind(this));

  DeviceAngles.startMotionUpdates();

}

componentDidMount(){
  this._isMounted = true;

}

componentDidUpdate(){

}

receivePoints(){
  if(this.state.points != this.props.points){
    this.state.points = this.props.points;
    this.convertPoints();
    //this.geoSuccess();
  }
}

convertPoints(){
  if(this.state.points.length == 0){
    return;
  }
  let nearbyList = this.state.points;

  var returnList = [];
  //assuming longitude, latitude
  var len = nearbyList.length >= 3 ? 3 : nearbyList.length;
  for(let i = 0;i < len ;i++){
    var newObj = {};
    newObj.longitude = nearbyList[i].location.coordinates[0];
    newObj.latitude = nearbyList[i].location.coordinates[1];
    newObj.videoID = nearbyList[i]._id;
    if(newObj.videoID != this.props.videoID){
     returnList.push(newObj);
    }
  }
  if(returnList.length == 0){
    Toast.show('No vewz tu kol lek');
  }

  returnList.reverse();
  this.setState({convertedPoints:returnList});

}

attitudeListener(data){
    this.setState({yaw:data.yaw});
    this.setState({roll:data.roll});
}

headingListener(data){
    data.heading += 100;
    var yawCorrection = this.state.yaw;
    this.setState({yawCorrection:yawCorrection});
    this.setState({heading:data.heading});
  }

getCurrentPosition(){
  navigator.geolocation.getCurrentPosition(
    this.geoSuccess.bind(this),
    this.geoError.bind(this),
    {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
  )
}

componentWillUnmount(){
  DeviceAngles.stopMotionUpdates();
  DeviceEventEmitter.removeAllListeners('AnglesData');
  ReactNativeHeading.stop();
  DeviceEventEmitter.removeAllListeners('headingUpdated');
  this._isMounted = false;
}



render() {
  let showMenu = null;
  let countDown = null;
  let shrinky = (this.state.secondTimer) / 15;

    if(!this.state.nowRecording){
       showMenu = <MiniMenu recordClick={this.recordButton.bind(this)} navigator={this.props.navigator}/>;
        }
      else{
          countDown = <View style={styles.overlay}>
            <View style={{
                width: 100,
                height: 100,
              //  marginBottom:50,
                borderRadius: 100,
                backgroundColor: '#FF5D3B',
                borderWidth:13,
                borderColor:'#E8BA45',
                opacity:.3,
                transform:[{scale:shrinky}]
              }}>
          </View></View>;
        }
  let position = this.state.heading;
    return (
      <View style={styles.container}>

        <RNCamera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          type={1}
          //captureMode={this.state.captureMode}
         // captureTarget={RNCamera.Constants.CaptureTarget.temp}
          forceUpOrientation={false}
          quality={3}
          captureAudio={true}
         // orientation={RNCamera.Constants.Orientation.landscapeRight}
          >
        </RNCamera>
        {this.renderSpheres()}
      {/*  <Text style={styles.backButton} onPressIn={this.gotoMenu.bind(this)}>bak</Text>*/}
        {this.renderPlayButton()}
        {countDown}
        <View style={styles.nearbyOverlay}>{this.renderNearby()}</View>
        <View style={styles.overlay2}>
        {showMenu}
        </View>

        <View style={{position:'absolute', top:10,right:15}}>
          <TouchableOpacity onPressIn={this.goToSignOut.bind(this)}>
            <Text style={{color:'#999999',fontSize:20,padding:10 }}>[Menu]</Text>
          </TouchableOpacity>

        </View>
      </View>
      );
}

circleTouch(point){
  console.log(point);
  point.zoomLevel = 15;
  this.props.navigator.push({index:4,mapPoint:point})
}

goToSignOut(){
  this.props.navigator.push({index:8});
}

renderNearby(){

  let Arr = this.state.nearby.map((current, i) => {
    return(
      <TouchableOpacity style={{height:60,zIndex:9999999}} key={i + 'click'} onPressIn={this.circleTouch.bind(this,current)}>

      <View  key={i + 'list'} style={{flex:1,flexDirection:'row',alignItems:'center'}}>

      <View style={{
        height:30,
        width:30,
        backgroundColor: this.colorKey[i][0],
        borderColor: this.colorKey[i][1],
        borderWidth:5,
        borderRadius:5,
        marginRight:10

          }}
        ></View>

        <Text style={{fontSize:15,color:'#fff'}}>{current.distance}m</Text>

        </View>

         </TouchableOpacity>

      )
    }
  );
  return(<View>{Arr}</View>);
    //var source =
}

renderSpheres(){

  if(this.state.nowRecording || this.state.captureVew){
    return;
  }

  this.borderWidth+=.5;
  let borderWidth = 0;

  if(this.borderWidth > 20){
    this.borderWidth = 0;
  }

  if(this.borderWidth > 10){
    borderWidth = 20 - this.borderWidth;
  }
  else{
    borderWidth = this.borderWidth;
  }

  let renderNearby = null;
  var playButton = false;

  var yaw = -this.state.heading + (this.state.yaw - this.state.yawCorrection);//this.state.yaw + this.state.yawCorrection;
  let radius = 2;
  if(this.state.loading){
    radius = 200;
    let horizontalOffset = width/2 - 125 - (borderWidth / 2);
    let verticalOffset = height/2 - 125 - (borderWidth / 2);
    let diameter = radius + 50 + borderWidth;
    return (<View key={'playme'}

      style={[styles.sphere,{
           right:horizontalOffset,
           bottom:verticalOffset,
           opacity: 1,
           borderRadius:radius * 2,
           width:diameter,
           justifyContent:'center',
           height:diameter,
           //padding:10,
           backgroundColor: this.colorKey[this.closestPointKey][0],
           borderColor: this.colorKey[this.closestPointKey][1],
           borderWidth: borderWidth,
       }
     ]}>
       </View>
     )
  }

  let Arr = this.state.nearby.map((current, i) => {


  if(current.distance && current.distance < 1000){
     radius = (width * 5)/(current.distance);
    if(radius > width) radius = width;
  }
  let horizontalOffset = width/2 - (radius/2);
  let verticalOffset = height/2 - (radius/2);

  let roll = this.state.roll;





  if(roll > -73) roll = -73;
  if(roll < -113) roll = -113;

  //if(current.distance > 20){
    let yaw2 = yaw - 90;
    yaw2 = (yaw2 + current.bearing + 630) % 360;
    yaw2 = yaw2 - 180;

  //  console.log(yaw2);
    if(yaw2 < -34) yaw2 = -34;
    if(yaw2 > 34 )yaw2 = 34;


    horizontalOffset -= (yaw2 / (67/2)) * (width/2);
    verticalOffset += ((roll + 90 )/ (38/2)) * (height/2);
//  }


  let opacity = (100 / (current.distance)) + .3;
  opacity = opacity > 1 ? 1 : opacity;
  let diameter = radius + 50 + borderWidth;

  if(current.distance > 200){
    radius = 20;
  }

    //let kilos = current.distance / 1000;
    return (<View key={i}

      style={[styles.sphere,{
           right:horizontalOffset - (radius / 2) - (borderWidth/2),
           bottom:verticalOffset,
           opacity: opacity,
           borderRadius:radius * 2,
           width:diameter,
           justifyContent:'center',
           height:diameter,
           //padding:10,
           backgroundColor: this.colorKey[i][0],
           borderColor: this.colorKey[i][1],
           borderWidth: borderWidth,
       }
     ]}>
       </View>
     )

   });

  return(<View>{Arr}</View>);

}

  gotoMenu(){
    this.props.navigator.push({index:8});
  }

  playVew(){
    this.setState({capturePlayer:true});
    this.saveToCollection();
  }

  saveToCollection(){
    let videoDest = videoFolder + '/' + this.state.loadingID + '.mov'

    let thumbDest = thumbnailFolder + '/' + this.state.loadingID + '.jpg'
    RNFS.moveFile(captureTemp + '/' + this.state.loadingID + '.jpg', thumbDest, 'base64')
    .then((success) => {

    })
    .catch((err) => {
      console.log(err.message);
    });

    RNFS.moveFile(captureTemp + '/' + this.state.loadingID + '.mov', videoDest, 'base64')
    .then((success) => {

      RNFS.unlink(captureTemp)
        .then(() => {
          RNFS.mkdir(captureTemp);
          //console.log('FILE DELETED');
      })
      .catch((err) => {
        console.log(err.message);
        });
        this.pushVideoPlayer(videoDest);
    })
    .catch((err) => {
      if(err.code == "ENSCOCOAERRORDOMAIN516"){ //video already exists
        this.pushVideoPlayer(videoDest);
      }
      console.log(err.message);
    });

  }

  pushVideoPlayer(videoDest){
    let vewID = this.state.loadingID;
    this.props.seenVideo(vewID);
    this.setState({vewLoaded:false,loading:false,loadingID:null,closestPointKey:-1,nearby:[],readyPlay:false});
    this.genColorKey();

    this.props.navigator.push({index:5,vewID:vewID,vidPath:videoDest,mode:'capture'});
    this.props.seenVideo(vewID);
  }

  renderPlayButton(){
    //console.log(this.state.readyPlay);
    if(this.state.readyPlay && !this.state.nowRecording){
      //console.log(this.state.vewLoaded);
      if(this.state.vewLoaded == true){
        return (
          <TouchableOpacity style={styles.playButton} onPressIn={this.playVew.bind(this)}>
            <Text style={
              {color: '#000',
              fontSize:30,
              fontWeight:'bold',

          }}>play</Text>
          </TouchableOpacity>
        );
      }
      return (<Text style={styles.loading}>loading</Text>);
    }
    if(this.state.loading && !this.state.nowRecording){
      return (<Text style={styles.loading}>loading</Text>);
    }

      //if(this.state.vewLoaded == "loading" ){

    //  }


}

recordButton(){
  this.setState({nowRecording:true});
  this.shrinkInterval = this.setInterval(this.shrink,100)
  this.takeThumbnail();
}

startRecording() {
  this.camera.recordAsync({quality:3})
  .then(this.videoData.bind(this))
  .catch(err => console.error(err));
  this.setTimeout(this.stopRecording.bind(this),5000);
}

takeThumbnail(){
  this.camera.takePictureAsync(
    {
      quality:.1,
      forceUpOrientation: false, 
      fixOrientation: false,
      exif:true
    }
  )
    .then(this.thumbnailData.bind(this))
  //  .then((data) => self.cameraData = data)
    .catch(err => console.error(err));

}

videoData(data){
  var videoPath = data.uri;
//  console.log(videoPath);
  this.vewsLoaded[data._id] = 1;
  this.props.navigator.push({index:2,videoData:{path:videoPath,location:this.props.currentPosition,thumbnailPath:this.state.thumbnailPath}});
}


thumbnailData(data){
  console.log(data.path);
  this.setState({
      thumbnailPath:data.uri,
      //captureMode:Camera.constants.CaptureMode.video
    });
  this.setTimeout(this.startRecording.bind(this),300);
}

resetCapture(){
  this.setState({
    hideControls:false,
    secondTimer:0,
    //captureMode:Camera.constants.CaptureMode.still,
    nowRecording:false
})
}

shrink(){
  this.setState({secondTimer:(this.state.secondTimer + 1)});
}

stopRecording(){
  this.camera.stopRecording();
  clearInterval(this.shrinkInterval);
  this.resetCapture();
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
  cOverlay:{
  width:Dimensions.get('window').width,
  },
  overlay2:{
    position:'absolute',
    height:100,
    width:Dimensions.get('window').width,
    bottom:0,
    right:0,
    flexDirection:'column',
    alignItems:'flex-end',
    justifyContent:'flex-end',

    opacity:1,
    zIndex:10

  },
  nearbyOverlay:{
    position:'absolute',
    height:200,
    width:Dimensions.get('window').width,
    top:10,
    left:10,
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent:'center'
  },
  heading:{
    position:'absolute',
    fontSize:40,
    top:10,
    left:10,
    margin:5,
    color:'white'
  },
  sphere:{
    position:'absolute',
    width: 100,
    height: 100,
    bottom:Dimensions.get('window').height/2 - 50,
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

      //  right:Dimensions.get('window').width/2 - 50

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
    color:'#fff',
    fontSize:30,
    fontWeight:'bold'
  },
  backButtonHolder:{
      height:100,
      width:100,
      //backgroundColor:'red',
      position:'absolute',
      bottom:0,
      left:0,
      alignItems:'center',
      flexDirection:'column',
      justifyContent:'center'
  },

  backButton: {
    backgroundColor:'white',
    fontSize:40,
    fontWeight:'bold',
    width:100,
    height:50,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
},

playButton: {
  //flex: 1,
  position:'absolute',
  backgroundColor: '#7D70E8',
  borderRadius: 10,
  zIndex:100,

  bottom: Dimensions.get('window').height/2 - 30,
  left: Dimensions.get('window').width/2 - 40,

  height:60,
  width:80,
  alignItems:'center',
  justifyContent:'center'
//  flex:1
},
loading: {
  //flex: 1,
  position:'absolute',
//  backgroundColor: '#7D70E8',
  borderRadius: 3,
  zIndex:100,
  color: '#fff',
  padding: 10,
  margin: 10,
  bottom: Dimensions.get('window').height/2 - 30,
  left: Dimensions.get('window').width/2 - 50,
  fontSize:20,
  fontWeight:'bold'
//  flex:1
},

});

function randomColor(){
  var cutoff = 200;
  var r = Math.floor(Math.random() * cutoff + 55);
  var g = Math.floor(Math.random() * cutoff + 55);
  var b = Math.floor(Math.random() * cutoff + 55);
  return "rgb(" + r + "," + g + "," + b + ")";
}

reactMixin(CaptureVew.prototype,TimerMixin);
