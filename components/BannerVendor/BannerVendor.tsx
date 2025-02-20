import React, { useRef } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Video, ResizeMode } from "expo-av";

const BannerVendor = () =>{
    const videoRef = useRef<Video | null>(null);
    return (
        <View style={styles.card}>
            <Video
                ref={videoRef}
                source={ require('../../assets/animations/Monkey.mp4')}
                rate={1.5}
                isMuted={true}
                resizeMode={ResizeMode. COVER}
                shouldPlay
                isLooping
                style={styles.video}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    card:{
          flexDirection: 'row',
          margin: 1,
          backgroundColor: '#fff',
          borderRadius: 16,
          overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
    },

    video:{
        //flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginLeft: 0,
        width: '100%',
        height: 400,
        resizeMode: 'cover',
        
    },


});

export default BannerVendor;