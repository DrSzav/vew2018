// RNPasswordExample/app/SignOut.js

import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { Component } from 'react';

import Meteor from 'react-native-meteor';
const { width } = Dimensions.get('window');

class SignOut extends React.Component {
  render() {
    return (
      <View style={styles.container}>    
        <TouchableOpacity style={styles.button} onPress={() => Meteor.logout()}>
          <Text style={styles.buttonText}>Log Out?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigator.pop()}>
          <Text style={styles.buttonText}>Nahhh!!!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const ELEMENT_WIDTH = width - 40;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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

export default SignOut;
