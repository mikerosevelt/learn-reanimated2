import { useCallback, useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  ImageBackground
} from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function App() {
  const scale = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(scale.value, 0) }]
  }));

  const doubleTapRef = useRef();

  const onDoubleTap = useCallback(() => {
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scale.value = withDelay(500, withSpring(0));
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <TapGestureHandler
        waitFor={doubleTapRef}
        onActivated={() => console.log('single tap')}
      >
        <TapGestureHandler
          maxDelayMs={250}
          ref={doubleTapRef}
          numberOfTaps={2}
          onActivated={onDoubleTap}
        >
          <Animated.View>
            <ImageBackground
              source={require('./assets/image.jpg')}
              style={styles.image}
            >
              <AnimatedImage
                source={require('./assets/like.png')}
                style={[styles.icon, rStyle]}
              />
            </ImageBackground>
          </Animated.View>
        </TapGestureHandler>
      </TapGestureHandler>
    </View>
  );
}

const { width: SIZE } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: SIZE,
    height: SIZE + 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: SIZE / 4,
    height: SIZE / 4,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: '#fff',
    shadowOpacity: 0.5
  }
});
