import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  demoUserRewardState,
  formatRouteCo2e,
  formatRouteDistance,
  formatRouteFare,
  formatRouteTime,
  getRouteAccessPointLabel,
  getRouteTotals,
  phase0APilotRoute,
  type RouteOption,
} from "@lakbaypoints/shared";
import {
  Home,
  Map as MapIcon,
  Shield,
  User,
  Bell,
  Star,
} from "lucide-react-native";

export function RewardsOverviewScreen({
  onPlanTrip,
}: {
  onPlanTrip: () => void;
}) {
  const campaignCapRemaining = Math.max(
    0,
    demoUserRewardState.campaignPointsCap - demoUserRewardState.campaignPoints,
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Rewards Overview</Text>
        <Bell color="#0f766e" size={24} />
      </View>

      <View style={styles.rewardStatusCard}>
        <Text style={styles.rewardStatusLabel}>Verification required</Text>
        <Text style={styles.rewardStatusTitle}>
          No verified trip selected in this session
        </Text>
        <Text style={styles.rewardStatusBody}>
          Potential rewards become results only after the trip verification
          flow. This overview does not issue rewards.
        </Text>
      </View>

      <View style={styles.rewardBalanceGrid}>
        <View style={styles.rewardBalanceCard}>
          <Text style={styles.rewardBalanceLabel}>Lakbay Score</Text>
          <Text style={styles.rewardBalanceValue}>
            {demoUserRewardState.lakbayScore}
          </Text>
          <Text style={styles.rewardBalanceNote}>
            Seeded non-cash prototype balance
          </Text>
        </View>
        <View style={styles.rewardBalanceCard}>
          <Text style={styles.rewardBalanceLabel}>campaign Points</Text>
          <Text style={styles.rewardBalanceValue}>
            {demoUserRewardState.campaignPoints} /{" "}
            {demoUserRewardState.campaignPointsCap}
          </Text>
          <Text style={styles.rewardBalanceNote}>
            {campaignCapRemaining} Points below the campaign cap
          </Text>
        </View>
        <View style={styles.rewardBalanceCardWide}>
          <Text style={styles.rewardBalanceLabel}>Verified trip history</Text>
          <Text style={styles.rewardBalanceValue}>
            {demoUserRewardState.verifiedTrips}
          </Text>
          <Text style={styles.rewardBalanceNote}>
            Seeded demonstration history, not a live account record
          </Text>
        </View>
      </View>

      <View style={styles.rewardPotentialSummary}>
        <Text style={styles.rewardPotentialSummaryLabel}>
          Current route potential
        </Text>
        <Text style={styles.rewardPotentialSummaryTitle}>
          {phase0APilotRoute.name}
        </Text>
        <Text style={styles.rewardPotentialSummaryValue}>
          +{phase0APilotRoute.lakbayScoreReward} Lakbay Score · up to +
          {phase0APilotRoute.campaignPointsReward} campaign Points
        </Text>
        <Text style={styles.rewardPotentialSummaryNote}>
          Subject to full trip verification. The campaign cap applies.
        </Text>
      </View>

      <View style={styles.rewardRulesCard}>
        <Text style={styles.rewardRulesTitle}>How Phase 0A rewards work</Text>
        <Text style={styles.rewardRule}>• Lakbay Score is non-cash.</Text>
        <Text style={styles.rewardRule}>
          • Campaign Points are capped incentives for verified trips.
        </Text>
        <Text style={styles.rewardRule}>
          • Suspicious or unverified trips receive no reward.
        </Text>
        <Text style={styles.rewardRule}>
          • Only the defined score and capped campaign Points are in scope.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onPlanTrip}
        style={styles.rewardPlanButton}
      >
        <Text style={styles.rewardPlanButtonText}>Plan a Trip to Verify</Text>
      </Pressable>

      <Text style={styles.rewardDisclaimer}>
        Static seeded demonstration data. No live account, wallet, or payment
        integration is connected.
      </Text>
    </ScrollView>
  );
}

export function PlanTripScreen({
  route,
  onCompareRoutes,
  onBeginPlayback,
}: {
  route: RouteOption;
  onCompareRoutes: () => void;
  onBeginPlayback?: () => void;
}) {
  const totals = getRouteTotals(route);
  const origin = getRouteAccessPointLabel(route, route.originAccessPointId);
  const destination = getRouteAccessPointLabel(
    route,
    route.destinationAccessPointId,
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Plan Your Trip</Text>
        <Bell color="#0f766e" size={24} />
      </View>

      <Text style={styles.positioning}>
        A Verified Multimodal Mode-Shift Platform for Metro Manila
      </Text>

      <View style={styles.tripInputCard}>
        <View style={styles.tripInputRow}>
          <View style={styles.inputDotOrigin} />
          <Text style={styles.tripInputText}>{origin}</Text>
        </View>
        <View style={styles.tripInputDivider} />
        <View style={styles.tripInputRow}>
          <View style={styles.inputDotDest} />
          <Text style={styles.tripInputText}>{destination}</Text>
        </View>
      </View>

      <View style={styles.prototypeCard}>
        <Text style={styles.prototypeLabel}>{route.dataStatusLabel}</Text>
        <Text style={styles.prototypeMeta}>
          Reviewed {route.lastReviewedDate} · {route.dataVersion}
        </Text>
        <Text style={styles.prototypeDisclaimer}>{route.disclaimer}</Text>
      </View>

      <View style={styles.planMetricGrid}>
        <View style={styles.planMetric}>
          <Text style={styles.planMetricLabel}>Total time</Text>
          <Text style={styles.planMetricValue}>{formatRouteTime(route)}</Text>
        </View>
        <View style={styles.planMetric}>
          <Text style={styles.planMetricLabel}>Distance</Text>
          <Text style={styles.planMetricValue}>
            {formatRouteDistance(route)}
          </Text>
        </View>
        <View style={styles.planMetricWide}>
          <Text style={styles.planMetricLabel}>Known fare</Text>
          <Text style={styles.planMetricValue}>{formatRouteFare(route)}</Text>
        </View>
        <View style={styles.planMetricWide}>
          <Text style={styles.planMetricLabel}>Estimated CO2e avoided</Text>
          <Text style={styles.planMetricValue}>{formatRouteCo2e(route)}</Text>
        </View>
      </View>

      <View style={styles.routeDetailsCard}>
        <View style={styles.routeDetailsHeader}>
          <View style={styles.routeDetailsHeading}>
            <Text style={styles.routeDetailsTitle}>{route.name}</Text>
            <Text style={styles.routeDetailsSub}>
              {totals.travelTimeMin} min travel · {totals.waitDwellTimeMin} min
              wait/dwell · {route.segments.length} segments
            </Text>
          </View>
          <Text style={styles.routeTotalTime}>{formatRouteTime(route)}</Text>
        </View>

        <View style={styles.segmentList}>
          {route.segments.map((segment, index) => {
            const segmentOrigin = getRouteAccessPointLabel(
              route,
              segment.originAccessPointId,
            );
            const segmentDestination = getRouteAccessPointLabel(
              route,
              segment.destinationAccessPointId,
            );
            const fare =
              segment.farePhp === null
                ? (segment.fareDisplay ?? "To be confirmed")
                : `PHP ${segment.farePhp}`;

            return (
              <View style={styles.segmentRow} key={segment.id}>
                <View style={styles.segmentIconContainer}>
                  <View style={styles.segmentIconBg}>
                    <Text style={styles.segmentIconText}>{index + 1}</Text>
                  </View>
                  {index < route.segments.length - 1 ? (
                    <View style={styles.segmentDash} />
                  ) : null}
                </View>
                <View style={styles.segmentInfo}>
                  <Text style={styles.segmentMode}>{segment.displayMode}</Text>
                  <Text style={styles.segmentName}>{segment.label}</Text>
                  <Text style={styles.segmentRoute}>
                    {segmentOrigin} → {segmentDestination}
                  </Text>
                  <Text style={styles.segmentDesc}>
                    {segment.travelTimeMin} min travel ·{" "}
                    {segment.waitDwellTimeMin} min wait/dwell ·{" "}
                    {segment.distanceKm?.toFixed(1)} km
                  </Text>
                  <Text style={styles.segmentFare}>
                    Fare: {fare} · {segment.fareStatus.replaceAll("_", " ")}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.rewardPotentialCard}>
        <Text style={styles.rewardPotentialTitle}>
          Potential verified reward
        </Text>
        <Text style={styles.rewardPotentialValue}>
          +{route.lakbayScoreReward} Lakbay Score · up to +
          {route.campaignPointsReward} campaign Points
        </Text>
        <Text style={styles.rewardPotentialNote}>
          Subject to trip verification; campaign cap applies.
        </Text>
      </View>

      {onBeginPlayback ? (
        <Pressable
          accessibilityRole="button"
          onPress={onBeginPlayback}
          style={[styles.compareButton, styles.playbackButton]}
        >
          <Text style={styles.compareButtonText}>Begin Trip Playback</Text>
        </Pressable>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={onCompareRoutes}
        style={styles.compareButton}
      >
        <Text style={styles.compareButtonText}>Compare Route Options</Text>
      </Pressable>

      <Text style={styles.tagline}>
        Guide the Trip. Verify the Shift. Improve Access.
      </Text>
    </ScrollView>
  );
}

export type BottomTabName = "home" | "trips" | "rewards" | "report" | "profile";

const bottomTabItems: {
  name: BottomTabName;
  label: string;
  Icon: typeof Home;
}[] = [
  { name: "home", label: "Home", Icon: Home },
  { name: "trips", label: "Trips", Icon: MapIcon },
  { name: "rewards", label: "Rewards", Icon: Star },
  { name: "report", label: "Report", Icon: Shield },
  { name: "profile", label: "Profile", Icon: User },
];

export function BottomTabBar({
  activeTab,
  onTabSelect,
}: {
  activeTab: BottomTabName;
  onTabSelect: (tab: BottomTabName) => void;
}) {
  return (
    <View accessibilityRole="tablist" style={styles.tabBar}>
      {bottomTabItems.map(({ name, label, Icon }) => {
        const selected = activeTab === name;
        const isRewardsSelected = selected && name === "rewards";
        const color = isRewardsSelected
          ? "#f59e0b"
          : selected
            ? "#1e3a8a"
            : "#64748b";

        return (
          <Pressable
            accessibilityLabel={`${label} tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={name}
            onPress={() => onTabSelect(name)}
            style={styles.tabItem}
          >
            <Icon
              color={color}
              fill={name === "rewards" && selected ? color : "transparent"}
              size={24}
            />
            <Text
              style={[
                styles.tabLabel,
                selected && styles.tabLabelActive,
                isRewardsSelected && styles.tabLabelRewardsActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 36,
    paddingTop: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e3a8a",
    marginLeft: "auto",
    marginRight: "auto",
  },
  rewardStatusCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  rewardStatusLabel: {
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  rewardStatusTitle: {
    color: "#172554",
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 25,
    marginBottom: 6,
  },
  rewardStatusBody: {
    color: "#334155",
    fontSize: 13,
    lineHeight: 20,
  },
  rewardBalanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rewardBalanceCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardBalanceCardWide: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardBalanceLabel: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  rewardBalanceValue: {
    color: "#1e3a8a",
    fontSize: 24,
    fontWeight: "800",
  },
  rewardBalanceNote: {
    color: "#64748b",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  rewardPotentialSummary: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  rewardPotentialSummaryLabel: {
    color: "#15803d",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  rewardPotentialSummaryTitle: {
    color: "#14532d",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 23,
    marginBottom: 7,
  },
  rewardPotentialSummaryValue: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },
  rewardPotentialSummaryNote: {
    color: "#166534",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  rewardRulesCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  rewardRulesTitle: {
    color: "#1e3a8a",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  rewardRule: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 21,
  },
  rewardPlanButton: {
    minHeight: 48,
    backgroundColor: "#1e3a8a",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  rewardPlanButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  rewardDisclaimer: {
    color: "#64748b",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 12,
  },

  /* Plan Trip Styles */
  positioning: {
    color: "#0f766e",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginBottom: 16,
    textAlign: "center",
  },
  tripInputCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tripInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  inputDotOrigin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: "#3b82f6",
    marginRight: 12,
  },
  inputDotDest: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#f59e0b",
    marginRight: 12,
  },
  tripInputText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
  tripInputDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: 24,
    marginVertical: 4,
  },
  prototypeCard: {
    backgroundColor: "#ecfeff",
    borderColor: "#a5f3fc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  prototypeLabel: {
    color: "#155e75",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  prototypeMeta: {
    color: "#0e7490",
    fontSize: 11,
    marginBottom: 6,
  },
  prototypeDisclaimer: {
    color: "#164e63",
    fontSize: 12,
    lineHeight: 18,
  },
  planMetricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  planMetric: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  planMetricWide: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  planMetricLabel: {
    color: "#6b7280",
    fontSize: 11,
    marginBottom: 4,
  },
  planMetricValue: {
    color: "#1e3a8a",
    fontSize: 16,
    fontWeight: "700",
  },
  routeDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  routeDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  routeDetailsHeading: {
    flex: 1,
    paddingRight: 10,
  },
  routeDetailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  routeDetailsSub: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 17,
  },
  routeTotalTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  segmentList: {
    paddingLeft: 4,
  },
  segmentRow: {
    flexDirection: "row",
    marginBottom: 22,
    alignItems: "flex-start",
  },
  segmentIconContainer: {
    alignItems: "center",
    marginRight: 14,
    width: 26,
  },
  segmentIconBg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#0f766e",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  segmentIconText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  segmentDash: {
    position: "absolute",
    top: 26,
    bottom: -28,
    width: 2,
    backgroundColor: "#d1d5db",
  },
  segmentInfo: {
    flex: 1,
  },
  segmentMode: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  segmentName: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 4,
  },
  segmentRoute: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 17,
    marginBottom: 4,
  },
  segmentDesc: {
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 16,
  },
  segmentFare: {
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 16,
    textTransform: "capitalize",
  },
  rewardPotentialCard: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  rewardPotentialTitle: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  rewardPotentialValue: {
    color: "#14532d",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  rewardPotentialNote: {
    color: "#166534",
    fontSize: 11,
    marginTop: 4,
  },
  compareButton: {
    backgroundColor: "#1e3a8a",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  playbackButton: {
    marginBottom: 12,
  },
  compareButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  tagline: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 14,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: 24,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#1e3a8a",
    fontWeight: "700",
  },
  tabLabelRewardsActive: {
    color: "#f59e0b",
  },
});
