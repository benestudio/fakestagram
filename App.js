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
  Dimensions,
} from 'react-native';
import firebase from 'react-native-firebase';

const { width, height } = Dimensions.get('window');

const Post = ({photo}) => {
  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} resizeMode="cover" source={{ uri: photo.uri }} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{photo.title}</Text>
        <Text style={styles.likes}>&hearts; {photo.likes}</Text>
      </View>
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
      const { uri, likes, title } = doc.data();
      photos.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        title,
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
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Fakestagram</Text>
        </View>
        <FlatList
          data={this.state.photos}
          renderItem={({ item }) => <Post photo={item}/>}
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
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width,
    height: 345,
    padding: 25,
    marginTop: 20,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: 300,
    // height: 300,
    marginBottom: 5,
  },
  textContainer: {
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  headerContainer: {
    width,
    height: Platform.OS === 'ios' ? 70 : 50,
    backgroundColor: '#fefefe',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
