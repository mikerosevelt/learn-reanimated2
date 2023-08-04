import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface RippleProps extends React.PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  onTap?: () => void;
}

const Ripple: React.FC<RippleProps> = ({ style, onTap, children }) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);

  const aRef = useAnimatedRef<View>();
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const rippleOpacity = useSharedValue(1);

  const tapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (tapEvent) => {
        const layout = measure(aRef);
        width.value = layout.width;
        height.value = layout.height;

        centerX.value = tapEvent.x;
        centerY.value = tapEvent.y;

        rippleOpacity.value = 1;
        scale.value = 0;
        scale.value = withTiming(1, { duration: 1000 });
      },
      onActive: () => {
        if (onTap) runOnJS(onTap)();
      },
      onFinish: () => {
        rippleOpacity.value = withTiming(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    const cirleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);
    const translateX = centerX.value - cirleRadius;
    const translateY = centerY.value - cirleRadius;

    return {
      width: cirleRadius * 2,
      height: cirleRadius * 2,
      borderRadius: cirleRadius,
      backgroundColor: 'rgba(0,0,0,0.2)',
      opacity: rippleOpacity.value,
      position: 'absolute',
      top: 0,
      left: 0,
      transform: [
        { translateX },
        { translateY },
        {
          scale: scale.value
        }
      ]
    };
  });

  return (
    <View ref={aRef} style={style}>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View style={[style, { overflow: 'hidden' }]}>
          <View>{children}</View>
          <Animated.View style={rStyle} />
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default Ripple;

const styles = StyleSheet.create({});
