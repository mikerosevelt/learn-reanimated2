import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useCallback } from 'react';
import ColorPicker from '../components/ColorPicker';
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
const COLORS = [
  'red',
  'purple',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'black',
  'white'
];

const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const PICKER_WIDTH = width * 0.9;

export default function App() {
  const pickedColor = useSharedValue<string | number>(COLORS[0]);

  const onColorCHanged = useCallback((color: string | number) => {
    'worklet';
    pickedColor.value = color;
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value
    };
  });

  return (
    <>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.circle, rStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
          maxWidth={PICKER_WIDTH}
          onColorCHanged={onColorCHanged}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 2,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    backgroundColor: 'CIRCLE_SIZE',
    borderRadius: CIRCLE_SIZE / 2
  },
  gradient: {
    height: 40,
    width: PICKER_WIDTH,
    borderRadius: 20
  }
});
