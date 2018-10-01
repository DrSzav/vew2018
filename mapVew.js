'use strict';
/* eslint no-console: 0 */
import resolveAssetSource from 'resolveAssetSource';
import React, { Component } from 'react';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import {
  AppRegistry,
  TouchableOpacity,
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import RNFS from 'react-native-fs';
const thumbnailFolder = RNFS.DocumentDirectoryPath + '/vewCollection/thumbnails';
const accessToken = 'pk.eyJ1IjoiZHJzemF2IiwiYSI6ImNpcnZjMGljNTBpbGpmZm04eTVqamxzYnEifQ.M9EzE1kvwpnsWgQx1mfLLw';
Mapbox.setAccessToken(accessToken);

export default class VewsMap extends Component {
  state = {
    center: [
       
       -92.97686958312988,
       45.72052634
    ],
    zoom: 2,
    userTrackingMode: Mapbox.UserTrackingModes.Follow,
    thumbnails:[],
    seenIDs:[],
    annotations:[],
    points:[]

      };

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };
  onRegionWillChange = (location) => {
    console.log('onRegionWillChange', location);
  };
  onUpdateUserLocation = (location) => {
    console.log('onUpdateUserLocation', location);
  };
  onOpenAnnotation = (annotation) => {
    //console.log('onOpenAnnotation', annotation);
    this.props.navigator.replace({index:4});
  };
  onRightAnnotationTapped = (e) => {
    console.log('onRightAnnotationTapped', e);
  };
  onLongPress = (location) => {
    console.log('onLongPress', location);
  };
  onTap = (location) => {
    console.log('onTap', location);
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
    console.log('onChangeUserTrackingMode', userTrackingMode);
  };



  componentDidMount = () =>{
    this.pointsRecieved();
   // Mapbox.userTrackingModes.follow;
    //this.updateAnnotations();
  }

  pointsRecieved = () =>{
    if(this.state.points != this.props.points){
      this.state.points = this.props.points;
      this.updateAnnotations();
    }

  }
  componentWillReceiveProps = (newProps) =>{
    this.pointsRecieved();
    if(newProps.mapCenter){
      //this.setState({zoom:15});
      this.setState({userTrackingMode: Mapbox.UserTrackingModes.None})
    //  this._map.easeTo(newProps.mapCenter,false);
    this._map.flyTo([newProps.mapCenter.longitude,newProps.mapCenter.latitude],50);
    }
    if(newProps.userFollow){

      this.setState({userTrackingMode: Mapbox.UserTrackingModes.follow})

    }
      //this._map.easeTo();
      //this.setState({userTrackingMode: Mapbox.userTrackingMode.follow})
    //console.log('ya boi');
  }


  updateAnnotations = () => {
    var points = this.state.points;
    var annoList = [];
    for(var i = 0; i < points.length; i++){
      if(this.state.seenIDs.indexOf(points[i]._id) == -1){
      let anno = {};
      anno.type = 'point';
  //    anno.title = 'hey';
  //    anno.subtitle = 'yo';
      anno.coordinates = [points[i].location.coordinates[0],points[i].location.coordinates[1]];
      anno.id = points[i]._id;
      anno.annotationImage= {
        source: {uri:'vewPoint'},
        height: 25,
        width: 25
      };

      annoList.push(anno);
    }
    }
    this.setState({annotations:annoList});

  }

  renderAnnotations () {
    
 let arr = this.state.annotations.map(anno => {
      return <Mapbox.PointAnnotation
      key={anno.id}
      id={anno.id}

      coordinate={anno.coordinates}>
        <Image source={{uri: 'vewPoint'}}  style={{width: 25, height: 25}}/>
      </Mapbox.PointAnnotation>
    });
    return (
      <View>{arr}</View>
    )
  }


  addNewMarkers = () => {
    // Treat annotations as immutable and create a new one instead of using .push()

  }

  goBack() {
    this.props.navigator.pop();
  }



  render() {
    StatusBar.setHidden(true);

    return (
      <View style={styles.container}>
        <Mapbox.MapView
          ref={map => { this._map = map; }}
          style={styles.map}
         // centerCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          styleURL={Mapbox.StyleURL.Satellite}
          userTrackingMode={this.state.userTrackingMode}
          annotations={this.state.annotations}
          annotationsAreImmutable={false}
          onTap={this.onTap}
          logoEnabled={false}
        >
        {this.renderAnnotations()}
        </Mapbox.MapView>
        <TouchableOpacity style={styles.backButtonHolder} onPressIn={this.goBack.bind(this)} ><Text style={styles.backButton}>[back]</Text></TouchableOpacity>
      </View>
    );
    this._map.setPitch(45, animated = true, callback);
  }

  gotoMenu(){
    this.props.navigator.pop();
  }

  gotoCapture(){
    this.props.navigator.replace({index:4});
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  backButtonHolder:{
      height:50,
      width:100,
      //backgroundColor:'red',
      position:'absolute',
      left:5,
      top:5,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:5,
      backgroundColor: 'rgba(60, 56, 80,.4)',
      zIndex:99999,

  },

  backButton: {
    fontSize:30,

    position:'relative',
    fontWeight:'bold',
    color: '#ddd',
    width:100,
    height:40,

    alignSelf:'center',
},
  captureButton: {
    //flex: 1,
    position:'absolute',
    backgroundColor: '#7D70E8',
    borderRadius: 5,
    color: '#000',
    padding: 7,
    right: Dimensions.get('window').width/2 - 130,
     //margin: 40,
    bottom:7,
    //right:10,
    fontSize:40,
    fontWeight:'bold',
    zIndex:9
  //  flex:1
  }
});
