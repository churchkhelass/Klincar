import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = forwardRef(({ label, value, onChangeText, onSubmitEditing, returnKeyType }, ref) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        ref={ref}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 25,
  },
  input: {
    color: 'white',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'white',
    width: '60%',
  },
});

export default InputField;