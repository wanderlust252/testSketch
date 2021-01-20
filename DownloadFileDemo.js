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
    Linking
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
    useEffect(() => {
        RNFetchBlob.fs.df()
            .then((response) => {
                console.log('Free space in bytes: ' , response);
                console.log('Total space in bytes: ' + response.total);
            })
    }, [])
    const handleDownload = async () => {
        let dirs = RNFetchBlob.fs.dirs
        // if device is android you have to ensure you have permission
        if (Platform.OS === 'android') {
            const granted = await getPermissionAndroid();
            if (!granted) {
                return;
            }
        }
        Linking.openURL('http://at.npc.com.vn:8079/DocumentFiles/TaiLieuSuCo/%2FPA0905%2F232_16_36_16_23_03_2020.pdf');

        // setSaving(true)
        // RNFetchBlob
        //     .config({
        //         // add this option that makes response data to be stored as a file,
        //         // this is much more performant.
        //         fileCache: true,
        //         appendExt: 'pdf',
        //         // path: dirs.DownloadDir + '/LeHieu'
        //     })
        //     .fetch('GET', 'http://103.63.109.191:8074/DocumentFiles/TaiLieuSuCo/PA04DH/1046_14_01_43_08_09_2020.PNG', {
        //         //some headers ..
        //     })
        //     .then((res) => {
        //         setSaving(false)
        //         // the temp file path
        //         console.log('The file saved to ', res)
        //     })
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
                        <Text style={styles.headerText}>React Native Downloader</Text>
                        <View style={styles.textInputWrapper}>
                            <TextInput
                                placeholder="Enter image url here"
                                style={styles.textInput}
                                value={url}
                                onChangeText={text => setUrl(text)}
                            />
                        </View>
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