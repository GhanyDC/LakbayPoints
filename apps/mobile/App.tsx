import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  MapPin,
  PersonStanding,
  Car,
  CloudRain,
  CarFront,
  TriangleAlert,
  MoreHorizontal,
  Camera,
  Send,
  CircleCheckBig,
} from "lucide-react-native";
import {
  type DimensionValue,
  BackHandler,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView from "react-native-maps";
import {
  calculateTripRewards,
  classifySustainableTripChain,
  demoUserRewardState,
  formatRouteCo2e,
  formatRouteDistance,
  formatRouteFare,
  formatRouteTime,
  getRouteAccessPointLabel,
  getRouteChainLabel,
  phase0APilotRoute,
  phase0ARouteOptions,
  suspiciousTraceRejected,
  type AccessBarrierCategory,
  type AccessBarrierReport,
  type ClassifierResult,
  type ClassifierSignalChecklist,
  type RewardResult,
  type ReportSeverity,
  type RouteOption,
  type RouteSegment,
  validSustainableGuadalupeCubaoTrace,
} from "@lakbaypoints/shared";
import {
  BottomTabBar,
  type BottomTabName,
  PlanTripScreen,
  RewardsOverviewScreen,
} from "./NewScreens";

const arrow = "\u2192";
const sustainableRoute = phase0APilotRoute;

type ScreenName =
  | "home"
  | "comparison"
  | "detail"
  | "playback"
  | "rewards"
  | "report"
  | "reportConfirmation"
  | "dashboardPreview"
  | "rewardsOverview"
  | "profile"
  | "planTrip";

type TraceMode = "valid" | "suspicious";
type VerifiedTripState = {
  classifierResult: ClassifierResult;
  traceMode: TraceMode;
};
type ReportCategoryOption = {
  label: string;
  value: AccessBarrierCategory;
  Icon: any;
  color: string;
};
type DemoReportLocation = {
  label: string;
  latitude: number;
  longitude: number;
};
type SubmittedReportState = AccessBarrierReport & {
  categoryLabel: string;
  locationLabel: string;
};

type PlaybackStep = {
  segmentId: string;
  status: string;
};

const tabDestinations: Record<BottomTabName, ScreenName> = {
  home: "home",
  trips: "planTrip",
  rewards: "rewardsOverview",
  report: "report",
  profile: "profile",
};

const screenTabs: Record<ScreenName, BottomTabName> = {
  home: "home",
  planTrip: "trips",
  comparison: "trips",
  detail: "trips",
  playback: "trips",
  rewards: "rewards",
  rewardsOverview: "rewards",
  report: "report",
  reportConfirmation: "report",
  dashboardPreview: "report",
  profile: "profile",
};

const hardwareBackDestinations: Partial<Record<ScreenName, ScreenName>> = {
  comparison: "planTrip",
  detail: "comparison",
  playback: "detail",
  rewards: "playback",
  rewardsOverview: "planTrip",
  report: "planTrip",
  reportConfirmation: "report",
  dashboardPreview: "reportConfirmation",
  profile: "home",
};

const playbackSteps: PlaybackStep[] = [
  {
    segmentId: "jeepney-cubao-access-to-mrt3",
    status: "Public-road access segment detected",
  },
  {
    segmentId: "mrt3-araneta-cubao-to-guadalupe",
    status: "MRT-3 segment in progress",
  },
  {
    segmentId: "walk-guadalupe-mrt-to-ferry",
    status: "Walking transfer segment detected",
  },
  {
    segmentId: "ferry-guadalupe-to-hulo",
    status: "Ferry transfer segment detected",
  },
  {
    segmentId: "walk-hulo-ferry-to-office",
    status: "Approaching demo destination",
  },
];

const reportCategories: ReportCategoryOption[] = [
  {
    label: "Sidewalk\nObstruction",
    value: "sidewalk_obstruction",
    Icon: PersonStanding,
    color: "#eab308",
  },
  {
    label: "Illegal\nParking",
    value: "illegal_parking",
    Icon: Car,
    color: "#1e3a8a",
  },
  {
    label: "Flooding",
    value: "flooding",
    Icon: CloudRain,
    color: "#2563eb",
  },
  {
    label: "Road\nCrash",
    value: "road_crash",
    Icon: CarFront,
    color: "#dc2626",
  },
  {
    label: "Pothole",
    value: "pothole",
    Icon: TriangleAlert,
    color: "#6b7280",
  },
  {
    label: "Other",
    value: "other",
    Icon: MoreHorizontal,
    color: "#4b5563",
  },
];

const reportSeverityOptions: ReportSeverity[] = ["Low", "Medium", "High"];

const demoReportLocations: DemoReportLocation[] = [
  {
    label: "Guadalupe Station access area",
    latitude: 14.5664,
    longitude: 121.0455,
  },
  {
    label: "Shaw Boulevard access area",
    latitude: 14.5818,
    longitude: 121.0531,
  },
  {
    label: "Ortigas Station access area",
    latitude: 14.5868,
    longitude: 121.056,
  },
  {
    label: "Cubao Station access area",
    latitude: 14.6196,
    longitude: 121.051,
  },
];

function readableTripChain(route: RouteOption) {
  return getRouteChainLabel(route);
}

function formatMode(mode: RouteSegment["mode"]) {
  const labels: Record<RouteSegment["mode"], string> = {
    walk: "Walk",
    mrt: "MRT3",
    bus: "Bus",
    jeepney: "Jeepney",
    public_road_transport: "Public road transport",
    ferry: "Ferry",
    bike: "Bike",
    ebike: "E-bike",
    private_vehicle: "Private vehicle",
  };

  return labels[mode];
}

function segmentStepTitle(segment: RouteSegment, index: number) {
  void index;
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
          <Text style={styles.dataStatusLabel}>{route.dataStatusLabel}</Text>
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
          <Text style={styles.metricValue}>{formatRouteTime(route)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Fare / cost</Text>
          <Text style={styles.metricValue}>{formatRouteFare(route)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Distance</Text>
          <Text style={styles.metricValue}>{formatRouteDistance(route)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Access</Text>
          <Text style={styles.metricValue}>{route.accessScore}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Estimated CO2e avoided</Text>
          <Text style={styles.metricValue}>{formatRouteCo2e(route)}</Text>
        </View>
        {route.lakbayScoreReward ? (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Potential Lakbay Score</Text>
            <Text style={styles.metricValue}>+{route.lakbayScoreReward}</Text>
          </View>
        ) : null}
        {route.campaignPointsReward ? (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Potential campaign Points</Text>
            <Text style={styles.metricValue}>
              up to +{route.campaignPointsReward}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.noteGroup}>
        <Text style={styles.note}>{route.disclaimer}</Text>
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
  const origin = getRouteAccessPointLabel(
    sustainableRoute,
    sustainableRoute.originAccessPointId,
  );
  const destination = getRouteAccessPointLabel(
    sustainableRoute,
    sustainableRoute.destinationAccessPointId,
  );

  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.corridorPill}>
        <Text style={styles.corridorText}>
          {origin} {arrow} {destination}
        </Text>
      </View>
    </View>
  );
}

function MetricGrid({ route }: { route: RouteOption }) {
  return (
    <View style={styles.metricGrid}>
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Time</Text>
        <Text style={styles.metricValue}>{formatRouteTime(route)}</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Fare / cost</Text>
        <Text style={styles.metricValue}>{formatRouteFare(route)}</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Distance</Text>
        <Text style={styles.metricValue}>{formatRouteDistance(route)}</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Access</Text>
        <Text style={styles.metricValue}>{route.accessScore}</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Estimated CO2e avoided</Text>
        <Text style={styles.metricValue}>{formatRouteCo2e(route)}</Text>
      </View>
      {route.lakbayScoreReward ? (
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Potential Lakbay Score</Text>
          <Text style={styles.metricValue}>+{route.lakbayScoreReward}</Text>
        </View>
      ) : null}
      {route.campaignPointsReward ? (
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Potential campaign Points</Text>
          <Text style={styles.metricValue}>
            up to +{route.campaignPointsReward}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function RouteComparisonScreen({ onStartTrip }: { onStartTrip: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="Guide the Trip. Verify the Shift. Improve Access."
        subtitle="A Verified Multimodal Mode-Shift Platform for Metro Manila"
      />

      <View style={styles.routeList}>
        {phase0ARouteOptions.map((route) => (
          <RouteCard key={route.id} route={route} onStartTrip={onStartTrip} />
        ))}
      </View>

      <Text style={styles.prototypeNote}>
        Static prototype route options; no live routing, traffic, schedule, or
        environmental-impact data.
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
              <Text style={styles.stepMode}>{segment.displayMode}</Text>
              <Text style={styles.stepTitle}>
                {segmentStepTitle(segment, index)}
              </Text>
              <Text style={styles.stepRoute}>
                {getRouteAccessPointLabel(route, segment.originAccessPointId)}{" "}
                {arrow}{" "}
                {getRouteAccessPointLabel(
                  route,
                  segment.destinationAccessPointId,
                )}
              </Text>
              <Text style={styles.stepMeta}>
                {segment.travelTimeMin === null
                  ? "Travel time pending"
                  : `${segment.travelTimeMin} min travel`}
                {segment.waitDwellTimeMin === null
                  ? " · Wait/dwell pending"
                  : ` · ${segment.waitDwellTimeMin} min wait/dwell`}
                {segment.distanceKm === null
                  ? " · Distance pending"
                  : ` · ${segment.distanceKm.toFixed(1)} km`}
              </Text>
              <Text style={styles.stepMeta}>
                Fare:{" "}
                {segment.farePhp === null
                  ? (segment.fareDisplay ?? "To be confirmed")
                  : `PHP ${segment.farePhp}`}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.infoNote}>
        {route.dataStatusLabel}. {route.disclaimer}
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
  onViewRewards,
}: {
  route: RouteOption;
  onBackToDetail: () => void;
  onViewRewards: (
    classifierResult: ClassifierResult,
    traceMode: TraceMode,
  ) => void;
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
        <Text style={styles.detailTitle}>
          {getRouteAccessPointLabel(route, route.originAccessPointId)} {arrow}{" "}
          {getRouteAccessPointLabel(route, route.destinationAccessPointId)}
        </Text>
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
              <Text style={styles.stepMode}>{segment.displayMode}</Text>
              <Text style={styles.stepMeta}>
                {playbackSteps[index]?.status}
              </Text>
            </View>
            <Text style={styles.stepTitle}>
              {segmentStepTitle(segment, index)}
            </Text>
            <Text style={styles.stepRoute}>
              {getRouteAccessPointLabel(route, segment.originAccessPointId)}{" "}
              {arrow}{" "}
              {getRouteAccessPointLabel(
                route,
                segment.destinationAccessPointId,
              )}
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
        {classifierResult ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onViewRewards(classifierResult, traceMode)}
            style={styles.primaryAction}
          >
            <Text style={styles.primaryActionText}>View Rewards</Text>
          </Pressable>
        ) : null}
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

function RewardMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function RewardResultScreen({
  route,
  verifiedTrip,
  onReportAccessBarrier,
  onBackToRoutes,
}: {
  route: RouteOption;
  verifiedTrip: VerifiedTripState;
  onReportAccessBarrier: () => void;
  onBackToRoutes: () => void;
}) {
  const rewardResult: RewardResult = useMemo(
    () =>
      calculateTripRewards({
        classifierResult: verifiedTrip.classifierResult,
        selectedRoute: route,
        currentUserRewardState: demoUserRewardState,
      }),
    [route, verifiedTrip.classifierResult],
  );
  const traceLabel =
    verifiedTrip.traceMode === "valid"
      ? "Valid sustainable trip"
      : "Suspicious trace";

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader eyebrow="Reward the Shift" title="Reward the Shift" />

      <View style={[styles.card, styles.rewardHeroCard]}>
        <Text style={styles.sectionKicker}>Verification result summary</Text>
        <Text style={styles.detailTitle}>
          {verifiedTrip.classifierResult.result}
        </Text>
        <Text style={styles.traceModeText}>
          {traceLabel} - Confidence Score:{" "}
          {verifiedTrip.classifierResult.confidenceScore}%
        </Text>
        <Text style={styles.resultBody}>
          Reward Eligibility: {verifiedTrip.classifierResult.rewardEligibility}
        </Text>
      </View>

      <View style={styles.metricGrid}>
        <RewardMetric
          label="Lakbay Score earned"
          value={`+${rewardResult.lakbayScoreEarned}`}
        />
        <RewardMetric
          label="campaign Points earned"
          value={`+${rewardResult.campaignPointsEarned}`}
        />
        <RewardMetric
          label="Updated campaign Points"
          value={`${rewardResult.updatedCampaignPoints}`}
        />
        <RewardMetric
          label="Updated Lakbay Score"
          value={`${rewardResult.updatedLakbayScore}`}
        />
        <RewardMetric
          label="Campaign cap remaining"
          value={`${rewardResult.campaignCapRemaining} points`}
        />
        <RewardMetric
          label="Estimated CO2e avoided"
          value={
            route.estimatedCo2eAvoidedKg === null
              ? "Pending pilot calibration"
              : `${rewardResult.estimatedCo2eAvoidedKg} kg`
          }
        />
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.sectionKicker}>Reward message</Text>
        <Text style={styles.statusBody}>{rewardResult.rewardMessage}</Text>
      </View>

      <Text style={styles.infoNote}>
        Lakbay Score is a non-cash progress meter. campaign Points are capped,
        campaign-based incentives for verified sustainable trip chains.
      </Text>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onReportAccessBarrier}
          style={styles.primaryAction}
        >
          <Text style={styles.primaryActionText}>Report an Access Barrier</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBackToRoutes}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>Back to Routes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.optionButton, selected && styles.optionButtonSelected]}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ReportAccessBarrierScreen({
  onSubmitReport,
  onBackToRoutes,
}: {
  onSubmitReport: (report: SubmittedReportState) => void;
  onBackToRoutes: () => void;
}) {
  const [category, setCategory] = useState<ReportCategoryOption | null>(null);
  const [severity, setSeverity] = useState<ReportSeverity | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const submitReport = () => {
    const cleanDescription = description.trim();

    if (!category || !severity) {
      setValidationMessage(
        "Please select a category and severity.",
      );
      return;
    }

    setValidationMessage("");
    onSubmitReport({
      id: `prototype-report-${Date.now()}`,
      category: category.value,
      categoryLabel: category.label.replace("\n", " "),
      severity,
      description: cleanDescription,
      latitude: 14.5664,
      longitude: 121.0455,
      locationLabel: "Your Location",
      photoUrl,
      status: "Submitted",
      createdAt: new Date().toISOString(),
    });
  };

  const handlePhotoUpload = () => {
    setPhotoUrl("file:///mock-photo-url.jpg");
  };

  return (
    <ScrollView contentContainerStyle={styles.reportContent}>
      <View style={styles.reportTopBar}>
        <View style={{ width: 24 }} />
        <Text style={styles.reportTopBarTitle}>Report an Issue</Text>
        <Bell color="#1e3a8a" size={24} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 14.5664,
            longitude: 121.0455,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
        <View style={styles.mapPinOverlay}>
          <View style={styles.mapPinContainer}>
            <MapPin color="#fff" size={24} />
          </View>
        </View>
        <View style={styles.locationPill}>
          <MapPin color="#2563eb" size={14} />
          <Text style={styles.locationPillText}>Your Location</Text>
        </View>
      </View>

      <Text style={styles.reportSectionTitle}>What's the issue?</Text>
      
      <View style={styles.reportGrid}>
        {reportCategories.map((option) => {
          const isSelected = category?.value === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.reportGridItem, isSelected && styles.reportGridItemSelected]}
              onPress={() => setCategory(option)}
            >
              <View style={[styles.reportIconHexagonOuter, { borderColor: option.color }]}>
                <View style={[styles.reportIconHexagonInner, { backgroundColor: option.color }]}>
                  <option.Icon color="#fff" size={24} />
                </View>
              </View>
              <Text style={styles.reportGridLabel}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.reportSectionHeader}>
        <Text style={styles.reportSectionTitle}>Severity Level</Text>
      </View>

      <View style={styles.severityGrid}>
        {reportSeverityOptions.map((option) => {
          const isSelected = severity === option;
          return (
            <Pressable
              key={option}
              style={[
                styles.severityItem,
                isSelected && styles.severityItemSelected,
              ]}
              onPress={() => setSeverity(option)}
            >
              <Text
                style={[
                  styles.severityText,
                  isSelected && styles.severityTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.reportSectionHeader}>
        <Text style={styles.reportSectionTitle}>Add a photo <Text style={styles.reportOptional}>(optional)</Text></Text>
      </View>

      <Pressable style={styles.photoUploadButton} onPress={handlePhotoUpload}>
        {photoUrl ? (
          <>
            <CircleCheckBig color="#16a34a" size={28} />
            <View style={styles.photoUploadTexts}>
              <Text style={styles.photoUploadTitle}>Photo attached</Text>
              <Text style={styles.photoUploadSub}>mock-photo-url.jpg</Text>
            </View>
          </>
        ) : (
          <>
            <Camera color="#2563eb" size={28} />
            <View style={styles.photoUploadTexts}>
              <Text style={styles.photoUploadTitle}>Tap to upload a photo</Text>
              <Text style={styles.photoUploadSub}>JPG, PNG up to 10MB</Text>
            </View>
          </>
        )}
      </Pressable>

      <View style={styles.reportSectionHeader}>
        <Text style={styles.reportSectionTitle}>Details <Text style={styles.reportOptional}>(optional)</Text></Text>
      </View>

      <View style={styles.detailsInputContainer}>
        <TextInput
          multiline
          onChangeText={setDescription}
          placeholder="Provide a short description of the issue..."
          placeholderTextColor="#9ca3af"
          style={styles.detailsInput}
          textAlignVertical="top"
          value={description}
        />
        <Text style={styles.charCount}>{description.length}/300</Text>
      </View>

      {validationMessage ? (
        <Text style={styles.validationTextError}>{validationMessage}</Text>
      ) : null}

      <Pressable style={styles.submitReportButton} onPress={submitReport}>
        <Send color="#fff" size={20} style={{ marginRight: 10 }} />
        <Text style={styles.submitReportButtonText}>Submit Report</Text>
      </Pressable>
      
      <View style={styles.reportDisclaimerRow}>
        <CircleCheckBig color="#16a34a" size={14} />
        <Text style={styles.reportDisclaimerText}>Your report helps keep our roads safe and better for everyone.</Text>
      </View>
    </ScrollView>
  );
}

function ConfirmationRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.confirmationRow}>
      <Text style={styles.confirmationLabel}>{label}</Text>
      <Text style={styles.confirmationValue}>{value}</Text>
    </View>
  );
}

function ReportConfirmationScreen({
  report,
  onDashboardPreview,
  onBackToRoutes,
}: {
  report: SubmittedReportState;
  onDashboardPreview: () => void;
  onBackToRoutes: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="Improve the Road"
        title="Report submitted"
        subtitle="Access barrier report"
      />

      <View style={[styles.card, styles.reportIntroCard]}>
        <Text style={styles.statusBody}>
          Your report has been added to the prototype agency dashboard queue for
          validation in this prototype.
        </Text>
      </View>

      <View style={styles.card}>
        <ConfirmationRow label="Category" value={report.categoryLabel} />
        <ConfirmationRow label="Severity" value={report.severity} />
        <ConfirmationRow label="Location" value={report.locationLabel} />
        <ConfirmationRow label="Status" value={report.status} />
      </View>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onDashboardPreview}
          style={styles.primaryAction}
        >
          <Text style={styles.primaryActionText}>
            View Agency Dashboard Preview
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBackToRoutes}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>Back to Routes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function DashboardPreviewPlaceholderScreen({
  report,
  onBackToConfirmation,
  onBackToRoutes,
}: {
  report: SubmittedReportState | null;
  onBackToConfirmation: () => void;
  onBackToRoutes: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="Agency Dashboard"
        title="Dashboard Preview"
        subtitle="Report queue placeholder"
      />

      <View style={[styles.card, styles.dashboardPlaceholderCard]}>
        <Text style={styles.sectionKicker}>
          Coming next: Agency Dashboard Preview
        </Text>
        <Text style={styles.statusBody}>
          This placeholder shows where the submitted report will appear in the
          dashboard queue. Full dashboard integration is not part of this mobile
          slice.
        </Text>
      </View>

      {report ? (
        <View style={styles.card}>
          <ConfirmationRow label="Queued report" value={report.id} />
          <ConfirmationRow label="Category" value={report.categoryLabel} />
          <ConfirmationRow label="Location" value={report.locationLabel} />
          <ConfirmationRow label="Status" value={report.status} />
        </View>
      ) : null}

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onBackToConfirmation}
          style={styles.primaryAction}
        >
          <Text style={styles.primaryActionText}>Back to Confirmation</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onBackToRoutes}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>Back to Routes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function HomeScreen({
  route,
  onPlanTrip,
  onCompareRoutes,
}: {
  route: RouteOption;
  onPlanTrip: () => void;
  onCompareRoutes: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="Guide the Trip. Verify the Shift. Improve Access."
        subtitle="A Verified Multimodal Mode-Shift Platform for Metro Manila"
      />

      <View style={[styles.card, styles.homeHeroCard]}>
        <Text style={styles.sectionKicker}>Phase 0A pilot</Text>
        <Text style={styles.detailTitle}>Welcome to LakbayPoints</Text>
        <Text style={styles.statusBody}>
          Review the static multimodal pilot journey, compare qualified route
          options, and continue to prototype verification.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionKicker}>Recommended journey</Text>
        <Text style={styles.detailTitle}>{route.name}</Text>
        <Text style={styles.detailChain}>{readableTripChain(route)}</Text>
        <MetricGrid route={route} />
      </View>

      <Text style={styles.infoNote}>
        {route.dataStatusLabel}. {route.disclaimer}
      </Text>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onPlanTrip}
          style={styles.primaryAction}
        >
          <Text style={styles.primaryActionText}>Plan the Pilot Trip</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCompareRoutes}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>Compare Route Options</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function ProfileScreen({ onPlanTrip }: { onPlanTrip: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="Prototype Profile"
        title="Profile Preview"
        subtitle="Session-only Phase 0A experience"
      />

      <View style={[styles.card, styles.profileCard]}>
        <Text style={styles.sectionKicker}>No live account connected</Text>
        <Text style={styles.detailTitle}>Prototype commuter profile</Text>
        <Text style={styles.statusBody}>
          Authentication, persistent trip history, personal wallets, and live
          profile services are outside the Phase 0A prototype.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onPlanTrip}
        style={styles.primaryAction}
      >
        <Text style={styles.primaryActionText}>Go to Trip Planning</Text>
      </Pressable>
    </ScrollView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("planTrip");
  const [verifiedTrip, setVerifiedTrip] = useState<VerifiedTripState | null>(
    null,
  );
  const [submittedReport, setSubmittedReport] =
    useState<SubmittedReportState | null>(null);
  const route = useMemo(() => sustainableRoute, []);
  const activeTab = screenTabs[screen];

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const destination = hardwareBackDestinations[screen];
        if (!destination) {
          return false;
        }

        setScreen(destination);
        return true;
      },
    );

    return () => subscription.remove();
  }, [screen]);

  const backToRoutes = () => {
    setVerifiedTrip(null);
    setSubmittedReport(null);
    setScreen("comparison");
  };

  const handleTabSelect = (tab: BottomTabName) => {
    if (tab === "rewards" && verifiedTrip) {
      setScreen("rewards");
      return;
    }

    setScreen(tabDestinations[tab]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        {screen === "home" ? (
          <HomeScreen
            route={route}
            onPlanTrip={() => setScreen("planTrip")}
            onCompareRoutes={() => setScreen("comparison")}
          />
        ) : null}
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
            onViewRewards={(classifierResult, traceMode) => {
              setVerifiedTrip({ classifierResult, traceMode });
              setScreen("rewards");
            }}
          />
        ) : null}
        {screen === "rewards" && verifiedTrip ? (
          <RewardResultScreen
            route={route}
            verifiedTrip={verifiedTrip}
            onReportAccessBarrier={() => setScreen("report")}
            onBackToRoutes={backToRoutes}
          />
        ) : null}
        {screen === "report" ? (
          <ReportAccessBarrierScreen
            onSubmitReport={(report) => {
              setSubmittedReport(report);
              setScreen("reportConfirmation");
            }}
            onBackToRoutes={backToRoutes}
          />
        ) : null}
        {screen === "reportConfirmation" && submittedReport ? (
          <ReportConfirmationScreen
            report={submittedReport}
            onDashboardPreview={() => setScreen("dashboardPreview")}
            onBackToRoutes={backToRoutes}
          />
        ) : null}
        {screen === "dashboardPreview" ? (
          <DashboardPreviewPlaceholderScreen
            report={submittedReport}
            onBackToConfirmation={() => setScreen("reportConfirmation")}
            onBackToRoutes={backToRoutes}
          />
        ) : null}
        {screen === "rewardsOverview" ? (
          <RewardsOverviewScreen onPlanTrip={() => setScreen("planTrip")} />
        ) : null}
        {screen === "profile" ? (
          <ProfileScreen onPlanTrip={() => setScreen("planTrip")} />
        ) : null}
        {screen === "planTrip" ? (
          <PlanTripScreen
            route={route}
            onCompareRoutes={() => setScreen("comparison")}
          />
        ) : null}
      </View>
      <BottomTabBar activeTab={activeTab} onTabSelect={handleTabSelect} />
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
  dataStatusLabel: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
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
  homeHeroCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    marginBottom: 14,
  },
  profileCard: {
    backgroundColor: "#f8fafc",
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
  optionButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionButtonSelected: {
    backgroundColor: "#ccfbf1",
    borderColor: "#0f766e",
  },
  optionText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 19,
    textAlign: "center",
  },
  optionTextSelected: {
    color: "#0f766e",
  },
  reportIntroCard: {
    borderColor: "#0f766e",
    marginBottom: 16,
  },
  helperNote: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
    marginBottom: 8,
  },
  fieldHelp: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 8,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    minHeight: 112,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  photoPlaceholder: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 86,
    padding: 14,
  },
  photoPlaceholderText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
  },
  validationText: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderRadius: 8,
    borderWidth: 1,
    color: "#991b1b",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    marginTop: 2,
    padding: 12,
  },
  confirmationRow: {
    borderBottomColor: "#e2e8f0",
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 10,
  },
  confirmationLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  confirmationValue: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
  },
  dashboardPlaceholderCard: {
    borderColor: "#1d4ed8",
    marginBottom: 14,
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
  rewardHeroCard: {
    borderColor: "#0f766e",
    marginBottom: 14,
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
  reportContent: {
    padding: 20,
    paddingBottom: 36,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  reportTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  reportTopBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  mapContainer: {
    height: 180,
    backgroundColor: "#e2e8f0",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    position: "relative",
    alignItems: "center",
  },
  mapPinOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPinContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  locationPill: {
    position: "absolute",
    bottom: -16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  locationPillText: {
    color: "#1e3a8a",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  reportSectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  reportSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  reportOptional: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "400",
  },
  reportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  reportGridItem: {
    width: "31%",
    alignItems: "center",
    marginBottom: 20,
  },
  reportGridItemSelected: {
    opacity: 0.7,
  },
  reportIconHexagonOuter: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  reportIconHexagonInner: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reportGridLabel: {
    fontSize: 11,
    color: "#334155",
    fontWeight: "600",
    textAlign: "center",
  },
  severityGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  severityItem: {
    width: "31%",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  severityItemSelected: {
    backgroundColor: "#1e3a8a",
    borderColor: "#1e3a8a",
  },
  severityText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },
  severityTextSelected: {
    color: "#fff",
  },
  photoUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
  },
  photoUploadTexts: {
    marginLeft: 12,
  },
  photoUploadTitle: {
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "600",
  },
  photoUploadSub: {
    color: "#64748b",
    fontSize: 11,
  },
  detailsInputContainer: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    height: 120,
    position: "relative",
  },
  detailsInput: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
  },
  charCount: {
    position: "absolute",
    bottom: 12,
    right: 16,
    fontSize: 11,
    color: "#9ca3af",
  },
  validationTextError: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  submitReportButton: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  submitReportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  reportDisclaimerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reportDisclaimerText: {
    color: "#475569",
    fontSize: 11,
    marginLeft: 6,
  },
});
