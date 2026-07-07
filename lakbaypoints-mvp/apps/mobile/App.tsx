import { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  type DimensionValue,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  classifySustainableTripChain,
  guadalupeCubaoRoutes,
  suspiciousTraceRejected,
  type ClassifierResult,
  type ClassifierSignalChecklist,
  type RouteOption,
  type RouteSegment,
  validSustainableGuadalupeCubaoTrace,
} from "@lakbaypoints/shared";

const arrow = "\u2192";
const sustainableRoute =
  guadalupeCubaoRoutes.find((route) => route.type === "sustainable") ??
  guadalupeCubaoRoutes[0];

type ScreenName = "comparison" | "detail" | "playback";
type TraceMode = "valid" | "suspicious";

type PlaybackStep = {
  segmentId: string;
  status: string;
};

const playbackSteps: PlaybackStep[] = [
  {
    segmentId: "walk-guadalupe-origin-station",
    status: "Walking segment detected",
  },
  {
    segmentId: "mrt3-guadalupe-cubao",
    status: "Transit corridor segment in progress",
  },
  {
    segmentId: "walk-cubao-station-destination",
    status: "Approaching destination",
  },
];

function readableTripChain(route: RouteOption) {
  return (
    route.tripChainLabel?.replaceAll("->", arrow) ??
    route.segments.map((segment) => segment.label).join(` ${arrow} `)
  );
}

function formatMode(mode: RouteSegment["mode"]) {
  const labels: Record<RouteSegment["mode"], string> = {
    walk: "Walk",
    mrt: "MRT3",
    bus: "Bus",
    jeepney: "Jeepney",
    ferry: "Ferry",
    bike: "Bike",
    ebike: "E-bike",
    private_vehicle: "Private vehicle",
  };

  return labels[mode];
}

function segmentStepTitle(segment: RouteSegment, index: number) {
  if (segment.mode === "walk" && index === 0) {
    return "Walk to station/loading area";
  }

  if (segment.mode === "mrt") {
    return "MRT3 / public transport corridor segment";
  }

  if (segment.mode === "walk") {
    return "Walk to destination";
  }

  return segment.label;
}

function classifierSignalRows(signals: ClassifierSignalChecklist) {
  return [
    ["Route match", signals.routeMatch ? "Passed" : "Needs review"],
    ["Speed pattern", signals.speedPatternValid ? "Passed" : "Needs review"],
    [
      "Walking segments",
      signals.walkingSegmentsDetected ? "Passed" : "Needs review",
    ],
    ["Station proximity", signals.proximityValid ? "Passed" : "Needs review"],
    ["Station dwell", signals.stationDwellDetected ? "Passed" : "Needs review"],
    [
      "Activity recognition",
      signals.activityRecognitionSupport ? "Supported" : "Limited",
    ],
    [
      "Suspicious movement",
      signals.suspiciousPattern || signals.impossibleMovementDetected
        ? "Flagged"
        : "Not detected",
    ],
  ] as const;
}

function RouteCard({
  route,
  onStartTrip,
}: {
  route: RouteOption;
  onStartTrip: () => void;
}) {
  const isRecommended = route.type === "sustainable";
  const isPhaseTwo = route.type === "phase2_preview";
  const isBaseline = route.type === "private_baseline";

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
          <Text style={styles.tripChain}>{readableTripChain(route)}</Text>
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
          onPress={onStartTrip}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>Start Trip</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function AppHeader({
  eyebrow,
  title = "LakbayPoints",
  subtitle,
}: {
  eyebrow: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.corridorPill}>
        <Text style={styles.corridorText}>Guadalupe {arrow} Cubao</Text>
      </View>
    </View>
  );
}

function MetricGrid({ route }: { route: RouteOption }) {
  return (
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
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Access</Text>
        <Text style={styles.metricValue}>{route.accessScore}</Text>
      </View>
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
          <Text style={styles.metricValue}>+{route.campaignPointsReward}</Text>
        </View>
      ) : null}
    </View>
  );
}

function RouteComparisonScreen({ onStartTrip }: { onStartTrip: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="Guide the Trip. Verify the Shift."
        subtitle={"MMDA\u2019s Verified Mode-Shift Data Layer"}
      />

      <View style={styles.routeList}>
        {guadalupeCubaoRoutes.map((route) => (
          <RouteCard key={route.id} route={route} onStartTrip={onStartTrip} />
        ))}
      </View>

      <Text style={styles.prototypeNote}>
        Prototype uses static pilot-corridor data
      </Text>
    </ScrollView>
  );
}

function RouteDetailScreen({
  route,
  onBack,
  onBeginPlayback,
}: {
  route: RouteOption;
  onBack: () => void;
  onBeginPlayback: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader eyebrow="Guide the Trip" />

      <View style={[styles.card, styles.detailHeroCard]}>
        <Text style={styles.sectionKicker}>Sustainable Trip Chain</Text>
        <Text style={styles.detailTitle}>{route.name}</Text>
        <Text style={styles.detailChain}>{readableTripChain(route)}</Text>
        <MetricGrid route={route} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Segment breakdown</Text>
        <Text style={styles.sectionCaption}>
          Static trip preview for the MVP corridor
        </Text>
      </View>

      <View style={styles.stepList}>
        {route.segments.map((segment, index) => (
          <View style={styles.stepCard} key={segment.id}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepMode}>{formatMode(segment.mode)}</Text>
              <Text style={styles.stepTitle}>
                {segmentStepTitle(segment, index)}
              </Text>
              <Text style={styles.stepRoute}>
                {segment.startName} {arrow} {segment.endName}
              </Text>
              <Text style={styles.stepMeta}>
                {segment.estimatedTimeMin} min
                {segment.distanceKm ? ` - ${segment.distanceKm} km` : ""}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.infoNote}>
        Prototype uses static pilot-corridor data. Full routing will be added
        during formal pilot development.
      </Text>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onBeginPlayback}
          style={styles.primaryAction}
        >
          <Text style={styles.primaryActionText}>Begin Trip Playback</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>Back to Routes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function ProgressIndicator({
  activeIndex,
  route,
}: {
  activeIndex: number;
  route: RouteOption;
}) {
  const progressWidth: DimensionValue =
    `${((activeIndex + 1) / route.segments.length) * 100}%` as DimensionValue;

  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
      <View style={styles.progressSteps}>
        {route.segments.map((segment, index) => (
          <View style={styles.progressStep} key={segment.id}>
            <View
              style={[
                styles.progressDot,
                index <= activeIndex && styles.progressDotActive,
              ]}
            />
            <Text
              style={[
                styles.progressStepLabel,
                index === activeIndex && styles.progressStepLabelActive,
              ]}
            >
              {formatMode(segment.mode)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TripPlaybackScreen({
  route,
  onBackToDetail,
}: {
  route: RouteOption;
  onBackToDetail: () => void;
}) {
  const [traceMode, setTraceMode] = useState<TraceMode>("valid");
  const [classifierResult, setClassifierResult] =
    useState<ClassifierResult | null>(null);
  const resultVisible = classifierResult !== null;
  const activeIndex = resultVisible ? route.segments.length - 1 : 1;
  const currentSegment = route.segments[activeIndex];
  const currentStatus =
    playbackSteps[activeIndex]?.status ?? "Trip segment in progress";
  const runVerification = (mode: TraceMode) => {
    const gpsTrace =
      mode === "valid"
        ? validSustainableGuadalupeCubaoTrace
        : suspiciousTraceRejected;

    setTraceMode(mode);
    setClassifierResult(
      classifySustainableTripChain({
        selectedRoute: route,
        gpsTrace,
      }),
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader eyebrow="Verify the Shift" title="Verify the Shift" />

      <View style={[styles.card, styles.playbackHeroCard]}>
        <Text style={styles.sectionKicker}>Current trip</Text>
        <Text style={styles.detailTitle}>Guadalupe {arrow} Cubao</Text>
        <Text style={styles.detailChain}>{readableTripChain(route)}</Text>
        <ProgressIndicator activeIndex={activeIndex} route={route} />
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.sectionKicker}>Current segment</Text>
        <Text style={styles.statusTitle}>
          {currentSegment
            ? segmentStepTitle(currentSegment, activeIndex)
            : "Trip playback"}
        </Text>
        <Text style={styles.statusBody}>{currentStatus}</Text>
      </View>

      <Text style={styles.classifierNote}>
        For MVP, verification uses a rule-based confidence engine based on
        multiple trip signals.
      </Text>

      <View style={styles.stepList}>
        {route.segments.map((segment, index) => (
          <View
            style={[
              styles.playbackStepCard,
              index === activeIndex && styles.playbackStepCardActive,
            ]}
            key={segment.id}
          >
            <View style={styles.playbackStepTop}>
              <Text style={styles.stepMode}>{formatMode(segment.mode)}</Text>
              <Text style={styles.stepMeta}>
                {playbackSteps[index]?.status}
              </Text>
            </View>
            <Text style={styles.stepTitle}>
              {segmentStepTitle(segment, index)}
            </Text>
            <Text style={styles.stepRoute}>
              {segment.startName} {arrow} {segment.endName}
            </Text>
          </View>
        ))}
      </View>

      {classifierResult ? (
        <View style={[styles.card, styles.resultCard]}>
          <Text style={styles.sectionKicker}>
            Sustainable Trip Chain Classifier
          </Text>
          <Text style={styles.traceModeText}>
            Demo trace:{" "}
            {traceMode === "valid"
              ? "Valid sustainable trip"
              : "Suspicious trace"}
          </Text>
          <Text style={styles.resultLabel}>Confidence Score</Text>
          <Text style={styles.resultScore}>
            {classifierResult.confidenceScore}%
          </Text>
          <Text style={styles.resultTitle}>
            Result: {classifierResult.result}
          </Text>
          <Text style={styles.resultBody}>
            Reward Eligibility: {classifierResult.rewardEligibility}
          </Text>
          <Text style={styles.sectionKicker}>Signal checklist</Text>
          <View style={styles.signalList}>
            {classifierSignalRows(classifierResult.signals).map(
              ([label, value]) => (
                <View style={styles.signalRow} key={label}>
                  <Text style={styles.signalLabel}>{label}</Text>
                  <Text style={styles.signalValue}>{value}</Text>
                </View>
              ),
            )}
          </View>
          <Text style={styles.sectionKicker}>Explanation</Text>
          <View style={styles.explanationList}>
            {classifierResult.explanation.slice(0, 5).map((message) => (
              <Text style={styles.explanationText} key={message}>
                {message}
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => runVerification("valid")}
          style={styles.primaryAction}
        >
          <Text style={styles.primaryActionText}>Complete Trip & Verify</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => runVerification("suspicious")}
          style={styles.warningAction}
        >
          <Text style={styles.warningActionText}>Test suspicious trace</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBackToDetail}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>Back to Route Detail</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("comparison");
  const route = useMemo(() => sustainableRoute, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      {screen === "comparison" ? (
        <RouteComparisonScreen onStartTrip={() => setScreen("detail")} />
      ) : null}
      {screen === "detail" ? (
        <RouteDetailScreen
          route={route}
          onBack={() => setScreen("comparison")}
          onBeginPlayback={() => setScreen("playback")}
        />
      ) : null}
      {screen === "playback" ? (
        <TripPlaybackScreen
          route={route}
          onBackToDetail={() => setScreen("detail")}
        />
      ) : null}
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
  detailHeroCard: {
    borderColor: "#0f766e",
    marginBottom: 18,
  },
  sectionKicker: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 7,
    textTransform: "uppercase",
  },
  detailTitle: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 6,
  },
  detailChain: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 29,
  },
  sectionCaption: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 4,
  },
  stepList: {
    gap: 12,
  },
  stepCard: {
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderColor: "#d9e2ea",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  stepNumber: {
    alignItems: "center",
    backgroundColor: "#dbeafe",
    borderRadius: 999,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  stepNumberText: {
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "800",
  },
  stepContent: {
    flex: 1,
  },
  stepMode: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  stepTitle: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 23,
    marginBottom: 5,
  },
  stepRoute: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 5,
  },
  stepMeta: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  infoNote: {
    backgroundColor: "#f8fafc",
    borderColor: "#d9e2ea",
    borderRadius: 8,
    borderWidth: 1,
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 16,
    padding: 14,
  },
  actionRow: {
    gap: 10,
    marginTop: 18,
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    paddingVertical: 14,
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  warningAction: {
    alignItems: "center",
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 13,
  },
  warningActionText: {
    color: "#92400e",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 13,
  },
  secondaryActionText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "800",
  },
  playbackHeroCard: {
    borderColor: "#1d4ed8",
    marginBottom: 14,
  },
  progressWrap: {
    gap: 12,
  },
  progressTrack: {
    backgroundColor: "#dbeafe",
    borderRadius: 999,
    height: 10,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#0f766e",
    borderRadius: 999,
    height: 10,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
    gap: 5,
  },
  progressDot: {
    backgroundColor: "#cbd5e1",
    borderRadius: 999,
    height: 12,
    width: 12,
  },
  progressDotActive: {
    backgroundColor: "#0f766e",
  },
  progressStepLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  progressStepLabelActive: {
    color: "#0f766e",
  },
  statusCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d9e2ea",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  statusTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: 6,
  },
  statusBody: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
  },
  classifierNote: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderRadius: 8,
    borderWidth: 1,
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 12,
    padding: 14,
  },
  playbackStepCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d9e2ea",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  playbackStepCardActive: {
    borderColor: "#0f766e",
    borderWidth: 2,
  },
  playbackStepTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 6,
  },
  resultCard: {
    borderColor: "#0f766e",
    marginTop: 16,
  },
  resultScore: {
    color: "#0f766e",
    fontSize: 44,
    fontWeight: "800",
    lineHeight: 50,
  },
  traceModeText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 12,
  },
  resultLabel: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  resultTitle: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 29,
    marginBottom: 5,
  },
  resultBody: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
    marginBottom: 14,
  },
  signalList: {
    gap: 8,
  },
  signalRow: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  signalLabel: {
    color: "#475569",
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
  },
  signalValue: {
    color: "#0f766e",
    fontSize: 14,
    fontWeight: "800",
  },
  explanationList: {
    gap: 7,
    marginTop: 4,
  },
  explanationText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
});
