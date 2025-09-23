import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Font from "expo-font";

export default function SplashScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Oblong: require("../../assets/fonts/oblong.ttf"),
      });
      setFontsLoaded(true);

      setTimeout(() => {
        router.replace("/login"); 
      }, 4000);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Image 
        source={require("../../assets/images/appLogo.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00968a",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,    
    height: 200,   
  },
});
