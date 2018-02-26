import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';

import Login from './src/screens/Login';
import Post from './src/screens/Post';
import { styles } from './styles';
import { loginUser, logoutUser } from './src/actions/auth';
import { addPost, fetchPosts } from './src/actions/posts';

class App extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('posts');
    this.firestoreUnsubscriber = null;
    this.authUnsubscriber = null;
    this.state = {
      posts: [],
      loading: true,
      loggingIn: false,
      user: null,
      emailValue: '',
      passwordValue: '',
      hasError: false,
      error: '',
    };
  }

  componentDidMount() {
    this.authUnsubscriber = firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
    this.firestoreUnsubscriber = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    if (this.authUnsubscriber) {
      this.authUnsubscriber();
    }
    if (this.firestoreUnsubscriber) {
      this.firestoreUnsubscriber();
    }
  }

  onCollectionUpdate = querySnapshot => {
    const posts = [];
    querySnapshot.forEach(doc => {
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
  };

  addRandomPost = () => {
    this.ref.add({
      title: 'Added post by random button',
      likes: Math.floor(Math.random() * 10 + 1),
      uri: `https://picsum.photos/200/300?image=${Math.floor(
        Math.random() * 100 + 1
      )}`,
    });
  };

  onLogin = async () => {
    try {
      const response = await this.props.loginUser(
        this.state.emailValue,
        this.state.passwordValue
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  onLogout = async () => {
    try {
      await this.props.logoutUser();
    } catch (error) {
      console.log(error);
    }
  };

  onChangeLogin = (e, type) => {
    this.setState({ [`${type}Value`]: e });
  };

  render() {
    if (this.props.auth.isFetching) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Fakestagram</Text>
          {this.props.auth.loggedIn && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={this.onLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.props.auth.loggedIn ? (
          <FlatList
            data={this.state.posts}
            renderItem={({ item }) => <Post post={item} />}
            ListFooterComponent={
              <Button
                title="Add random post"
                onPress={() => this.addRandomPost()}
              />
            }
          />
        ) : (
          <Login
            emailValue={this.state.emailValue}
            passwordValue={this.state.passwordValue}
            onChange={(e, type) => this.onChangeLogin(e, type)}
            loggingIn={this.props.auth.isFetching}
            hasError={this.props.auth.hasError}
            errorMessage={this.props.auth.errorMessage}
            onPress={this.onLogin}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  posts: state.posts,
});

const mapDispatchToProps = {
  loginUser,
  logoutUser,
  addPost,
  fetchPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
