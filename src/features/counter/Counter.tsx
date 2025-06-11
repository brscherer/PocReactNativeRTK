import React from 'react';
import {ScrollView, Text, Button} from 'react-native';
import type {RootState} from '../../app/store';
import {useSelector, useDispatch} from 'react-redux';
import {decrement, increment} from './counterSlice';

export const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Button onPress={() => dispatch(increment())} title="Increment" />
      <Text>{count}</Text>
      <Button onPress={() => dispatch(decrement())} title="Decrement" />
    </ScrollView>
  );
};
