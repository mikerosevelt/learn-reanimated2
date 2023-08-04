import { StyleSheet, View, Text } from 'react-native';
import Ripple from '../components/Ripple';

export default function App() {
  return (
    <View style={styles.container}>
      <Ripple style={styles.ripple} onTap={() => {}}>
        <Text style={{ fontSize: 25 }}>Tap</Text>
      </Ripple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ripple: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 25,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
