// HomeScreen.tsx
import React, { useState } from "react";
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

// ---------- Tipagem dos dados ----------
type DataItem = {
  key: number;
  value: number;
  label: string;
  color: string;
};

const dataSets: Record<string, DataItem[]> = {
  Validades: [
    { key: 1, value: 40, label: "Válidos", color: "#6FCF97" },
    { key: 2, value: 10, label: "Vencidos", color: "#EB5757" },
    { key: 3, value: 20, label: "Quase vencendo", color: "#F2C94C" },
    { key: 4, value: 30, label: "Outros", color: "#9B51E0" },
  ],
  Categorias: [
    { key: 1, value: 25, label: "Antidepressivos", color: "#6FCF97" },
    { key: 2, value: 35, label: "Antibióticos", color: "#2F80ED" },
    { key: 3, value: 40, label: "Analgésicos", color: "#F2994A" },
  ],
};

// As chaves válidas do dataset
type DatasetKey = keyof typeof dataSets;

export default function HomeScreen() {
  const [selectedDataset, setSelectedDataset] =
    useState<DatasetKey>("Validades");
  const [selectedSlice, setSelectedSlice] = useState<DataItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const data = dataSets[selectedDataset].map((item) => ({
    ...item,
    svg: {
      fill: item.color,
      onPress: () => setSelectedSlice(item),
    },
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} />
        <Text style={styles.headerText}>Início</Text>
        <Ionicons name="settings-outline" size={24} />
      </View>

      {/* Gráfico */}
      <View style={styles.chartWrapper}>
        <PieChart
          style={{ height: 250, width: 250 }}
          outerRadius={"95%"}
          innerRadius={"70%"}
          data={data}
        >
          {selectedSlice && <Labels selectedSlice={selectedSlice} />}
        </PieChart>
      </View>

      {/* Select (Modal Customizado) */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text>{selectedDataset}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <FlatList
              data={Object.keys(dataSets)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 12 }}
                  onPress={() => {
                    setSelectedDataset(item as DatasetKey);
                    setSelectedSlice(null);
                    setModalVisible(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Botão Gerar Relatório */}
      <TouchableOpacity style={styles.reportButton}>
        <Ionicons name="document-text-outline" size={30} color="red" />
        <Text style={styles.reportText}>Gerar Relatório</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Fake */}
      <View style={styles.bottomNav}>
        <Ionicons name="home" size={28} color="green" />
        <Ionicons name="leaf-outline" size={28} color="#BDBDBD" />
        <Ionicons name="time-outline" size={28} color="#BDBDBD" />
      </View>
    </View>
  );
}

// ---------- Componente Labels no centro ----------
type LabelsProps = {
  selectedSlice: DataItem | null;
};

const Labels = ({ selectedSlice }: LabelsProps) => {
  if (!selectedSlice) return null;

  return (
    <G>
      {/* Círculo branco central */}
      <Circle cx="50%" cy="50%" r="50" fill="#FFF" />

      {/* Texto do slice */}
      <SvgText
        x="50%"
        y="45%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={14}
        fontWeight="bold"
        fill="#333"
      >
        {selectedSlice.label}
      </SvgText>

      <SvgText
        x="50%"
        y="60%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={12}
        fill="#555"
      >
        {`${selectedSlice.value} itens`}
      </SvgText>
    </G>
  );
};

// ---------- Estilos ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    backgroundColor: "#E0E0E0",
    margin: 20,
    borderRadius: 12,
    padding: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBox: {
    width: 250,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
  },
  reportButton: {
    backgroundColor: "#FFF",
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportText: {
    marginTop: 8,
    fontWeight: "500",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    marginTop: "auto",
  },
});
