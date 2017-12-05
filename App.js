/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import firebase from 'react-native-firebase';

const Photo = ({photo}) => {
  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} resizeMode="cover" source={{ uri: photo.uri }} />
      <Text>Likes: {photo.likes}</Text>
    </View>
  );
};

export default class App extends Component<{}> {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('photos');
    this.unsubscribe = null;
    this.state = {
      photos: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const photos = [];
    querySnapshot.forEach((doc) => {
      const { uri, likes } = doc.data();
      photos.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        uri,
        likes,
      });
    });
    this.setState({
      photos,
      loading: false,
   });
  }

  render() {
    if (this.state.loading) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.photos}
          renderItem={({ item }) => <Photo photo={item}/>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  imageContainer: {
    width: 320,
    height: 220,
    padding: 5,
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 5,
  }
});
