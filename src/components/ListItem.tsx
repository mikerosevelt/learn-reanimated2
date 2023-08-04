import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TaskInterface } from '../screens/SwipeToDelete';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { FontAwesome5 } from '@expo/vector-icons';

interface ListItemProps
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: TaskInterface;
  onDismiss: (task: TaskInterface) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const LIST_ITEM_HEIGHT = 70;
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

const ListItem: React.FC<ListItemProps> = ({
  task,
  onDismiss,
  simultaneousHandlers
}) => {
  const translationX = useSharedValue(0);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translationX.value = event.translationX;
    },
    onEnd: () => {
      const shouldBeDismissed = translationX.value < TRANSLATE_X_THRESHOLD;
      itemHeight.value = withTiming(0);
      if (shouldBeDismissed) {
        translationX.value = withTiming(-SCREEN_WIDTH);
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (isFinished) => {
          runOnJS(onDismiss)(task);
        });
      } else {
        translationX.value = withTiming(0);
      }
    }
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX.value
      }
    ]
  }));

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      translationX.value < TRANSLATE_X_THRESHOLD ? 1 : 0
    );
    return { opacity };
  });

  const rTaskContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value
    };
  });

  return (
    <Animated.View style={[styles.taskContainer, rTaskContainerStyle]}>
      <Animated.View style={[styles.iconContainer, rIconContainerStyle]}>
        <FontAwesome5
          name="trash-alt"
          size={LIST_ITEM_HEIGHT * 0.4}
          color="red"
        />
      </Animated.View>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panGesture}
      >
        <Animated.View style={[styles.task, rStyle]}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  taskContainer: {
    width: '100%',
    alignItems: 'center'
  },
  task: {
    width: '90%',
    height: LIST_ITEM_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 20,
    backgroundColor: 'white',
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowRadius: 10,
    elevation: 5
  },
  taskTitle: {
    fontSize: 16
  },
  iconContainer: {
    height: LIST_ITEM_HEIGHT,
    width: LIST_ITEM_HEIGHT,
    position: 'absolute',
    right: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
