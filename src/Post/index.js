import React from 'react';
import { View, Text, } from 'react-native';
import { styles } from '../../styles';

const Post = ({ post }) => {
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

export { Post };
export default {};
