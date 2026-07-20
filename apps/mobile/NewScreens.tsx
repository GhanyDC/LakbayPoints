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
  Flame,
  Footprints,
  Train,
  MapPin,
  Lock,
  CreditCard,
  QrCode,
  Percent,
  Ticket,
  CircleCheckBig,
} from "lucide-react-native";

export function RewardsOverviewScreen({
  onPlanTrip,
}: {
  onPlanTrip: () => void;
}) {
  const xp = demoUserRewardState.campaignPoints;
  const xpCap = demoUserRewardState.campaignPointsCap;
  const progressPercent = Math.min(100, (xp / xpCap) * 100);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View style={{ width: 24 }} />
        <Text style={styles.topBarTitle}>My Rewards</Text>
        <Bell color="#1e3a8a" size={24} />
      </View>

      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>EDSA Explorer</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Level 12</Text>
          </View>
        </View>
        <Text style={styles.levelProgressText}>
          {xp} / {xpCap} XP to Level 13
        </Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.levelIconContainer}>
          <Star color="#fff" fill="#fff" size={32} />
        </View>
      </View>

      <View style={styles.pointsCard}>
        <View style={styles.pointsColumn}>
          <Text style={styles.pointsLabel}>Lakbay Points</Text>
          <Text style={styles.pointsValue}>{demoUserRewardState.lakbayScore}</Text>
          <Text style={styles.pointsSub}>Total Points</Text>
        </View>
        <View style={styles.pointsDivider} />
        <View style={styles.pointsColumn}>
          <Text style={styles.pointsLabel}>This Week</Text>
          <Text style={styles.pointsValueGreen}>+{demoUserRewardState.verifiedTrips * 15}</Text>
          <Text style={styles.pointsSub}>Points Earned</Text>
        </View>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakIconWrap}>
          <Flame color="#f59e0b" fill="#f59e0b" size={24} />
        </View>
        <View style={styles.streakTextWrap}>
          <Text style={styles.streakTitle}>{demoUserRewardState.verifiedTrips}-Day Commute Streak</Text>
          <Text style={styles.streakBody}>Keep it up! 1 more day to earn <Text style={styles.streakHighlight}>50</Text> bonus points.</Text>
        </View>
        <View style={styles.streakCircle}>
          <Text style={styles.streakCircleText}>{demoUserRewardState.verifiedTrips}</Text>
          <View style={styles.streakCircleLine} />
          <Text style={styles.streakCircleText}>7</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Achievement Badges</Text>
        <Text style={styles.viewAllText}>View All</Text>
      </View>
      
      <View style={styles.badgesGrid}>
        <View style={styles.badgeItem}>
          <View style={[styles.badgeHexagon, { borderColor: '#2563eb' }]}>
            <Footprints color="#2563eb" size={24} />
            <View style={styles.badgeCheck}><CircleCheckBig color="#fff" fill="#16a34a" size={14} /></View>
          </View>
          <Text style={styles.badgeLabel}>First Step</Text>
        </View>
        <View style={styles.badgeItem}>
          <View style={[styles.badgeHexagon, { borderColor: '#16a34a' }]}>
            <Train color="#16a34a" size={24} />
            <View style={styles.badgeCheck}><CircleCheckBig color="#fff" fill="#16a34a" size={14} /></View>
          </View>
          <Text style={styles.badgeLabel}>Transit Rider</Text>
        </View>
        <View style={styles.badgeItem}>
          <View style={[styles.badgeHexagon, { borderColor: '#f59e0b' }]}>
            <MapPin color="#f59e0b" size={24} />
            <View style={styles.badgeCheck}><CircleCheckBig color="#fff" fill="#16a34a" size={14} /></View>
          </View>
          <Text style={styles.badgeLabel}>Explorer</Text>
        </View>
        <View style={styles.badgeItem}>
          <View style={[styles.badgeHexagon, { borderColor: '#9ca3af' }]}>
            <Lock color="#9ca3af" size={24} />
          </View>
          <Text style={styles.badgeLabel}>Commuter Pro</Text>
          <Text style={styles.badgeSub}>Level 15</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Redeem Rewards</Text>
        <Text style={styles.viewAllText}>View All</Text>
      </View>

      <View style={styles.redeemGrid}>
        <View style={styles.redeemCard}>
          <CreditCard color="#1e3a8a" size={28} />
          <Text style={styles.redeemLabel}>Transit Credits</Text>
          <Text style={styles.redeemPts}>100 pts</Text>
        </View>
        <View style={styles.redeemCard}>
          <QrCode color="#1e3a8a" size={28} />
          <Text style={styles.redeemLabel}>QR Ticket</Text>
          <Text style={styles.redeemPts}>150 pts</Text>
        </View>
        <View style={styles.redeemCard}>
          <Percent color="#f59e0b" size={28} />
          <Text style={styles.redeemLabel}>Merchant Discount</Text>
          <Text style={styles.redeemPts}>200 pts</Text>
        </View>
        <View style={styles.redeemCard}>
          <Ticket color="#1e3a8a" size={28} />
          <Text style={styles.redeemLabel}>Raffle Entry</Text>
          <Text style={styles.redeemPts}>250 pts</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export function PlanTripScreen({
  route,
  onCompareRoutes,
}: {
  route: RouteOption;
  onCompareRoutes: () => void;
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
        const color = isRewardsSelected ? "#f59e0b" : selected ? "#1e3a8a" : "#64748b";

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
            <Text style={[styles.tabLabel, selected && styles.tabLabelActive, isRewardsSelected && { color }]}>
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
    backgroundColor: "#f8fafc",
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
  },
  levelCard: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  levelTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 12,
  },
  levelBadge: {
    backgroundColor: "#fde047",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: "#1e3a8a",
    fontSize: 12,
    fontWeight: "800",
  },
  levelProgressText: {
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 12,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 4,
    width: "70%",
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#facc15",
    borderRadius: 4,
  },
  levelIconContainer: {
    position: "absolute",
    right: 20,
    top: 24,
    width: 60,
    height: 70,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  pointsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  pointsColumn: {
    flex: 1,
    alignItems: "flex-start",
  },
  pointsDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 16,
  },
  pointsLabel: {
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  pointsValue: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "800",
  },
  pointsValueGreen: {
    color: "#16a34a",
    fontSize: 28,
    fontWeight: "800",
  },
  pointsSub: {
    color: "#64748b",
    fontSize: 12,
  },
  streakCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  streakIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  streakTextWrap: {
    flex: 1,
  },
  streakTitle: {
    color: "#1e3a8a",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  streakBody: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
  },
  streakHighlight: {
    color: "#2563eb",
    fontWeight: "700",
  },
  streakCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  streakCircleText: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "700",
  },
  streakCircleLine: {
    width: 16,
    height: 1,
    backgroundColor: "#0f172a",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#1e3a8a",
    fontSize: 16,
    fontWeight: "700",
  },
  viewAllText: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "600",
  },
  badgesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  badgeItem: {
    alignItems: "center",
    width: "23%",
  },
  badgeHexagon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#fff",
    position: "relative",
  },
  badgeCheck: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  badgeLabel: {
    color: "#0f172a",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  badgeSub: {
    color: "#64748b",
    fontSize: 10,
    textAlign: "center",
  },
  redeemGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  redeemCard: {
    width: "23%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  redeemLabel: {
    color: "#0f172a",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  redeemPts: {
    color: "#64748b",
    fontSize: 10,
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
});
