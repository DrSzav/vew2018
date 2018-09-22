'use strict';
import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ListView,
  TextInput
} from 'react-native';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
//import Toast from 'react-native-root-toast';
import Meteor , { createContainer, connectMeteor } from 'react-native-meteor';
//import DDPClient from 'ddp-client';
//let ddpClient = new DDPClient();

import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

import Share, {ShareSheet, Button} from 'react-native-share';

//Meteor.connect('http://52.11.161.237/websocket',{autoConnect:true,autoReconnect:true});
const commentSyncRate = 2000;
@connectMeteor
export default class CapturePlayer extends Component{
  constructor(){
    super();
    this.state = {commentsOpen:false,paused:true,hideButtons:false,rate:1,
          comments:[]}
  }

componentWillMount(){
  this.setState({mode:this.props.mode});
  this.commentSyncInterval = this.setInterval(this.getComments.bind(this),commentSyncRate);
}

componentWillUnmount(){
    this.props.resetCapture();
}

componentDidMount(){
  this.getComments();
  this.setTimeout(this.startVideo.bind(this),1100);
}

startVideo(){
  this.setState({paused:false});
}

getComments(){
    Meteor.call('getComments',{vewID:this.props.vewID},this.getCommentsCallback.bind(this));
}

 getCommentsCallback(error,data){
  this.setState({comments:data});
}

  shareVew(){
    let shareOptions = {
      title: "Download Vews",
      message: "download vews",
      url: "http://getvew.com/?vid=" + this.props.vewID,
      subject: "go there and watch" //  for email
    };
    Share.open(shareOptions);
  }

render(){
 //let username = this.state.username;
 let comments = this.state.commentsOpen ? this.renderComments() : null;
 let vidPath = this.props.videoPath;

return(
  <View style={styles.scrollView}>

  <View style={styles.overlay}>

  <Video source={{uri: vidPath}} // Can be a URL or a local file.
         rate={1.0}                   // 0 is paused, 1 is normal.
         volume={1.0}                 // 0 is muted, 1 is normal.
         muted={false}                // Mutes the audio entirely.
         paused={this.state.paused}               // Pauses playback entirely.
         resizeMode="cover"           // Fill the whole screen at aspect ratio.
         repeat={true}                // Repeat forever.
         style={styles.backgroundVideo} />
         </View>

         <View style={[styles.overlay2]} >

         <View style={styles.commentsToggle}>
         <TouchableOpacity onPressIn={this.toggleComments.bind(this)} >
         <Text style={{color:'#eee',fontSize:20}}>Comments ({this.state.comments.length})</Text>
         </TouchableOpacity>
         </View>
          {comments}

        </View>

        {this.renderButtons()}
         </View>
)}


  renderButtons(){
    if(!this.state.hideButtons){
      return(<View style={styles.overlay}>
        <TouchableOpacity onPressIn={this.goBack.bind(this)} style={{width:100,height:60,alignItems:'center',justifyContent:'center',zIndex:99999,backgroundColor:0,position:'absolute',top:5,left:0}}>
          <Text style={styles.backButton}>
            [back]
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPressIn={this.shareVew.bind(this)} style={{width:100,height:60,alignItems:'center',justifyContent:'center',zIndex:99999,backgroundColor:0,position:'absolute',right:5,top:5}}>
          <Text style={styles.shareButton}>
            [link]
          </Text>
        </TouchableOpacity>
         {this.deleteButton()}
        </View>
      )
    }
    else{
      return
    }
  }

  deleteButton(){
    if(this.props.thumb){
    return(
      <TouchableOpacity onPressIn={this.delete.bind(this)} style={{width:100,height:60,alignItems:'center',justifyContent:'center',backgroundColor:0,position:'absolute',bottom:0,right:0}}>
        <Text style={styles.deleteButton}>[delete]</Text>
      </TouchableOpacity>
    );
    }
    return;
  }

  toggleComments(){
    this.setState({commentsOpen: !this.state.commentsOpen});
  }

  submitComment(){
    Meteor.call('addComment',{vewID:this.props.vewID,comment:this.state.newComment,username: this.props.username},this.postCommentCallback.bind(this));
  }

  postCommentCallback(){
      this.getComments();
      this.setState({newComment:''})
  }

  renderComments(){
      let Arr = this.state.comments.map((current, i) => {
        return(
          <View key={i + 'comment'}>
            <Text style={{fontSize:16,color:'#eee'}}>{current.username}: {current.comment}</Text>

          </View>
          )
        }
      );
      return(
        <KeyboardAwareScrollView>
        <View style={styles.commentsBlock}>
          {Arr}
          <View style={{flex:1,flexDirection:'row'}}>


          <TextInput style={styles.input}
            onChangeText={(newComment) => this.setState({newComment})}
            placeholder="type stuff here..."
            value={this.state.newComment}
            >
          </TextInput>



          </View>
          <TouchableOpacity onPress={this.submitComment.bind(this)} style={styles.submitButton}>
              <Text style={{alignSelf:'center',fontSize:20,color:'rgba(230,250,230,.8)'}}>send</Text>
          </TouchableOpacity>



        </View>
        </KeyboardAwareScrollView>

        );
        //var source =

  }

  delete(){

  //  this.setState({paused:true});
    RNFS.unlink(this.props.thumb)
    .then(() => {
      console.log('FILE DELETED');

  })
 // `unlink` will throw an error, if the item to unlink does not exist
  .catch((err) => {
    console.log(err.message);
    });

    RNFS.unlink(this.props.videoPath)
    .then(() => {
      console.log('FILE DELETED');
      this.props.navigator.pop();
      this.props.deleteVew(this.props.vewID);


  })
 // `unlink` will throw an error, if the item to unlink does not exist
  .catch((err) => {
    console.log(err.message);
    });

  }

  goBack(){
      this.props.navigator.pop();
  }


}

var styles = StyleSheet.create({
  scrollView:{
    backgroundColor:'black'
  },
  overlay:{
    position:'absolute',
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    zIndex:0,
    flex:1
  },
  overlay2:{
    position:'relative',
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width *2/3,
    zIndex:800,
    top:10,
    //flex:1,
  //  justifyContent:'flex-start',
    alignItems:'center',
    alignSelf:'center'

  },
  fullScreen:{
    position:'relative',
    height:Dimensions.get('window').height * 2,
    width:Dimensions.get('window').width,
    zIndex:0,
    flex:1,
    //top:Dimensions.get('window').height
  },
  commentsToggle:{
    backgroundColor: 'rgba(60, 56, 80,.3)',
    height:40,
    width:150,
    borderRadius:5,

    alignItems:'center',
    justifyContent:'center',
    marginBottom:5
  }
  ,
  commentsBlock:{
    position:'relative',
  //  height:Dimensions.get('window').height * 2,
    width:Dimensions.get('window').width*2/3,
    zIndex:0,
    backgroundColor: 'rgba(60, 56, 80,.3)',
    top:0,
    padding:15,
    //borderColor: 'rgba(180, 180, 255,.1)',
  //  borderWidth: 10,
    borderRadius: 5,


  },
  comments:{
    color:'rgba(240, 240, 250,1)',
    fontSize:20,

  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  deleteButton: {
    fontSize:30,
    height:50,
    width:130,
    position:'absolute',
    fontWeight:'bold',
    color: '#999999',
    bottom:0,
    right:0
},
shareButton: {
  position:'absolute',
  color: '#999999',
  right:0,
  top:0,

  fontSize:30,
  fontWeight:'bold',
  height:70,
  width:80,
//  flex:1
},
miniSquare: {
    width: 25,
    height: 25,
    backgroundColor: '#E8BA45',
    borderWidth:5,
    borderColor:'#FF5D3B',
    margin:2,
    borderRadius:1
},
uploadButton: {
  //flex: 1,
  position:'absolute',
  borderRadius: 3,
  color: '#000',
  padding: 10,
//  margin: 40,
  bottom:10,
  right:10,
  fontSize:40,
  fontWeight:'bold',
  width:170,
  height:100,
  zIndex:9
//  flex:1
},
input: {
  color:'rgba(240, 240, 250,1)',
//  width: 300,
  fontSize: 18,
  height: 40,
  //padding: 10,
  backgroundColor: 'rgba(240, 240, 250,.2)',
//  borderColor: '#888888',
  borderRadius: 5,
//  marginTop: 10,
 // marginBottom: 10,
  textAlign:'center',
//  alignSelf:'center',
  flex:4
},
submitButton:{
  backgroundColor: 'rgba(50,220,120,.5)',
  borderRadius:5,
  justifyContent:'center',
  alignItems:'center',
  borderWidth:2,
  marginTop:10,
  borderColor: 'rgba(50,220,120,.7)',
  height:50,
  zIndex:99999
}
});

reactMixin(CapturePlayer.prototype,TimerMixin);
