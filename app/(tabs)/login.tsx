import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router"; // 👈 Novo hook do Expo Router

export const options = {
  headerShown: false,
  tabBarStyle: { display: "none" },
};

export default function LoginScreen() {
  const router = useRouter(); // 👈 Router para navegação

  const [fontsLoaded] = useFonts({
    Oblong: require("../../assets/fonts/oblong.ttf"),
  });

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  if (!fontsLoaded) return null;

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Senha:", senha);

    // Aqui você pode validar login (API, etc.)
    // Se estiver ok, navega para Home
    router.replace("/home"); // 👈 substitui a tela de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>RxLog</Text>

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
    fontSize: 50,
    fontFamily: "Oblong",
    color: "#98C8B7",
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
    backgroundColor: "#278C67",
    borderRadius: 25,
    paddingVertical: 12,
    width: "60%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
