import React, { useEffect, useState, useRef } from "react";
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

type DataItem = {
  key: number;
  value: number;
  label: string;
  color: string;
};

type DatasetKey = "Estoque" | "Vencimento" | "Menor Estoque";

export default function HomeScreen() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>("Estoque");
  const [selectedSlice, setSelectedSlice] = useState<DataItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [animatedData, setAnimatedData] = useState<number[]>([]);
  const [dataSets, setDataSets] = useState<Record<string, DataItem[]>>({
    Estoque: [],
    Vencimento: [],
    MenorEstoque: [],
  });
  const animationRef = React.useRef<number | null>(null);

  useEffect(() => {
    const targetValues = dataSets[selectedDataset].map((item) => item.value);
    setAnimatedData(targetValues.map(() => 0));
    let step = 0;
    const steps = 20;

    animationRef.current = setInterval(() => {
      step++;
      const newData = targetValues.map((val, i) =>
        Math.min(val, Math.round((val / steps) * step))
      );
      setAnimatedData(newData);
      if (step >= steps && animationRef.current) {
        clearInterval(animationRef.current);
      }
    }, 30);

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [selectedDataset]);

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
        const baseURL = "http://10.171.56.116:8080"; 

        const [estoqueRes, vencimentoRes, menorEstoqueRes] = await Promise.all([
          axios.get(`${baseURL}/medicamentos/disponibilidade`),
          axios.get(`${baseURL}/medicamentos/estoque-vencido-vs-regular`),
          axios.get(`${baseURL}/medicamentos/menor-estoque`), 
        ]);

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
            color: ["#f44336", "#ff9800", "#4caf50"][i % 3],
          })),
          MenorEstoque: menorEstoqueRes.data.map((item: any, i: number) => ({
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

  const data = dataSets[selectedDataset].map((item, index) => ({
    ...item,
    value: animatedData[index] || 0,
    svg: { fill: item.color, onPress: () => setSelectedSlice(item) },
    key: item.key,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={28} color="#1c1c1c" />
        <Text style={styles.headerText}>Início</Text>
        <Ionicons name="settings-outline" size={28} color="#1c1c1c" />
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
        <Ionicons name="home" size={28} color="#00968a" />
        <Ionicons name="leaf-outline" size={28} color="#BDBDBD" />
        <Ionicons name="time-outline" size={28} color="#BDBDBD" />
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
    fontSize: 18,
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
    width: 170,
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
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    marginTop: "auto",
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
});
