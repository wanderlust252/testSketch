import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;
export default function App({ }) {
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    }
  };
  const handleDownload = async () => {
    // if device is android you have to ensure you have permission
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (!granted) {
        return;
      }
    }
    setSaving(true)
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
    }).fetch('GET', url)
      .then(res => {
        CameraRoll.save(res.data, {
          type: 'photo',
          album: 'LeHieu'
        })
          .then(res => console.log(res))
          .catch(err => console.log(err))
          .finally(() => setSaving(false));
      })
      .catch(error => {
        setSaving(false);
        Alert.alert(
          'Save remote Image',
          'Failed to save Image: ' + error.message,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false },
        );
      });

  }
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.app}>
          {saving ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" />
            </View>
          ) : (<>
            <Text style={styles.headerText}>React Native Image Downloader</Text>
            <View style={styles.textInputWrapper}>
              <TextInput
                placeholder="Enter image url here"
                style={styles.textInput}
                value={url}
                onChangeText={text => setUrl(text)}
              />
            </View>
            <Image source={{ uri: url }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownload}>
              <Text>Download Image</Text>
            </TouchableOpacity>
          </>)}

        </View>
      </SafeAreaView>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2FF345CC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  app: {
    backgroundColor: '#11131B',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 30,
  },
  headerText: {
    marginTop: 50,
    fontSize: 26,
    color: 'white',
  },
  textInputWrapper: {
    marginTop: 30,
    alignSelf: 'stretch',
    padding: 10,
  },
  textInput: {
    padding: 10,
    backgroundColor: '#EFEFEF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 3,
  },
  imagePreview: {
    height: 300,
    width: 300,
    backgroundColor: 'purple',
    marginTop: 30,
  },
  downloadButton: {
    backgroundColor: 'white',
    marginTop: 40,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 3,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
})