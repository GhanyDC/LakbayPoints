import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>LakbayPoints MVP</Text>
        <Text style={styles.title}>Guide the Trip. Verify the Shift.</Text>
        <Text style={styles.body}>
          Mobile app foundation for the EDSA-MRT3 Guadalupe to Cubao Sustainable
          Trip Chain Corridor.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  eyebrow: {
    color: "#0f766e",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  title: {
    color: "#0f172a",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    marginBottom: 16,
  },
  body: {
    color: "#475569",
    fontSize: 17,
    lineHeight: 24,
  },
});
