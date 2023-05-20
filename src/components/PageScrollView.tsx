import { Dimensions, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface Props {
  index: number;
  title: string;
  translateX: Animated.SharedValue<number>;
}

const { width: PAGE_WIDTH } = Dimensions.get('window');

const PageScrollView: React.FC<Props> = ({ index, title, translateX }) => {
  const pageOffset = PAGE_WIDTH * index;

  const rstyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value + pageOffset }]
    };
  });

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: `rgba(0,0,256,0.${index + 1})`,
          alignItems: 'center',
          justifyContent: 'center'
        },
        rstyle
      ]}
    >
      <Text
        style={{
          fontSize: 56,
          fontWeight: '700',
          letterSpacing: 1.5,
          textTransform: 'uppercase'
        }}
      >
        {title}
      </Text>
    </Animated.View>
  );
};

export { PAGE_WIDTH };
export default PageScrollView;

const styles = StyleSheet.create({});
