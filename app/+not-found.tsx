import { Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import VideoCard from "../components/VideoBanner/VideoBanner";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.text}>
            We are still working
          </ThemedText>
          <ThemedText type="title" style={styles.textCenter}>
          on this, Sorry :)
          </ThemedText>      
      <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20}}>
      <VideoCard />
      </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.link}>
          <Text style={{color: 'blue', fontWeight:'bold', fontSize: 16}}>Take me Back!</Text>
        </TouchableOpacity>
      </ThemedView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text:
  {
    textAlign: 'center',
    color: '#ff6f61',
    
  },

  textCenter:{
    color: '#ff6f61',
    textAlign: 'center',

  },

  link: {
    marginTop:10,
    textAlign: 'center',
    paddingVertical: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
