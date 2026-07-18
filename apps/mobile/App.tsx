import { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  type DimensionValue,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  calculateTripRewards,
  classifySustainableTripChain,
  demoUserRewardState,
  guadalupeCubaoRoutes,
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
  RewardsDashboardScreen,
  PlanTripScreen,
  BottomTabBar,
} from "./NewScreens";

const arrow = "\u2192";
const sustainableRoute =
  guadalupeCubaoRoutes.find((route) => route.type === "sustainable") ??
  guadalupeCubaoRoutes[0];

type ScreenName =
  | "comparison"
  | "detail"
  | "playback"
  | "rewards"
  | "report"
  | "reportConfirmation"
  | "dashboardPreview"
  | "rewardsDashboard"
  | "planTrip";

type TabName = "home" | "trips" | "rewards" | "report" | "profile";
type TraceMode = "valid" | "suspicious";
type VerifiedTripState = {
  classifierResult: ClassifierResult;
  traceMode: TraceMode;
};
type ReportCategoryOption = {
  label: string;
  value: AccessBarrierCategory;
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

const reportCategories: ReportCategoryOption[] = [
  {
    label: "Sidewalk obstruction",
    value: "sidewalk_obstruction",
  },
  {
    label: "Unsafe crossing",
    value: "unsafe_crossing",
  },
  {
    label: "Flooding",
    value: "flooding",
  },
  {
    label: "Illegal parking / loading obstruction",
    value: "illegal_parking_or_loading_obstruction",
  },
  {
    label: "Damaged walkway or access path",
    value: "damaged_walkway_or_access_path",
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
          label="Lakbay Points earned"
          value={`+${rewardResult.campaignPointsEarned}`}
        />
        <RewardMetric
          label="Updated Lakbay Points"
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
          value={`${rewardResult.estimatedCo2eAvoidedKg} kg`}
        />
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.sectionKicker}>Reward message</Text>
        <Text style={styles.statusBody}>{rewardResult.rewardMessage}</Text>
      </View>

      <Text style={styles.infoNote}>
        Lakbay Score is a non-cash progress meter. Lakbay Points are capped,
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
  const [location, setLocation] = useState<DemoReportLocation | null>(null);
  const [description, setDescription] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const submitReport = () => {
    const cleanDescription = description.trim();

    if (!category || !severity || !location || cleanDescription.length === 0) {
      setValidationMessage(
        "Choose a category, severity, demo location, and add a short description.",
      );
      return;
    }

    setValidationMessage("");
    onSubmitReport({
      id: `prototype-report-${Date.now()}`,
      category: category.value,
      categoryLabel: category.label,
      severity,
      description: cleanDescription,
      latitude: location.latitude,
      longitude: location.longitude,
      locationLabel: location.label,
      photoUrl: "prototype-photo-placeholder",
      status: "Submitted",
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="Improve the Road"
        title="LakbayPoints"
        subtitle="Report Access Barriers"
      />

      <View style={[styles.card, styles.reportIntroCard]}>
        <Text style={styles.statusBody}>
          Help MMDA identify access barriers that make walking, public
          transport, and sustainable commuting harder.
        </Text>
        <Text style={styles.helperNote}>
          Reports support validation and prioritization. The MVP does not
          automate enforcement or dispatch.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>Category</Text>
        <View style={styles.optionGrid}>
          {reportCategories.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              selected={category?.value === option.value}
              onPress={() => setCategory(option)}
            />
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>Severity</Text>
        <View style={styles.optionGrid}>
          {reportSeverityOptions.map((option) => (
            <OptionButton
              key={option}
              label={option}
              selected={severity === option}
              onPress={() => setSeverity(option)}
            />
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>Location</Text>
        <Text style={styles.fieldHelp}>
          Prototype uses selectable demo locations near the pilot corridor.
        </Text>
        <View style={styles.optionGrid}>
          {demoReportLocations.map((option) => (
            <OptionButton
              key={option.label}
              label={option.label}
              selected={location?.label === option.label}
              onPress={() => setLocation(option)}
            />
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          multiline
          onChangeText={setDescription}
          placeholder="Briefly describe the access barrier."
          placeholderTextColor="#94a3b8"
          style={styles.textInput}
          textAlignVertical="top"
          value={description}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>Photo placeholder</Text>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>
            Photo upload placeholder only - camera upload is not enabled in this
            prototype.
          </Text>
        </View>
      </View>

      {validationMessage ? (
        <Text style={styles.validationText}>{validationMessage}</Text>
      ) : null}

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={submitReport}
          style={styles.primaryAction}
        >
          <Text style={styles.primaryActionText}>Submit Report</Text>
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
          Your report has been added to the MMDA dashboard queue for validation
          in this prototype.
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
            View MMDA Dashboard Preview
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
        eyebrow="MMDA Dashboard"
        title="Dashboard Preview"
        subtitle="Report queue placeholder"
      />

      <View style={[styles.card, styles.dashboardPlaceholderCard]}>
        <Text style={styles.sectionKicker}>
          Coming next: MMDA Dashboard Preview
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

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("planTrip");
  const [activeTab, setActiveTab] = useState<TabName>("trips");
  const [verifiedTrip, setVerifiedTrip] = useState<VerifiedTripState | null>(
    null,
  );
  const [submittedReport, setSubmittedReport] =
    useState<SubmittedReportState | null>(null);
  const route = useMemo(() => sustainableRoute, []);
  const backToRoutes = () => {
    setVerifiedTrip(null);
    setSubmittedReport(null);
    setScreen("comparison");
  };

  const handleTabSelect = (tab: TabName) => {
    setActiveTab(tab);
    if (tab === "rewards") setScreen("rewardsDashboard");
    else if (tab === "trips") setScreen("planTrip");
    else if (tab === "report") setScreen("comparison");
    else setScreen("comparison"); // fallback for home/profile
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
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
        {screen === "rewardsDashboard" ? <RewardsDashboardScreen /> : null}
        {screen === "planTrip" ? <PlanTripScreen /> : null}
      </View>
      <BottomTabBar
        activeTab={activeTab}
        onTabSelect={(t) => handleTabSelect(t as TabName)}
      />
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
});
