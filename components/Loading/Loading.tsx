import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

interface VideoSplashScreenProps {
  onFinish: () => void;
}

const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onFinish }) => {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

      if(videoRef.current)
       {
          await videoRef.current.playAsync();
        }
      }
        catch(err)
        {
          console.warn(err);
        }
    
  };
    
    prepare();
  }, []);

  const handleVideoEnd = async () => {
    await SplashScreen.hideAsync();
    onFinish();
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source = {require('../../assets/animations/NewLoading.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            handleVideoEnd();
          }
        }}
        useNativeControls={false}
      />
    </View>
  );
};

// Keep existing styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
});

export default VideoSplashScreen;
