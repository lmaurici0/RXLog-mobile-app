import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type User = {
  login: string;
  nome: string;
  cargo: string;
  instituicao: string;
  avatarUrl?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarColor, setAvatarColor] = useState({ bg: "#00968a", text: "#fff" });

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Poppins: require("../../assets/fonts/poppins/Poppins-Bold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Token não encontrado");

        const { data } = await axios.get("http://10.35.233.116:8080/usuarios/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          login: data.emailUsuario,
          nome: data.nomeUsuario,
          cargo: data.cargoUsuario,
          instituicao: data.instituicaoUsuario,
          avatarUrl: data.avatarUrl,
        });

        const colors = ["#00968a", "#f2a384", "#39d2c0"];
        const textColors = ["#ffffff"];
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const text = textColors[Math.floor(Math.random() * textColors.length)];
        setAvatarColor({ bg, text });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getInitials = (fullName: string) => {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  if (!fontsLoaded || loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00968a" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Perfil</Text>
        <Ionicons name="settings-outline" size={28} />
      </View>

      <View style={styles.avatarWrapper}>
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: avatarColor.bg }]}>
            <Text style={[styles.avatarInitials, { color: avatarColor.text }]}>
              {getInitials(user.nome)}
            </Text>
          </View>
        )}
      </View>

      {/* Dados do usuário */}
      <View style={styles.form}>
        <Text style={styles.label}>Login</Text>
        <View style={styles.dataWrapper}>
          <Ionicons name="person-circle-outline" size={20} color="#333" />
          <Text style={styles.dataText}>{user.login}</Text>
        </View>

        <Text style={styles.label}>Nome</Text>
        <View style={styles.dataWrapper}>
          <Ionicons name="id-card-outline" size={20} color="#333" />
          <Text style={styles.dataText}>{user.nome}</Text>
        </View>

        <Text style={styles.label}>Cargo</Text>
        <View style={styles.dataWrapper}>
          <Ionicons name="briefcase-outline" size={20} color="#333" />
          <Text style={styles.dataText}>{user.cargo}</Text>
        </View>

        <Text style={styles.label}>Instituição</Text>
        <View style={styles.dataWrapper}>
          <Ionicons name="business-outline" size={20} color="#333" />
          <Text style={styles.dataText}>{user.instituicao}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA", paddingTop: 60 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: { fontSize: 18, fontWeight: "600", fontFamily: "Poppins" },

  avatarWrapper: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "green",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },

  form: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  label: {
    fontFamily: "Poppins",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
    color: "#333",
  },
  dataWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dataText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#333",
  },
});