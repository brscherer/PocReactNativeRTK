import React from 'react';
import {ScrollView, Text, Button} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {decrement, increment} from './counterSlice';

export const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <ScrollView>
      <Button onPress={() => dispatch(increment())} title="Increment" />
      <Text>{count}</Text>
      <Button onPress={() => dispatch(decrement())} title="Decrement" />
    </ScrollView>
  );
};
