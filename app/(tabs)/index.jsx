import React, { useRef, useState } from 'react';
import { View, Button, FlatList, StyleSheet } from 'react-native';
import ListItem from '../../components/ListItem';
import InputField from '../../components/InputField';

export default function HomeScreen() {
  const [text, onChangeText] = useState('');
  const [description, onChangeDescription] = useState('');
  const [items, setItems] = useState([]);

  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const addItem = () => {
    if (text && description) {
      setItems([...items, { id: Date.now().toString(), name: text, description }]);
      onChangeText('');
      onChangeDescription('');
      nameInputRef.current?.focus();
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View>
          <InputField
            label="Name"
            value={text}
            onChangeText={onChangeText}
            ref={nameInputRef}
            onSubmitEditing={() => descriptionInputRef.current?.focus()}
            returnKeyType="next"
          />
          <InputField
            label="Descr"
            value={description}
            onChangeText={onChangeDescription}
            ref={descriptionInputRef}
            onSubmitEditing={addItem}
            returnKeyType="done"
          />
        </View>
        <Button title="Add" onPress={addItem} />
      </View>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            name={item.name}
            description={item.description}
            onDelete={() => deleteItem(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 60,
  },
});