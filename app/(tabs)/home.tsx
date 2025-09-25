import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { PieChart } from "react-native-svg-charts";
import { G, Circle, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

type DataItem = {
  key: number;
  value: number;
  label: string;
  color: string;
};

type DatasetKey = "Estoque" | "Vencimento" | "Menor Estoque";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>("Estoque");
  const [selectedSlice, setSelectedSlice] = useState<DataItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [animatedData, setAnimatedData] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"user" | "home" | "time">("home");

  const [dataSets, setDataSets] = useState<Record<DatasetKey, DataItem[]>>({
    Estoque: [],
    Vencimento: [],
    "Menor Estoque": [],
  });

  const animationRef = React.useRef<number | null>(null);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        PoppinsBold: require("../../assets/fonts/poppins/Poppins-Bold.ttf"),
        PoppinsMedium: require("../../assets/fonts/poppins/Poppins-Medium.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const estoqueRes = await axios.get(
          "http://10.35.233.116:8080/medicamentos/disponibilidade"
        );
        const vencimentoRes = await axios.get(
          "http://10.35.233.116:8080/medicamentos/estoque-vencido-vs-regular"
        );
        const menorEstoqueRes = await axios.get(
          "http://10.35.233.116:8080/medicamentos/menor-estoque"
        );

        setDataSets({
          Estoque: estoqueRes.data.map((item: any, i: number) => ({
            key: i + 1,
            label: item.categoria,
            value: item.quantidade,
            color: ["#00968a", "#f2a384", "#39d2c0", "#dbe2e7"][i % 4],
          })),
          Vencimento: vencimentoRes.data.map((item: any, i: number) => ({
            key: i + 1,
            label: item.nome,
            value: item.valor,
            color: ["#F2A384", "#ff9800", "#4caf50"][i % 3],
          })),
          "Menor Estoque": menorEstoqueRes.data.map((item: any, i: number) => ({
            key: i + 1,
            label: item.nome,
            value: item.quantidade,
            color: ["#00968a", "#f2a384", "#39d2c0", "#dbe2e7", "#ffcc80"][
              i % 5
            ],
          })),
        });
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (animationRef.current) clearInterval(animationRef.current);

    const targetValues = dataSets[selectedDataset].map((item) => item.value);
    setAnimatedData(targetValues.map(() => 0));
    let step = 0;
    const steps = 30;

    animationRef.current = setInterval(() => {
      step++;
      setAnimatedData((prev) =>
        prev.map((val, i) =>
          Math.min(
            targetValues[i],
            Math.round((targetValues[i] / steps) * step)
          )
        )
      );
      if (step >= steps && animationRef.current)
        clearInterval(animationRef.current);
    }, 20);
  }, [selectedDataset, dataSets]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  const rawData = dataSets[selectedDataset] || [];
  const data = rawData.map((item, index) => ({
    ...item,
    value: animatedData[index] || 0,
    svg: { fill: item.color, onPress: () => setSelectedSlice(item) },
    key: item.key,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1c1c1c" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Início</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => console.log("Configurações")}
        >
          <Ionicons name="settings-outline" size={28} color="#1c1c1c" />
        </TouchableOpacity>
      </View>

      <View style={styles.chartWrapper}>
        <PieChart
          style={{ height: 280, width: 280 }}
          outerRadius={"95%"}
          innerRadius={"75%"}
          data={data}
        >
          {selectedSlice && <Labels selectedSlice={selectedSlice} />}
        </PieChart>
      </View>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{selectedDataset}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <FlatList
              data={["Estoque", "Vencimento", "Menor Estoque"]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedDataset(item as DatasetKey);
                    setSelectedSlice(null);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.reportButton}>
        <Ionicons name="document-text-outline" size={35} color="#f2a384" />
        <Text style={styles.reportText}>Gerar Relatório</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => {
            setActiveTab("user");
            router.push("/profile");
          }}
        >
          {activeTab === "user" ? (
            <LinearGradient
              colors={["#278C67", "#1E342D"]}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={styles.navIconActive}
            >
              <Ionicons name="person-outline" size={28} color="#ffffff" />
            </LinearGradient>
          ) : (
            <View style={styles.navIconInactive}>
              <Ionicons name="person-outline" size={28} color="#BDBDBD" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("home")}>
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

type LabelsProps = { selectedSlice: DataItem | null };

const Labels = ({ selectedSlice }: LabelsProps) => {
  if (!selectedSlice) return null;
  return (
    <G x={5} y={5}>
      <Circle cx={-5} cy={-5} r={110} fill="#fff" />
      <SvgText
        x={-5}
        y={-10}
        textAnchor="middle"
        fontSize={18}
        fill="#1c1c1c"
        fontFamily="PoppinsBold"
      >
        {selectedSlice.label}
      </SvgText>
      <SvgText x={-5} y={15} textAnchor="middle" fontSize={16} fill="#1c1c1c">
        {`${Math.round(selectedSlice.value)} unidades`}
      </SvgText>
    </G>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA", paddingTop: 60 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 50,
    marginTop: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "PoppinsBold",
    color: "#1c1c1c",
  },
  chartWrapper: { alignItems: "center", justifyContent: "center" },
  dropdown: {
    backgroundColor: "#dbe2e7",
    marginVertical: 20,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: 200,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownText: {
    color: "#333",
    fontFamily: "PoppinsBold",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBox: {
    width: 300,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },
  modalItem: { paddingVertical: 12 },
  modalItemText: {
    fontSize: 18,
    fontFamily: "PoppinsMedium",
    color: "#1c1c1c",
  },
  reportButton: {
    backgroundColor: "#FFF",
    padding: 20,
    width: 150,
    height: 150,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#f2a384",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginVertical: 20,
  },
  reportText: {
    marginTop: 8,
    fontWeight: "600",
    color: "#1c1c1c",
    fontFamily: "PoppinsBold",
    fontSize: 18,
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    marginTop: "auto",
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
});
