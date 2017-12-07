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
  Button,
} from 'react-native';
import firebase from 'react-native-firebase';

const { width, height } = Dimensions.get('window');

const Post = ({post}) => {
  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} resizeMode="cover" source={{ uri: post.uri }} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.likesContainer}>
          <Text style={styles.likes}>&hearts; {post.likes}</Text>
        </View>
      </View>
    </View>
  );
};

export default class App extends Component<{}> {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('posts');
    this.unsubscribe = null;
    this.state = {
      posts: [],
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
    const posts = [];
    querySnapshot.forEach((doc) => {
      const { uri, likes, title } = doc.data();
      posts.push({
        key: doc.id, // Document ID
        doc, // DocumentSnapshot
        title,
        uri,
        likes,
      });
    });
    this.setState({
      posts,
      loading: false,
   });
  }

  addRandomPost = () => {
    this.ref.add({
      title: 'Added post by random button',
      likes: Math.floor((Math.random() * 10) + 1),
      uri: `https://picsum.photos/200/300?image=${Math.floor((Math.random() * 100) + 1)}`,
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
          data={this.state.posts}
          renderItem={({ item }) => <Post post={item}/>}
        />
        <Button title="Add random post" onPress={() => this.addRandomPost()} />
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
    height: 315,
    padding: 25,
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
    alignContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
  },
  title: {
    flex: 4,
  },
  likesContainer: {
    flex: 1,
    justifyContent: 'center',
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
