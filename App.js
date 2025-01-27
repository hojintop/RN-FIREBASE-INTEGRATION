import { Button, Image, Platform, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage"
import { useState } from "react";

export default function App() {
  const [imageInfo, setImageInfo] = useState(null);

  async function onPressPickFile(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    // console.log(result);
    // 이미지 선택시
    if (!result.canceled) {
      const image = result.assets[0];
      setImageInfo(image);

      const uri = image.uri;
      const fileNameArray = uri.split('/');
      const fileName = fileNameArray[fileNameArray.length - 1];
      const file = Platform.OS === "ios" ? uri.replace("file://","") : uri;

      const reference = await storage().ref(fileName).putFile(file);

    }
  }

  return (
    <View style={styles.container}>
      {imageInfo !== null ? (<Image source={{uri:imageInfo.uri}} style={{width:150, height:150,}}></Image>) : (<></>)}
      <Button title="PICK FILE" onPress={onPressPickFile}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
