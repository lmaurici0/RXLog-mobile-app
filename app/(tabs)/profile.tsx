import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

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
    async function fetchUser() {
      try {
        // Simulação de dados do usuário
        const data: User = {
          login: "pedro.luiz",
          nome: "Pedro Luiz",
          cargo: "Administrador",
          instituicao: "Hospital Central",
        };
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar usuário", error);
      }
    }

    fetchUser();
  }, []);

  if (!fontsLoaded || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Perfil</Text>
        <Ionicons name="settings-outline" size={24} />
      </View>

      <View style={styles.avatarWrapper}>
        <TouchableOpacity>
          <Image
            source={{
              uri: user.avatarUrl || "https://via.placeholder.com/120",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

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