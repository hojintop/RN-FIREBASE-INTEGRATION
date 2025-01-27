import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import firebaseAuth from "@react-native-firebase/auth";

import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

GoogleSignin.configure();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onPressGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      console.log("response", response);

      const credential = firebaseAuth.GoogleAuthProvider.credential(
        response.data.idToken
      );
      const result = await firebaseAuth().signInWithCredential(credential);

      setUserInfo({
        userName: result.additionalUserInfo.profile.name,
        userImage: result.additionalUserInfo.profile.picture,
      });
    } catch (ex) {}
  }

  async function getCurrentUserInfo() {
    
    try {
      setIsLoading(true);
      const response = await GoogleSignin.signInSilently();
  
      if (isSuccessResponse(response)) {
        
        const credential = firebaseAuth.GoogleAuthProvider.credential(
          response.data.idToken
        );
        const result = await firebaseAuth().signInWithCredential(credential);

        setUserInfo({
          userName: result.additionalUserInfo.profile.name,
          userImage: result.additionalUserInfo.profile.picture,
        });
        
      } else if (isNoSavedCredentialFoundResponse(response)) {
        // user has not signed in yet, or they have revoked access
        // 구글로그인 필요 TO-DO 작성
      }
      setIsLoading(false);
    } catch (error) {
      // handle errror
    }
  }

  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : userInfo !== null ? (
        <View>
          <Image
            style={{ width: 100, height: 100 , borderRadius: 50}}
            source={{ uri: userInfo.userImage }}
          ></Image>
          <Text style={{ fontSize: 24, marginTop: 10 }}>
            {userInfo.userName}
          </Text>
        </View>
      ) : (
        <GoogleSigninButton onPress={onPressGoogleSignin} />
      )}
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
