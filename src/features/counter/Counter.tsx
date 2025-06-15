import React from 'react';
import {ScrollView, Text, Button, View, StyleSheet, useColorScheme} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {decrement, increment} from './counterSlice';

export const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = createStyles(isDark);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Counter</Text>
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{count}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              onPress={() => dispatch(decrement())}
              title="−"
              color={isDark ? '#007AFF' : '#007AFF'}
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={() => dispatch(increment())}
              title="+"
              color={isDark ? '#007AFF' : '#007AFF'}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#000000' : '#F2F2F7',
    padding: 20,
  },
  card: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#000000',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  counterContainer: {
    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    minWidth: 80,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 48,
    fontWeight: '300',
    color: isDark ? '#FFFFFF' : '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 60,
  },
});
