import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function ConfigScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"home" | "leaf" | "time">("home");
  const [notifications, setNotifications] = useState({
    alertaMovimentacao: true,
    estorqueReno: false,
    notificacoesFuzil: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#1c1c1c" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Configurações</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#1c1c1c" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.divider} />

      

        {/* Notificações Section */}
        <Text style={styles.sectionTitle}>Notificações</Text>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Ionicons name="notifications-outline" size={20} color="#1c1c1c" />
            <Text style={styles.notificationText}>Alerta de movimentação</Text>
          </View>
          <Switch
            value={notifications.alertaMovimentacao}
            onValueChange={() => toggleNotification("alertaMovimentacao")}
            trackColor={{ false: "#767577", true: "#278C67" }}
            thumbColor={notifications.alertaMovimentacao ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Ionicons name="alert-circle-outline" size={20} color="#1c1c1c" />
            <Text style={styles.notificationText}>Estoque Baixo</Text>
          </View>
          <Switch
            value={notifications.estorqueReno}
            onValueChange={() => toggleNotification("estorqueReno")}
            trackColor={{ false: "#767577", true: "#278C67" }}
            thumbColor={notifications.estorqueReno ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Ionicons name="warning-outline" size={20} color="#1c1c1c" />
            <Text style={styles.notificationText}>Notificações Push</Text>
          </View>
          <Switch
            value={notifications.notificacoesFuzil}
            onValueChange={() => toggleNotification("notificacoesFuzil")}
            trackColor={{ false: "#767577", true: "#278C67" }}
            thumbColor={notifications.notificacoesFuzil ? "#fff" : "#f4f3f4"}
          />
        </View>

        {/* Espaço extra no final */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Navigation - IDÊNTICO ao da HomeScreen */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.back()}>
          {activeTab === "home" ? (
            <LinearGradient
              colors={["#278C67", "#1E342D"]}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={styles.navIconActive}
            >
              <Ionicons name="home" size={28} color="#ffffff" />
            </LinearGradient>
          ) : (
            <View style={styles.navIconInactive}>
              <Ionicons name="home" size={28} color="#BDBDBD" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("leaf")}>
          {activeTab === "leaf" ? (
            <LinearGradient
              colors={["#278C67", "#1E342D"]}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={styles.navIconActive}
            >
              <Ionicons name="leaf-outline" size={28} color="#ffffff" />
            </LinearGradient>
          ) : (
            <View style={styles.navIconInactive}>
              <Ionicons name="leaf-outline" size={28} color="#BDBDBD" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("time")}>
          {activeTab === "time" ? (
            <LinearGradient
              colors={["#278C67", "#1E342D"]}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={styles.navIconActive}
            >
              <Ionicons name="time-outline" size={28} color="#ffffff" />
            </LinearGradient>
          ) : (
            <View style={styles.navIconInactive}>
              <Ionicons name="time-outline" size={28} color="#BDBDBD" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F6FA", 
    paddingTop: 60 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 30,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "PoppinsBold",
    color: "#1c1c1c",
  },
  settingsButton: {
    backgroundColor: "#F8FBFF",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1c1c1c",
    marginBottom: 30,
    fontFamily: "PoppinsBold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1c1c1c",
    marginVertical: 15,
    fontFamily: "PoppinsBold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  table: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c1c1c",
    flex: 1,
    fontFamily: "PoppinsBold",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  tableCell: {
    fontSize: 16,
    color: "#1c1c1c",
    flex: 1,
    fontFamily: "PoppinsMedium",
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notificationText: {
    fontSize: 16,
    color: "#1c1c1c",
    fontFamily: "PoppinsMedium",
  },
  spacer: {
    height: 30,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navIconActive: {
    padding: 20,
    borderRadius: 50,
    shadowColor: "#1E342D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  navIconInactive: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});