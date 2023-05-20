import { StyleSheet, View } from 'react-native';
import PageScrollView, { PAGE_WIDTH } from '../components/PageScrollView';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useDerivedValue,
  useSharedValue,
  withDecay
} from 'react-native-reanimated';

const titles = ["what's", 'up', 'mobile', 'devs?'];

type Context = {
  x: number;
};

export default function App() {
  const translateX = useSharedValue(0);

  const clampedTranslateX = useDerivedValue(() => {
    const MAX_TRANSLATE_X = -PAGE_WIDTH * (titles.length - 1);

    return Math.max(Math.min(translateX.value, 0), MAX_TRANSLATE_X);
  });

  const panGentureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >({
    onStart: (_, context) => {
      context.x = clampedTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
    },
    onEnd: (event) => {
      translateX.value = withDecay({ velocity: event.velocityX });
    }
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGentureEvent}>
        <Animated.View style={{ flex: 1, flexDirection: 'row' }}>
          {titles.map((title, index) => {
            return (
              <PageScrollView
                key={index.toString()}
                translateX={clampedTranslateX}
                index={index}
                title={title}
              />
            );
          })}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
