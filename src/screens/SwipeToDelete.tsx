import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ListItem from '../components/ListItem';
import { ScrollView } from 'react-native-gesture-handler';

const TITLES = [
  'Record the dismissible tutorial',
  'Leave 👍 to the video',
  'Check Youtube comments',
  'Subscribe to the channel',
  'Leave a ⭐ on the Github Repo'
];

export interface TaskInterface {
  title: string;
  index: number;
}

const TASKS: TaskInterface[] = TITLES.map((title, index) => ({ title, index }));

const BACKGROUND_COLOR = '#FAFBFF';

export default function App() {
  const [tasks, setTasks] = useState(TASKS);

  const onDismiss = useCallback((task: TaskInterface) => {
    setTasks((tasks) => tasks.filter((item) => item.index !== task.index));
  }, []);

  const scrollRef = useRef(null);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Tasks</Text>
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {tasks.map((task) => (
          <ListItem
            key={task.index}
            task={task}
            onDismiss={onDismiss}
            simultaneousHandlers={scrollRef}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: BACKGROUND_COLOR
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: '50%'
  }
});
