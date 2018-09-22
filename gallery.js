import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Dimensions

} from 'react-native';
import Meteor from 'react-native-meteor';
const vewsFolder = RNFS.DocumentDirectoryPath + '/vewCollection/videos'
const thumbnailFolder = RNFS.DocumentDirectoryPath + '/vewCollection/thumbnails'
import RNFS from 'react-native-fs';
import GridView from 'react-native-super-grid'

export default class gallery extends Component {

  constructor() {
    super();
    this.state = {thumbnails:[]};

  }

  componentWillMount() {
  //  this.setState({thumbnails:this.props.thumbnails});
    this.receiveThumbnails();
  }

  componentWillReceiveProps(){
    this.receiveThumbnails();
    //console.log('ya boi');
  }

  receiveThumbnails(){
      if(this.props.thumbnails){
      this.setState({thumbnails:this.props.thumbnails})
      }
    }
//aka vew ID
  loadVew(thumbnailName){
    let thumbPath = thumbnailFolder + '/' + thumbnailName;
    let vewID = thumbnailName.slice(0,-4);
    let vidPath = vewsFolder + '/' + vewID + '.mov';
    this.props.navigator.push({index:5,mode:'gallery',vidPath:vidPath,thumb:thumbPath,vewID:vewID});
  }

  renderThumbnails(thumbnail, index) {
    return (<TouchableOpacity style={styles.clickableIamge} key={'button' + index} onPress={this.loadVew.bind(this,thumbnail.name)}>
      <Image key={index} resizeMode='cover' style={styles.imageStyle} source={{uri:thumbnail.path}}/>

      </TouchableOpacity>)
  }

  render() {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      {this.renderEmpty()}
      <GridView items={this.state.thumbnails}
                itemDimension={150}
                //itemsPerRow={3}
                renderItem={this.renderThumbnails.bind(this)}
                style={styles.container}
                enableEmptySections={true}
      />

      </View>
    );
  }

  renderEmpty(){
    if(!this.state.thumbnails){
      return <Text style={styles.bigFont}>[loading]</Text>
    }
    if(this.state.thumbnails.length == 0){
      return(<Text style={styles.bigFont}>no vewz :(</Text>)
    }
    if(this.state.thumbnails.length == 1){
      return(<Text style={styles.bigFont}>1 vew :)</Text>)
    }
    return(<Text style={styles.bigFont}>{this.state.thumbnails.length} vewz</Text>);
  }

  gotoMenu(){
    this.props.navigator.replace({index:0});
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  clickableIamge:{
  //  width: 160,
//    height: 160,
  //  backgroundColor:'black'
  },
  imageStyle: {
    flex:1,
    width: 160,
    height: 160,
    margin: 10,
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
bigFont: {
  fontWeight: 'bold',
  fontSize: 40,
  textAlign:'center',
  marginTop:0,
  marginBottom:0,
  //:'center',
//  marginTop:20,    alignSelf:'center',
  alignSelf:'center',
},
});

//AppRegistry.registerComponent('Example', () => Example);
