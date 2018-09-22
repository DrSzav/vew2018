import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import { Text,ScrollView,View, Navigator,AppRegistry ,TouchableOpacity,StyleSheet } from 'react-native';

//import Triangle from 'react-native-triangle';

export default class VewsMenu extends Component {

  constructor(){
     super();
     this.state = {};
   }



createButton(){
  this.props.navigator.push({index:1 ,sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
  gestures: null })
}

discoverButton(){
  this.props.navigator.push({index:3})
}

gotoCapture(){
  this.props.navigator.push({index:4})
}

collectButton(){
  this.props.navigator.replace({index:6})
}

  render() {
//  <Text style={{fontSize:35,fontWeight:'bold',textAlign:'center'}}>V E W S</Text>
    return (
      <ScrollView contentContainerStyle={{paddingBottom:100}}>
      <View style={{flexDirection:'column',flexDirection:'column',flex:1,alignItems:'center',justifyContent:'center',padding:0,zIndex:-9 }}>

      <Text style={{fontSize:50,fontWeight:'bold'}}>Vew</Text>
      
      <View style={{marginTop:20,marginBottom:40}}>
      <Text style={{fontSize:30,fontWeight:'bold'}}>Account</Text>
      <Text style={{fontSize:20,fontWeight:'bold'}}>Username: {this.props.username}</Text>
      <Text style={{fontSize:20,fontWeight:'bold'}}>Email: {this.props.email}</Text>
      <TouchableOpacity style={styles.button} onPress={() => Meteor.logout()}>
          <Text style={styles.buttonText}>Log Out?</Text>
        </TouchableOpacity>
       
      </View>
        <Text style={{fontSize:30,fontWeight:'bold'}}>how to vew:</Text>
      <View style={{flex:1,flexDirection:'column',alignItems:'center'}}>
     
        <View style={{flex:1,margin:10,flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Diamond/>
        
        <Text style={{width:300,padding:15}}>
        Vew's Map. Find Vews around you and around the globe</Text>
        </View>

        <View style={{flex:1,margin:10,flexDirection:'row',justifyContent:'center',alignItems:'center'}} >
          <View style={{justifyContent:'center'}}>
              <View style={{flexDirection:'row',justifyContent:'center'}}>
              <MSquare style={{}}/><MSquare style={{}}/>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center'}}>
              <MSquare style={{flex:1}}/><MSquare style={{flex:1}}/>
              </View>
          </View>
          <Text style={{width:300,padding:8}}>
            Gallery. View your collection.</Text>
          </View>
          <View  style={{flex:1,margin:10,flexDirection:'row',justifyContent:'center',alignItems:'center'}} ><Circle/>
          <Text style={{width:300,padding:12}}>
            Record. Record a new Vew at your current location, only downloadable at that position.</Text>
          </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => Meteor.logout()}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    );
  }


}

const styles = StyleSheet.create({
  diamond: {
      width: 45,
      height: 45,
      backgroundColor: '#7D70E8',
      borderWidth:5,
      borderColor:'#45CDFF',
      borderRadius:3,
    //  marginBottom:12,
      transform: [{rotate: '45deg'}],
    //  alignSelf:'flex-end'
  },
  miniSquare: {
      width: 25,
      height: 25,
      backgroundColor: '#E8BA45',
      borderWidth:5,
      borderColor:'#FF5D3B',
      margin:2,
      borderRadius:3
  },
  portait:{
    flex:3,
    alignItems:'flex-end',
    flexDirection:'row'
  },
  landscape:{
    flex:3,
    alignItems:'center',
    flexDirection:'row'
  },

  bigFont: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign:'center',
  //  marginTop:20,    alignSelf:'center',
   alignSelf:'center',
  },
  one: {
    flex: 1,
  },
  circle:{
        justifyContent:'center',
        alignItems:'center',
        width: 50,
        height: 50,
      //  marginBottom:50,
        borderRadius: 100/2,
        backgroundColor: '#FF5D3B',
        borderWidth:5,
        borderColor:'#E8BA45'
  },
  backButton: {
    //flex: 1,
    position:'absolute',
    backgroundColor: '#45CDFF',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 0,
    bottom:10,
    left:10,
    fontSize:20,
    fontWeight:'bold'
  //  flex:1
  },
  button:{
    backgroundColor: '#FF99EA',
    borderRadius:10,
  //  width: 200,
    padding: 10,
    alignItems: 'center',
    marginTop:10,
  },
  
  buttonText: {
  //  height:30,
    color: '#555555',
    fontWeight: '500',
    fontSize: 16,
    //textDecorationLine:'underline'
  
  }
});

var Circle = createReactClass({
    render: function() {
        return (
            <View style={styles.circle} />
        )
    }
})

var MSquare = createReactClass({
    render: function() {
        return (
            <View style={styles.miniSquare} />
        )
    }
})

var Diamond = createReactClass({
    render: function() {
        return (
            <View style={styles.diamond} />
        )
    }
})
