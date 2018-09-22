// RNPasswordExample/app/SignIn.js
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View,
      TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import React ,{ Component } from 'react';
import Meteor ,{ Accounts } from 'react-native-meteor';
const { width } = Dimensions.get('window');

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      username: '',
      error: null, // added this
      createAccount:false,
      signIn:true
    };
  }

  resetLogin(){
    this.setState({createAccount:false})

  }

  renderInputs(){
    if(this.state.createAccount){
    return(
  <View style={{height:180,alignItems:'center'}}>

    <View style={styles.inputView}><TextInput
        style={styles.input}
        onChangeText={(email) => this.setState({email})}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      /></View>

      <View style={styles.inputView}><TextInput
        style={styles.input}
        onChangeText={(password) => this.setState({password})}
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
      />

      <View style={styles.inputView}><TextInput
          style={styles.input}
          onChangeText={(username) => this.setState({username})}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        /></View>

      </View>


      </View>
    );
  }

  if(this.state.signIn){
    return(
      <View style={{height:120,alignItems:'center',marginTop:50}}>

        <View style={styles.inputView}><TextInput
            style={styles.input}
            onChangeText={(email) => this.setState({email})}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          /></View>

          <View style={styles.inputView}><TextInput
            style={styles.input}
            onChangeText={(password) => this.setState({password})}
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
          /></View>
          </View>

    )

  }


  }

  renderUsernameInput(){
    if(this.state.createAccount){
    return(
    <View style={styles.inputView}><TextInput
        style={styles.input}
        onChangeText={(username) => this.setState({username})}
        placeholder="username"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      /></View>
    )
  }

  }

  isValid() {
    const { email, password, username } = this.state;
    let valid = false;

    if (email.length > 0 && password.length > 0) {
      valid = true;
    }

    if (email.length === 0) {
      this.setState({ error: 'You must enter an email address' });
    } else if (password.length === 0) {
      this.setState({ error: 'You must enter a password' });
    }

    return valid;
  }

  onSignIn() {
     const { email, password } = this.state;

     if (this.isValid()) {
       Meteor.loginWithPassword(email, password, (error) => {
         if (error) {
           this.setState({ error: error.reason });
         }
       });
     }
   }

   onCreateAccount() {
     const { email, password } = this.state;

     if(!this.state.createAccount){
     this.setState({createAccount:true});
      }
      else{
     if (this.isValid()) {
       Accounts.createUser({ email, password }, (error) => {
         if (error) {
           this.setState({ error: error.reason });
          Toast.show(this.gettingToast);
         } else {
           this.onSignIn(); // temp hack that you might need to use
         }
       });
     }
   }
   }

  render() {
  return (
    <View style={{flexDirection:'column'}}>
      <View style={{flexDirection:'row',height:80,alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:50,fontWeight:'bold',color:'black',margin:10}}>Vew</Text>
        {/*<View style={styles.diamond}></View> */}
      </View>

    {this.renderInputs()}

      <View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <View style={{flex:1}}></View>
      <View style={{flex:3}}>
      <TouchableOpacity style={styles.button} onPress={this.onSignIn.bind(this)}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex:1}}></View>
      <View style={{flex:3}}>
        <TouchableOpacity style={styles.button} onPress={this.onCreateAccount.bind(this)}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex:1}}></View>
      </View>
    </View>
  )
  }
}


const ELEMENT_WIDTH = width - 40;
const styles = StyleSheet.create({
  container: {
    height: 300,
    flexDirection: 'column',
  //  justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#BAA6FF',
  //  height:Dimensions.get('window').height + 300,
  },
  input: {
    height:35,
    width: 200,
    fontSize: 20,

    color:'#57AAD9',
    //padding: 10,
  //  backgroundColor: '#FFFFFF',
    borderColor: '#888888',

  //  marginTop: 2,
    //marginBottom: 2,
    textAlign:'center',
     },

     inputView:{

       borderBottomColor: '#57AAD9',
       borderBottomWidth: 2,

       height:35
     },

    button:{
    backgroundColor: '#FF99EA',
    borderRadius:5,
  //  width: 200,
    padding: 10,
    alignItems: 'center',
    marginTop:10,
  },

  buttonText: {
  //  height:30,
    color: '#777777',
    fontWeight: '500',
    fontSize: 16,
    textDecorationLine:'underline'

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

});

export default SignIn;
