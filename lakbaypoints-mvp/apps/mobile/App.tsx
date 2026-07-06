import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { guadalupeCubaoRoutes, type RouteOption } from "@lakbaypoints/shared";

const arrow = "\u2192";

function RouteCard({ route }: { route: RouteOption }) {
  const isRecommended = route.type === "sustainable";
  const isPhaseTwo = route.type === "phase2_preview";
  const isBaseline = route.type === "private_baseline";
  const tripChain =
    route.tripChainLabel?.replaceAll("->", arrow) ??
    route.segments.map((segment) => segment.label).join(` ${arrow} `);

  return (
    <View
      style={[
        styles.card,
        isRecommended && styles.recommendedCard,
        isPhaseTwo && styles.previewCard,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleGroup}>
          <Text style={styles.cardName}>{route.name}</Text>
          <Text style={styles.tripChain}>{tripChain}</Text>
        </View>
        {isRecommended ? (
          <Text style={styles.recommendedBadge}>Recommended</Text>
        ) : null}
        {route.phaseLabel ? (
          <Text style={styles.phaseBadge}>{route.phaseLabel}</Text>
        ) : null}
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Time</Text>
          <Text style={styles.metricValue}>{route.estimatedTimeMin} min</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>
            {route.type === "sustainable" ? "Fare" : "Cost"}
          </Text>
          <Text style={styles.metricValue}>PHP {route.estimatedCostPhp}</Text>
        </View>
        {!isBaseline ? (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Access</Text>
            <Text style={styles.metricValue}>{route.accessScore}</Text>
          </View>
        ) : null}
        {route.trafficCondition ? (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Traffic</Text>
            <Text style={styles.metricValue}>{route.trafficCondition}</Text>
          </View>
        ) : null}
        {route.co2eBaselineKg ? (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>CO2e baseline</Text>
            <Text style={styles.metricValue}>{route.co2eBaselineKg} kg</Text>
          </View>
        ) : null}
        {route.estimatedCo2eAvoidedKg ? (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Estimated CO2e avoided</Text>
            <Text style={styles.metricValue}>
              {route.estimatedCo2eAvoidedKg} kg
            </Text>
          </View>
        ) : null}
        {route.lakbayScoreReward ? (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Lakbay Score</Text>
            <Text style={styles.metricValue}>+{route.lakbayScoreReward}</Text>
          </View>
        ) : null}
        {route.campaignPointsReward ? (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Lakbay Points</Text>
            <Text style={styles.metricValue}>
              +{route.campaignPointsReward}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.noteGroup}>
        {route.notes?.slice(0, 2).map((note) => (
          <Text style={styles.note} key={note}>
            {note}
          </Text>
        ))}
        {route.futureIntegrationNote ? (
          <Text style={styles.futureNote}>{route.futureIntegrationNote}</Text>
        ) : null}
      </View>

      {isRecommended ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => undefined}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>Start Trip</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Guide the Trip. Verify the Shift.</Text>
          <Text style={styles.title}>LakbayPoints</Text>
          <Text style={styles.subtitle}>
            MMDA{"\u2019"}s Verified Mode-Shift Data Layer
          </Text>
          <View style={styles.corridorPill}>
            <Text style={styles.corridorText}>Guadalupe {arrow} Cubao</Text>
          </View>
        </View>

        <View style={styles.routeList}>
          {guadalupeCubaoRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </View>

        <Text style={styles.prototypeNote}>
          Prototype uses static pilot-corridor data
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef4f7",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 18,
    paddingTop: 10,
  },
  eyebrow: {
    color: "#0f766e",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    color: "#0f172a",
    fontSize: 40,
    fontWeight: "800",
    lineHeight: 46,
    marginBottom: 6,
  },
  subtitle: {
    color: "#334155",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 16,
  },
  corridorPill: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  corridorText: {
    color: "#1e3a8a",
    fontSize: 15,
    fontWeight: "800",
  },
  routeList: {
    gap: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d9e2ea",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  recommendedCard: {
    borderColor: "#0f766e",
    borderWidth: 2,
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  previewCard: {
    borderColor: "#f59e0b",
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardName: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 25,
    marginBottom: 5,
  },
  tripChain: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  recommendedBadge: {
    backgroundColor: "#ccfbf1",
    borderRadius: 999,
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 9,
    paddingVertical: 6,
    textTransform: "uppercase",
  },
  phaseBadge: {
    backgroundColor: "#fef3c7",
    borderRadius: 999,
    color: "#92400e",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 9,
    paddingVertical: 6,
    textTransform: "uppercase",
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  metric: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: "46%",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  metricValue: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22,
  },
  noteGroup: {
    gap: 5,
  },
  note: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  futureNote: {
    color: "#92400e",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  cta: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 14,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  prototypeNote: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 18,
    textAlign: "center",
  },
});
