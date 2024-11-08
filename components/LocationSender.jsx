import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const LOCATION_TASK_NAME = 'background-location-task';

export default function LocationSender() {
  const [location, setLocation] = useState(null);
  const [serverUrl, setServerUrl] = useState('');

  useEffect(() => {
    requestPermissions();
    startBackgroundLocationUpdates();

    return () => {
      stopBackgroundLocationUpdates();
    };
  }, []);

  const requestPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let { backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      Alert.alert('Permission to access background location was denied');
      return;
    }

    await requestNotificationPermissions();
  };

  const startBackgroundLocationUpdates = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 100,
      deferredUpdatesInterval: 60000,
      showsBackgroundLocationIndicator: true,
    });
  };

  const stopBackgroundLocationUpdates = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  };

  // foreground
  const sendLocationForeground = async () => {
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);

    if (serverUrl) {
      try {
        await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }),
        });
        await sendPushNotification('Location sent successfully');
      } catch (error) {
        Alert.alert('Failed to send location');
      }
    } else {
      Alert.alert('Please enter server URL');
    }
  };

  // уведомления
  const sendPushNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Location Update',
        body: message,
      },
      trigger: null,
    });
  };

  return (
    <View>
      <TextInput
        placeholder="Enter server URL"
        value={serverUrl}
        onChangeText={setServerUrl}
        style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Send Foreground Location" onPress={sendLocationForeground} />
    </View>
  );
}

// отправка локации
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const [location] = locations;

    const serverUrl = ''; // URL сервера 
    if (serverUrl) {
      try {
        await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }),
        });
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Background Location Update',
            body: 'Location sent successfully in background',
          },
          trigger: null,
        });
      } catch (error) {
        console.error('Failed to send location in background', error);
      }
    }
  }
});