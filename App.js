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
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(
          this.state.emailValue,
          this.state.passwordValue
        );
      console.log(response);
      this.setState({
        loggingIn: false,
        emailValue: '',
        passwordValue: '',
        hasError: false,
        error: '',
      });
    } catch (error) {
      console.log(error);
      this.setState({
        loggingIn: false,
        error: error.toString(),
        hasError: true,
      });
    }
    this.setState({
      loggingIn: false,
    });
  };

  onChangeLogin = (e, type) => {
    this.setState({ [`${type}Value`]: e });
  };

  render() {
    if (this.state.loading) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Fakestagram</Text>
          {this.state.user && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => firebase.auth().signOut()}>
              <Text>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.user ? (
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
            loggingIn={this.state.loggingIn}
            hasError={this.state.hasError}
            errorMessage={this.state.error}
            onPress={() =>
              this.setState(state => ({ loggingIn: true }), this.onLogin)
            }
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.loggedIn,
  posts: state.posts.data,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
