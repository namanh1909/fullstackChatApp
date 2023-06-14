import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
// import ImageView from 'react-native-image-viewing';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import ImageViewer from 'react-native-image-zoom-viewer';

const RenderImage = ({item}: any) => {
  const [visible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const convertedUrls = item.map((url: any) => ({url}));

  if (item) {
    // console.log(item);
    return (
      <View
        style={{
          width: 200,
          height: 200,
        }}>
        <Modal visible={visible} transparent={true}>
          <ImageViewer
            imageUrls={convertedUrls}
            enableSwipeDown
            onCancel={() => setIsVisible(false)}
          />
        </Modal>
        {item && item?.length == 1 && (
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
            }}>
            <FastImage
              style={{height: 200, width: 200}}
              source={{
                uri: item[0],
                headers: {Authorization: `${auth().currentUser?.uid}`},
                priority: FastImage.priority.normal,
              }}
            />
            {/* <Image source={{uri: item[0]}} /> */}
          </TouchableOpacity>
        )}
        {item?.length == 2 && (
          <FlatList
            scrollEnabled={false}
            horizontal
            style={{
              height: 200,
              width: 200,
            }}
            data={item}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIndex(index);
                    setIsVisible(true);
                  }}>
                  <FastImage
                    style={{height: 200, width: 100}}
                    source={{
                      uri: item,
                      headers: {Authorization: `${auth().currentUser?.uid}`},
                      priority: FastImage.priority.normal,
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}
        {item?.length == 3 && (
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIndex(0);
                setIsVisible(true);
              }}>
              <FastImage
                style={{height: 200, width: 100}}
                source={{
                  uri: item[0],
                  headers: {Authorization: `${auth().currentUser?.uid}`},
                  priority: FastImage.priority.normal,
                }}
              />
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setIndex(1);
                  setIsVisible(true);
                }}>
                <FastImage
                  style={{height: 100, width: 100}}
                  source={{
                    uri: item[1],
                    headers: {Authorization: `${auth().currentUser?.uid}`},
                    priority: FastImage.priority.normal,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIndex(2);
                  setIsVisible(true);
                }}>
                <FastImage
                  style={{height: 100, width: 100}}
                  source={{
                    uri: item[2],
                    headers: {Authorization: `${auth().currentUser?.uid}`},
                    priority: FastImage.priority.normal,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {item?.length == 4 && (
          <FlatList
            numColumns={2}
            style={{
              height: 200,
              width: 200,
            }}
            data={item}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIndex(index);
                    setIsVisible(true);
                  }}>
                  <FastImage
                    style={{height: 100, width: 100}}
                    source={{
                      uri: item,
                      headers: {Authorization: `${auth().currentUser?.uid}`},
                      priority: FastImage.priority.normal,
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    );
  } else {
    return null;
  }
};

export default RenderImage;

const styles = StyleSheet.create({});
