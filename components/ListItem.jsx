import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';

const ListItem = ({ name, description, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <Entypo name="dot-single" size={50} style={styles.dot} />
      <View style={{paddingLeft: 20, position: 'relative'}}>
         <Text style={[styles.itemText, {fontSize: 30}]}>{name}</Text>
         <Text style={[styles.itemText, {fontSize: 20}]}>{description}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
         <AntDesign name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#333',
    borderRadius: 5,
    alignItems: 'center',
  },
  itemText: {
    color: 'white',
  },
  deleteText: {
    color: 'red',
  },
  dot: {
   position: 'absolute',
   top: -10,
   left: -10,
   color: 'green',
  },
});

export default ListItem;