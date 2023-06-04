import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface ColorPickerProps extends LinearGradientProps {
  maxWidth: number;
  onColorCHanged?: (color: string | number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  start,
  end,
  style,
  maxWidth,
  onColorCHanged
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const adjustTranslateX = useDerivedValue(() => {
    return Math.min(
      Math.max(translateX.value, 0),
      maxWidth - CIRCLE_PCIKER_SIZE
    );
  });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart: (_, context) => {
      context.x = adjustTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
      translateY.value = withSpring(-CIRCLE_PCIKER_SIZE);
      scale.value = withSpring(1.2);
    },
    onEnd: () => {
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    }
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
          scale: scale.value,
          translateY: translateY.value
        }
      ]
    };
  });

  const rInternalPickerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map(
      (_, index) => (index / colors.length) * maxWidth
    );

    const backgroundColor = interpolateColor(
      translateX.value,
      inputRange,
      colors
    );

    onColorCHanged?.(backgroundColor);

    return {
      backgroundColor
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View style={{ justifyContent: 'center' }}>
        <LinearGradient colors={colors} start={start} end={end} style={style} />
        <Animated.View style={[styles.picker, rStyle]}>
          <Animated.View
            style={[styles.internalPicker, rInternalPickerStyle]}
          />
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const CIRCLE_PCIKER_SIZE = 45;
const INTERNAL_PCIKER_SIZE = CIRCLE_PCIKER_SIZE / 2;

const styles = StyleSheet.create({
  picker: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: CIRCLE_PCIKER_SIZE,
    height: CIRCLE_PCIKER_SIZE,
    borderRadius: CIRCLE_PCIKER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  internalPicker: {
    width: INTERNAL_PCIKER_SIZE,
    height: INTERNAL_PCIKER_SIZE,
    borderRadius: INTERNAL_PCIKER_SIZE / 2,
    borderWidth: 1.0,
    borderColor: 'rgba(0,0,0,0.1)'
  }
});

export default ColorPicker;
