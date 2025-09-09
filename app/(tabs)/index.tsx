import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
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
      <Text style={styles.logo}>RxLog</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#278C67",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 60,
    fontFamily: "Oblong",
    color: "#98C8B7",
  },
});
