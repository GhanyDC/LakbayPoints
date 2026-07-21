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
  Footprints,
  Train,
  Bus,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Navigation,
} from "lucide-react-native";
import {
  type DimensionValue,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
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
    <View style={[styles.routeOptionCard, isRecommended && styles.routeOptionCardRecommended]}>
      <View style={styles.routeOptionHeader}>
        <View style={styles.routeOptionTitleRow}>
          <Text style={styles.routeOptionName}>{route.name}</Text>
          {isRecommended ? (
            <View style={styles.recommendedChip}>
              <Sparkles color="#b45309" size={12} />
              <Text style={styles.recommendedChipText}>Recommended</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.routeOptionChain}>{readableTripChain(route)}</Text>
      </View>

      <View style={styles.routeMetricsGrid}>
        <View style={styles.routeMetricItem}>
          <Text style={styles.routeMetricLabel}>Time</Text>
          <Text style={styles.routeMetricValue}>{formatRouteTime(route)}</Text>
        </View>
        <View style={styles.routeMetricItem}>
          <Text style={styles.routeMetricLabel}>Fare</Text>
          <Text style={styles.routeMetricValue}>{formatRouteFare(route)}</Text>
        </View>
        <View style={styles.routeMetricItem}>
          <Text style={styles.routeMetricLabel}>CO2 Avoided</Text>
          <Text style={[styles.routeMetricValue, { color: "#16a34a" }]}>{formatRouteCo2e(route)}</Text>
        </View>
        {route.lakbayScoreReward ? (
          <View style={styles.routeMetricItem}>
            <Text style={styles.routeMetricLabel}>Lakbay Score</Text>
            <Text style={[styles.routeMetricValue, { color: "#2563eb" }]}>+{route.lakbayScoreReward}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.routeNoteGroup}>
        <AlertCircle color="#64748b" size={14} />
        <Text style={styles.routeNoteText}>{route.disclaimer}</Text>
      </View>

      {isRecommended ? (
        <Pressable accessibilityRole="button" onPress={onStartTrip} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Select Route</Text>
          <ChevronRight color="#fff" size={20} />
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
    <View style={styles.modernHeader}>
      <Text style={styles.modernEyebrow}>{eyebrow}</Text>
      <Text style={styles.modernTitle}>{title}</Text>
      {subtitle ? <Text style={styles.modernSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function RouteComparisonScreen({ onStartTrip }: { onStartTrip: () => void }) {
  const origin = getRouteAccessPointLabel(sustainableRoute, sustainableRoute.originAccessPointId);
  const destination = getRouteAccessPointLabel(sustainableRoute, sustainableRoute.destinationAccessPointId);

  return (
    <ScrollView contentContainerStyle={styles.mainContainer} bounces={false}>
      <View style={styles.modernTopBar}>
        <View style={{ width: 24 }} />
        <Text style={styles.modernTopBarTitle}>Compare Routes</Text>
        <Bell color="#1e3a8a" size={24} />
      </View>

      <View style={styles.corridorBlock}>
        <View style={styles.corridorInputArea}>
          <View style={styles.corridorRow}>
            <View style={styles.dotOrigin} />
            <Text style={styles.corridorText} numberOfLines={1}>{origin}</Text>
          </View>
          <View style={styles.corridorDivider} />
          <View style={styles.corridorRow}>
            <View style={styles.dotDest} />
            <Text style={styles.corridorText} numberOfLines={1}>{destination}</Text>
          </View>
        </View>
      </View>

      <View style={styles.routeList}>
        {phase0ARouteOptions.map((route) => (
          <RouteCard key={route.id} route={route} onStartTrip={onStartTrip} />
        ))}
      </View>
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
    <ScrollView contentContainerStyle={styles.mainContainer} bounces={false}>
      <View style={styles.modernTopBar}>
        <Pressable onPress={onBack} style={{ padding: 4, marginLeft: -4 }}>
          <ChevronRight color="#1e3a8a" size={24} style={{ transform: [{ rotate: "180deg" }] }} />
        </Pressable>
        <Text style={styles.modernTopBarTitle}>Route Details</Text>
        <Bell color="#1e3a8a" size={24} />
      </View>

      <View style={styles.routeMapArea}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 14.5864,
            longitude: 121.0455,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
        <View style={styles.routeMapOverlay}>
          <View style={styles.mapPinContainer}>
            <Navigation color="#fff" size={24} />
          </View>
        </View>
      </View>

      <View style={styles.routeDetailCard}>
        <Text style={styles.routeDetailCardTitle}>{route.name}</Text>
        
        <View style={styles.routeMetricsGrid}>
          <View style={styles.routeMetricItem}>
            <Text style={styles.routeMetricLabel}>Time</Text>
            <Text style={styles.routeMetricValue}>{formatRouteTime(route)}</Text>
          </View>
          <View style={styles.routeMetricItem}>
            <Text style={styles.routeMetricLabel}>Fare</Text>
            <Text style={styles.routeMetricValue}>{formatRouteFare(route)}</Text>
          </View>
          <View style={styles.routeMetricItem}>
            <Text style={styles.routeMetricLabel}>Distance</Text>
            <Text style={styles.routeMetricValue}>{formatRouteDistance(route)}</Text>
          </View>
          <View style={styles.routeMetricItem}>
            <Text style={styles.routeMetricLabel}>CO2 Avoided</Text>
            <Text style={[styles.routeMetricValue, { color: "#16a34a" }]}>{formatRouteCo2e(route)}</Text>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          {route.segments.map((segment, index) => {
            const isLast = index === route.segments.length - 1;
            const mode = segment.mode;
            let IconComp = Footprints;
            let iconColor = "#2563eb"; // blue for walk
            let bgColor = "#eff6ff";
            
            if (mode === "mrt") {
              IconComp = Train;
              iconColor = "#fff";
              bgColor = "#1e3a8a"; // dark blue for transit
            } else if (mode === "bus" || mode === "jeepney") {
              IconComp = Bus;
              iconColor = "#fff";
              bgColor = "#1e3a8a";
            }
            
            return (
              <View style={styles.timelineRow} key={segment.id}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineIconNode, { backgroundColor: bgColor }]}>
                    <IconComp color={iconColor} size={16} />
                  </View>
                  {!isLast && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    {mode !== "walk" && (
                      <View style={[styles.transitBadge, { backgroundColor: bgColor }]}>
                        <Text style={styles.transitBadgeText}>{segment.displayMode.toUpperCase()}</Text>
                      </View>
                    )}
                    <Text style={styles.timelineTitle}>{segmentStepTitle(segment, index)}</Text>
                  </View>
                  <Text style={styles.timelineSub}>
                    {segment.travelTimeMin ? `${segment.travelTimeMin} min` : 'Travel pending'}
                    {segment.waitDwellTimeMin ? ` • Every ${segment.waitDwellTimeMin} min` : ''}
                  </Text>
                </View>
                <View style={styles.timelineTimeRight}>
                  <Text style={styles.timelineTimeText}>{segment.travelTimeMin ? `${segment.travelTimeMin} min` : '-'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable accessibilityRole="button" onPress={onBeginPlayback} style={styles.primaryButtonLarge}>
          <Text style={styles.primaryButtonText}>Begin Trip Playback</Text>
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
    <View style={styles.playbackProgressWrap}>
      <View style={styles.playbackProgressTrack}>
        <View style={[styles.playbackProgressFill, { width: progressWidth }]} />
      </View>
      <View style={styles.playbackProgressSteps}>
        {route.segments.map((segment, index) => {
          let IconComp = Footprints;
          if (segment.mode === "mrt") IconComp = Train;
          else if (segment.mode === "bus" || segment.mode === "jeepney") IconComp = Bus;
          const isActive = index <= activeIndex;
          return (
            <View style={styles.playbackProgressStep} key={segment.id}>
              <View style={[styles.playbackProgressDot, isActive && styles.playbackProgressDotActive]}>
                <IconComp color={isActive ? "#fff" : "#9ca3af"} size={14} />
              </View>
            </View>
          );
        })}
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
  onViewRewards: (classifierResult: ClassifierResult, traceMode: TraceMode) => void;
}) {
  const [traceMode, setTraceMode] = useState<TraceMode>("valid");
  const [classifierResult, setClassifierResult] = useState<ClassifierResult | null>(null);
  const resultVisible = classifierResult !== null;
  const activeIndex = resultVisible ? route.segments.length - 1 : 1;
  const currentSegment = route.segments[activeIndex];
  const currentStatus = playbackSteps[activeIndex]?.status ?? "Trip segment in progress";
  const runVerification = (mode: TraceMode) => {
    const gpsTrace = mode === "valid" ? validSustainableGuadalupeCubaoTrace : suspiciousTraceRejected;
    setTraceMode(mode);
    setClassifierResult(
      classifySustainableTripChain({ selectedRoute: route, gpsTrace }),
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.mainContainer} bounces={false}>
      <View style={styles.modernTopBar}>
        <Pressable onPress={onBackToDetail} style={{ padding: 4, marginLeft: -4 }}>
          <ChevronRight color="#1e3a8a" size={24} style={{ transform: [{ rotate: "180deg" }] }} />
        </Pressable>
        <Text style={styles.modernTopBarTitle}>Active Trip</Text>
        <Bell color="#1e3a8a" size={24} />
      </View>

      <View style={styles.routeMapArea}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{ latitude: 14.5864, longitude: 121.0455, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
        <View style={styles.routeMapOverlay}>
          <View style={[styles.mapPinContainer, { backgroundColor: "#16a34a" }]}>
            <Navigation color="#fff" size={24} />
          </View>
        </View>
      </View>

      <View style={[styles.routeDetailCard, { flex: 1 }]}>
        <Text style={styles.routeOptionName}>Trip in Progress</Text>
        <Text style={styles.routeNoteText}>{getRouteAccessPointLabel(route, route.originAccessPointId)} {arrow} {getRouteAccessPointLabel(route, route.destinationAccessPointId)}</Text>
        
        <ProgressIndicator activeIndex={activeIndex} route={route} />

        <View style={styles.activeStatusBox}>
          <Text style={styles.activeStatusLabel}>CURRENT STATUS</Text>
          <Text style={styles.activeStatusTitle}>{currentSegment ? segmentStepTitle(currentSegment, activeIndex) : "Trip playback"}</Text>
          <Text style={styles.activeStatusBody}>{currentStatus}</Text>
        </View>

        {classifierResult ? (
          <View style={[styles.verificationResultCard, traceMode === "valid" ? styles.verificationValid : styles.verificationSuspicious]}>
            <View style={styles.verificationResultHeader}>
              <Text style={styles.verificationResultTitle}>{classifierResult.result}</Text>
              <Text style={styles.verificationResultScore}>{classifierResult.confidenceScore}% Score</Text>
            </View>
            <Text style={styles.verificationResultBody}>Reward Eligibility: {classifierResult.rewardEligibility}</Text>
            
            <View style={styles.signalList}>
              {classifierSignalRows(classifierResult.signals).map(([label, value]) => (
                <View style={styles.signalRow} key={label}>
                  <Text style={styles.signalLabel}>{label}</Text>
                  <Text style={styles.signalValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ marginTop: 24, gap: 12 }}>
          {classifierResult ? (
            <Pressable accessibilityRole="button" onPress={() => onViewRewards(classifierResult, traceMode)} style={styles.primaryButtonLarge}>
              <Text style={styles.primaryButtonText}>View Rewards</Text>
            </Pressable>
          ) : (
            <>
              <Pressable accessibilityRole="button" onPress={() => runVerification("valid")} style={styles.primaryButtonLarge}>
                <Text style={styles.primaryButtonText}>Complete Trip (Valid Trace)</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => runVerification("suspicious")} style={[styles.primaryButtonLarge, { backgroundColor: "#ef4444" }]}>
                <Text style={styles.primaryButtonText}>Test Suspicious Trace</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </ScrollView>
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
    () => calculateTripRewards({ classifierResult: verifiedTrip.classifierResult, selectedRoute: route, currentUserRewardState: demoUserRewardState }),
    [route, verifiedTrip.classifierResult],
  );

  return (
    <ScrollView contentContainerStyle={styles.mainContainer} bounces={false}>
      <View style={styles.modernTopBar}>
        <View style={{ width: 24 }} />
        <Text style={styles.modernTopBarTitle}>Trip Summary</Text>
        <Bell color="#1e3a8a" size={24} />
      </View>

      <View style={styles.successHeaderCard}>
        <CircleCheckBig color="#16a34a" size={64} style={{ marginBottom: 16 }} />
        <Text style={styles.successHeaderTitle}>{verifiedTrip.classifierResult.result}</Text>
        <Text style={styles.successHeaderBody}>{rewardResult.rewardMessage}</Text>
      </View>

      <View style={styles.rewardSummaryGrid}>
        <View style={styles.rewardSummaryItem}>
          <Text style={styles.rewardSummaryLabel}>Lakbay Score</Text>
          <Text style={[styles.rewardSummaryValue, { color: "#2563eb" }]}>+{rewardResult.lakbayScoreEarned}</Text>
        </View>
        <View style={styles.rewardSummaryItem}>
          <Text style={styles.rewardSummaryLabel}>Campaign Points</Text>
          <Text style={[styles.rewardSummaryValue, { color: "#f59e0b" }]}>+{rewardResult.campaignPointsEarned}</Text>
        </View>
        <View style={styles.rewardSummaryItem}>
          <Text style={styles.rewardSummaryLabel}>CO2 Avoided</Text>
          <Text style={[styles.rewardSummaryValue, { color: "#16a34a" }]}>{rewardResult.estimatedCo2eAvoidedKg} kg</Text>
        </View>
      </View>

      <View style={styles.activeStatusBox}>
        <Text style={styles.activeStatusLabel}>UPDATED TOTALS</Text>
        <Text style={styles.activeStatusTitle}>Lakbay Score: {rewardResult.updatedLakbayScore}</Text>
        <Text style={styles.activeStatusTitle}>Campaign Points: {rewardResult.updatedCampaignPoints}</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 24, gap: 12 }}>
        <Pressable accessibilityRole="button" onPress={onReportAccessBarrier} style={styles.primaryButtonLarge}>
          <Text style={styles.primaryButtonText}>Report an Issue on Route</Text>
          <AlertCircle color="#fff" size={20} style={{ marginLeft: 8 }} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onBackToRoutes} style={[styles.primaryButtonLarge, { backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0" }]}>
          <Text style={[styles.primaryButtonText, { color: "#1e3a8a" }]}>Back to Routes</Text>
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
          <View style={styles.locationPill}>
            <MapPin color="#2563eb" size={14} />
            <Text style={styles.locationPillText}>Your Location</Text>
          </View>
          <View style={styles.mapPinContainer}>
            <MapPin color="#fff" size={24} />
          </View>
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
    <ScrollView contentContainerStyle={styles.mainContainer} bounces={false}>
      <View style={styles.modernTopBar}>
        <View style={{ width: 24 }} />
        <Text style={styles.modernTopBarTitle}>LakbayPoints</Text>
        <Bell color="#1e3a8a" size={24} />
      </View>

      <View style={styles.successHeaderCard}>
        <Text style={styles.successHeaderTitle}>Welcome to LakbayPoints</Text>
        <Text style={styles.successHeaderBody}>
          Review the static multimodal pilot journey, compare qualified route
          options, and continue to prototype verification.
        </Text>
      </View>

      <View style={[styles.routeOptionCard, { marginTop: 24 }]}>
        <View style={styles.routeOptionHeader}>
          <View style={styles.routeOptionTitleRow}>
            <Text style={styles.routeOptionName}>Recommended journey</Text>
          </View>
          <Text style={styles.routeOptionChain}>{readableTripChain(route)}</Text>
        </View>

        <View style={styles.routeMetricsGrid}>
          <View style={styles.routeMetricItem}>
            <Text style={styles.routeMetricLabel}>Time</Text>
            <Text style={styles.routeMetricValue}>{formatRouteTime(route)}</Text>
          </View>
          <View style={styles.routeMetricItem}>
            <Text style={styles.routeMetricLabel}>Fare</Text>
            <Text style={styles.routeMetricValue}>{formatRouteFare(route)}</Text>
          </View>
          <View style={styles.routeMetricItem}>
            <Text style={styles.routeMetricLabel}>CO2 Avoided</Text>
            <Text style={[styles.routeMetricValue, { color: "#16a34a" }]}>{formatRouteCo2e(route)}</Text>
          </View>
          {route.lakbayScoreReward ? (
            <View style={styles.routeMetricItem}>
              <Text style={styles.routeMetricLabel}>Lakbay Score</Text>
              <Text style={[styles.routeMetricValue, { color: "#2563eb" }]}>+{route.lakbayScoreReward}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.routeNoteGroup}>
          <AlertCircle color="#64748b" size={14} />
          <Text style={styles.routeNoteText}>{route.disclaimer}</Text>
        </View>

        <View style={{ gap: 12 }}>
          <Pressable
            accessibilityRole="button"
            onPress={onPlanTrip}
            style={styles.primaryButtonLarge}
          >
            <Text style={styles.primaryButtonText}>Plan the Pilot Trip</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onCompareRoutes}
            style={[styles.primaryButtonLarge, { backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0" }]}
          >
            <Text style={[styles.primaryButtonText, { color: "#1e3a8a" }]}>Compare Route Options</Text>
          </Pressable>
        </View>
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
    <SafeAreaProvider>
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
            onBeginPlayback={() => setScreen("playback")}
          />
        ) : null}
      </View>
      <BottomTabBar activeTab={activeTab} onTabSelect={handleTabSelect} />
      </SafeAreaView>
    </SafeAreaProvider>
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
    marginBottom: 8,
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
  mainContainer: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
  },
  modernTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  modernTopBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  corridorBlock: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  corridorInputArea: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  corridorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  dotOrigin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: "#3b82f6",
    marginRight: 12,
  },
  dotDest: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#f59e0b",
    marginRight: 12,
  },
  corridorText: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  corridorDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginLeft: 24,
    marginVertical: 4,
  },
  routeOptionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  routeOptionCardRecommended: {
    borderColor: "#bfdbfe",
    borderWidth: 2,
  },
  routeOptionHeader: {
    marginBottom: 16,
  },
  routeOptionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  routeOptionName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  recommendedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedChipText: {
    color: "#b45309",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  routeOptionChain: {
    fontSize: 13,
    color: "#64748b",
  },
  routeMetricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  routeMetricItem: {
    width: "47%",
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  routeMetricLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
  },
  routeMetricValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  routeNoteGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
  },
  routeNoteText: {
    fontSize: 12,
    color: "#475569",
    marginLeft: 8,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#1e3a8a",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 6,
  },
  primaryButtonLarge: {
    backgroundColor: "#1e3a8a",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  routeMapArea: {
    height: 180,
    position: "relative",
  },
  routeMapOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  routeDetailCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: -20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  routeDetailCardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 16,
  },
  timelineContainer: {
    marginVertical: 24,
  },
  timelineRow: {
    flexDirection: "row",
  },
  timelineLeft: {
    width: 32,
    alignItems: "center",
    marginRight: 12,
  },
  timelineIconNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: -4,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  timelineSub: {
    fontSize: 13,
    color: "#64748b",
  },
  timelineTimeRight: {
    marginLeft: 12,
  },
  timelineTimeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    paddingTop: 4,
  },
  playbackProgressWrap: {
    marginVertical: 24,
  },
  playbackProgressTrack: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    position: "absolute",
    top: 13,
    left: 16,
    right: 16,
  },
  playbackProgressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 3,
  },
  playbackProgressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  playbackProgressStep: {
    alignItems: "center",
  },
  playbackProgressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  playbackProgressDotActive: {
    backgroundColor: "#2563eb",
  },
  activeStatusBox: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeStatusLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748b",
    marginBottom: 8,
  },
  activeStatusTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  activeStatusBody: {
    fontSize: 14,
    color: "#475569",
  },
  verificationResultCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  verificationValid: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  verificationSuspicious: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  verificationResultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  verificationResultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  verificationResultScore: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16a34a",
  },
  verificationResultBody: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 16,
  },
  successHeaderCard: {
    backgroundColor: "#fff",
    padding: 32,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  successHeaderTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  successHeaderBody: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  rewardSummaryGrid: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  rewardSummaryItem: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rewardSummaryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
  },
  rewardSummaryValue: {
    fontSize: 20,
    fontWeight: "800",
  },
});
