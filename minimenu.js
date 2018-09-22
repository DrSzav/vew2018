import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import { Text,
  Dimensions,
  View, Navigator,AppRegistry ,TouchableOpacity,StyleSheet } from 'react-native';
//import Triangle from 'react-native-triangle';

export default class MiniMenu extends Component {

  constructor(){
     super();
     this.state = {menuOpen:false};
   }



createButton(){
  this.props.recordClick();
}

discoverButton(){
  this.props.navigator.push({index:4})
}

gotoCapture(){
//  this.props.navigator.push({index:1})
}

collectButton(){
  this.props.navigator.push({index:6})
}

  render() {
//  <Text style={{fontSize:35,fontWeight:'bold',textAlign:'center'}}>V E W S</Text>
    return (
      <View style={styles.mainBox} >
      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>

  <TouchableOpacity onPress={this.discoverButton.bind(this)} style={{flex:1,justifyContent:'center',alignItems:'center'}}><Diamond/></TouchableOpacity>
          <TouchableOpacity onPress={this.collectButton.bind(this)} style={{flex:1,justifyContent:'center'}}>
              <View style={{flexDirection:'row',justifyContent:'center'}}>
              <MSquare style={{}}/><MSquare style={{}}/>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center'}}>
              <MSquare style={{flex:1}}/><MSquare style={{flex:1}}/>
              </View>
          </TouchableOpacity>
        <TouchableOpacity onPress={this.createButton.bind(this)} style={{flex:1,justifyContent:'center',alignItems:'center'}} ><Circle/></TouchableOpacity>
      </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  mainBox :{
    //backgroundColor: 'rgba(170, 170, 170, 0.2)',
  //  borderColor: 'rgba(0,0, 0, .7)',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    padding:0,
    zIndex:-9,
    width:Dimensions.get('window').width,
    height:80,
    //borderWidth:5,
    borderRadius:60,
    alignSelf:'center',
    bottom:0
  },
  diamond: {
      width: 50,
      height: 50,
      backgroundColor: '#7D70E8',
      borderWidth:8,
      borderColor:'#45CDFF',
      borderRadius:1,
    //  marginBottom:12,
      transform: [{rotate: '45deg'}],
      marginLeft:10,

    //  alignSelf:'flex-end'
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
        width: 65,
        height: 65,
      //  marginBottom:50,
        borderRadius: 100/2,
        backgroundColor: '#FF5D3B',
        borderWidth:8,
        borderColor:'#E8BA45',
      //  marginRight:-20
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
