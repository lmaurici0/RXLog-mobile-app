import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router"; 

export const options = {
  headerShown: false,
  tabBarStyle: { display: "none" },
};

export default function LoginScreen() {
  const router = useRouter(); 

  const [fontsLoaded] = useFonts({
    Oblong: require("../../assets/fonts/oblong.ttf"),
  });

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  if (!fontsLoaded) return null;

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Senha:", senha);
    router.replace("/home"); 
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/appLogo.png")} 
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="black" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="black" style={styles.icon} />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#00968a",
    borderRadius: 30,
    paddingVertical: 14,
    width: "70%",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#00968a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
