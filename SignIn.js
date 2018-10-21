// RNPasswordExample/app/SignIn.js
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View,
      TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import React ,{ Component } from 'react';
import Meteor ,{ Accounts ,createContainer, connectMeteor } from 'react-native-meteor';
import Toast from 'react-native-root-toast';
const { width } = Dimensions.get('window');


@connectMeteor
class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      forgottenPassword:false,
      email: '',
      password: '',
      username: '',
      error: null, // added this
      createAccount:false,
      signIn:true
    };
  }

  Nevermind(){
    this.setState({forgottenPassword:false});
    this.setState({createAccount:false});
  }

  renderInputs(){
    if(this.state.forgottenPassword){
      return(
      <View style={{height:180,justifyContent:'center',alignItems:'center'}}>

        <View style={styles.inputView}><TextInput
            style={styles.input}
            onChangeText={(email) => this.setState({email})}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          /></View>

      </View>
      )
    }



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

  resetPassword(){
      const {email}  = this.state;
      Accounts.forgotPassword( {email},this.resetPasswordCallback.bind(this) );
  }

  renderButtons(){

    if(this.state.forgottenPassword){
      return(
      <View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <View style={{flex:1}}></View>
      <View style={{flex:3}}>

      <TouchableOpacity style={styles.button} onPressIn={this.Nevermind.bind(this)}>
          <Text style={styles.buttonText}>Nevermind...</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex:1}}></View>
      <View style={{flex:3}}>
      <TouchableOpacity style={styles.button} onPressIn={this.resetPassword.bind(this)}>
        <Text style={styles.buttonText}>email me!</Text>
      </TouchableOpacity>



      </View>
      <View style={{flex:1}}></View>
      </View>
    )}
    if(this.state.createAccount){
      return(
      <View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <View style={{flex:1}}></View>
      <View style={{flex:3}}>


      <TouchableOpacity style={styles.button} onPressIn={this.Nevermind.bind(this)}>
          <Text style={styles.buttonText}>Nevermind...</Text>
        </TouchableOpacity>
      </View>



      <View style={{flex:1}}></View>

      <View style={{flex:3}}>

      <TouchableOpacity style={styles.button} onPressIn={this.onCreateAccount.bind(this)}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>



      </View>
      <View style={{flex:1}}></View>
      </View>
    )
    }
    return(
    <View style={{height:50,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
    <View style={{flex:1}}></View>
      <View style={{flex:3}}>
        <TouchableOpacity style={styles.button} onPressIn={this.onCreateAccount.bind(this)}>
          <Text style={styles.buttonText}>New Account</Text>
        </TouchableOpacity>
      </View>
    <View style={{flex:1}}></View>
    <View style={{flex:3}}>
      <TouchableOpacity style={styles.button} onPressIn={this.onSignIn.bind(this)}>
          <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
    <View style={{flex:1}}></View>
    </View>
    )
  }

  isValid() {
    const { email, password, username } = this.state;
    let valid = false;

    if (email.length > 3 && password.length > 3) {
      valid = true;
    }

    if (email.length === 0) {
      Toast.show('You must enter an email address');
    } else if (password.length === 0) {
      Toast.show('You must enter a password');
    }

    return valid;
  }

  onSignIn() {
     const { email, password } = this.state;

     if (this.isValid()) {
       Meteor.loginWithPassword(email, password,this.signInCallback.bind(this));
     }
   }

   signInCallback(error){

       if (error) {
         if(error.reason){
           Toast.show(error.reason);
         }
       }
       else{
         this.props.signIn();
       }

   }

   forgottenPassword(){
      this.setState({forgottenPassword:true});
   }

   resetPasswordCallback(e){
     if (e) {
         Toast.show(e.reason);
     } else {
       Toast.show('email sent');
       this.setState({forgottenPassword:false});
     }
   }

   onCreateAccount() {
      if(!this.state.createAccount){
        this.setState({createAccount:true});
        return;
      }

    const { email, password,username } = this.state;

     if (this.isValid()) {
       Accounts.createUser({ email, password,username },this.createUserCallback.bind(this));
     }
   }

   createUserCallback(error){
      //Toast.show('callback hit');
      if(error){
        if(error.reason){
        Toast.show(error.reason);
        }
      }
      else{
        const { email, password } = this.state;
         Meteor.loginWithPassword(email, password)
      }
   }

  render() {
  return (
    <KeyboardAwareScrollView>
    <TouchableOpacity style={styles.forgottenPasswordButton} onPressIn={this.forgottenPassword.bind(this)}>
        <Text style={styles.forgottenPasswordText}>I forgot my password...</Text>
      </TouchableOpacity>
    <View style={{flexDirection:'column'}}>

      <View style={{flexDirection:'row',height:80,alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:50,fontWeight:'bold',color:'#57AAD9',margin:10}}>Vew</Text>
        {/*<View style={styles.diamond}></View> */}

      </View>

    {this.renderInputs()}
    {this.renderButtons()}

    </View>
  </KeyboardAwareScrollView>
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
    height:45,
    width: 250,
    fontSize: 20,

    color:'#79CCFF',
    //padding: 10,
  //  backgroundColor: '#FFFFFF',
    borderColor: '#888888',

  //  marginTop: 2,
    //marginBottom: 2,
    textAlign:'center',
     },

     inputView:{

       borderBottomColor: '#57AAD9',
       borderBottomWidth: 1,

       height:35
     },

    button:{
    backgroundColor: '#FF99EA',
    borderRadius:10,
  //  width: 200,
    padding: 10,
    alignItems: 'center',
    marginTop:10,
  },
  forgottenPasswordButton:{
      position:'absolute',
      top:10,
      right:10,
      zIndex:999999
  },
  forgottenPasswordText:{
      color:'#777777',

  },

  buttonText: {
  //  height:30,
    color: '#555555',
    fontWeight: '500',
    fontSize: 16,
    //textDecorationLine:'underline'

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
