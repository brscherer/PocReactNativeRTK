import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useGetPokemonByNameQuery } from '../../services/pokemon';

export default function Pokemon() {
  const { data, error, isLoading } = useGetPokemonByNameQuery('charizard');

  console.log('Pokemon data:', data);
  console.log('Pokemon error:', error);


  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Oh no, there was an error</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.species.name}</Text>
      <Image
        source={{ uri: data.sprites.front_shiny }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  image: {
    width: 150,
    height: 150,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
