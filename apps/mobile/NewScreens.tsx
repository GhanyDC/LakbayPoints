import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  formatRouteCo2e,
  formatRouteDistance,
  formatRouteFare,
  formatRouteTime,
  getRouteAccessPointLabel,
  getRouteTotals,
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
  CreditCard,
  QrCode,
  Percent,
  Ticket,
  MapPin,
} from "lucide-react-native";

export function RewardsDashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>My Rewards</Text>
        <Bell color="#0f766e" size={24} />
      </View>

      <View style={styles.xpCard}>
        <View style={styles.xpCardHeader}>
          <Text style={styles.xpCardTitle}>EDSA Explorer</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Level 12</Text>
          </View>
        </View>
        <Text style={styles.xpProgressText}>2,350 / 3,000 XP to Level 13</Text>
        <View style={styles.xpProgressBarBg}>
          <View style={[styles.xpProgressBarFill, { width: "78%" }]} />
        </View>
        <View style={styles.xpIconContainer}>
          <View style={styles.starIconBg}>
            <Star fill="#fff" color="#fff" size={24} />
          </View>
          <View style={styles.starRibbonLeft} />
          <View style={styles.starRibbonRight} />
        </View>
      </View>

      <View style={styles.pointsRow}>
        <View style={styles.pointsBox}>
          <Text style={styles.pointsBoxTitle}>Lakbay Points</Text>
          <Text style={styles.pointsBoxValue}>2,450</Text>
          <Text style={styles.pointsBoxSubtitle}>Total Points</Text>
        </View>
        <View style={styles.pointsBox}>
          <Text style={styles.pointsBoxTitle}>This Week</Text>
          <Text style={[styles.pointsBoxValue, { color: "#10b981" }]}>
            +150
          </Text>
          <Text style={styles.pointsBoxSubtitle}>Points Earned</Text>
        </View>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakIconBg}>
          <Flame fill="#fbbf24" color="#fbbf24" size={32} />
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakTitle}>7-Day Commute Streak</Text>
          <Text style={styles.streakSubtitle}>
            Keep it up! 1 more day to earn{" "}
            <Text style={{ color: "#3b82f6", fontWeight: "bold" }}>50</Text>{" "}
            bonus points.
          </Text>
        </View>
        <View style={styles.streakCircle}>
          <Text style={styles.streakCircleValue}>7</Text>
          <View style={styles.streakCircleDivider} />
          <Text style={styles.streakCircleTotal}>7</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Achievement Badges</Text>
        <Text style={styles.viewAllText}>View All</Text>
      </View>

      <View style={styles.badgeGrid}>
        <View style={styles.badgeItem}>
          <View style={[styles.badgeIconWrap, { borderColor: "#3b82f6" }]}>
            <View style={[styles.badgeIconBg, { backgroundColor: "#3b82f6" }]}>
              <User color="#fff" size={24} />
            </View>
            <View style={styles.badgeCheck}>
              <Text style={styles.badgeCheckText}>✓</Text>
            </View>
          </View>
          <Text style={styles.badgeName}>First Step</Text>
        </View>
        <View style={styles.badgeItem}>
          <View style={[styles.badgeIconWrap, { borderColor: "#10b981" }]}>
            <View style={[styles.badgeIconBg, { backgroundColor: "#10b981" }]}>
              <MapIcon color="#fff" size={24} />
            </View>
            <View style={styles.badgeCheck}>
              <Text style={styles.badgeCheckText}>✓</Text>
            </View>
          </View>
          <Text style={styles.badgeName}>Transit Rider</Text>
        </View>
        <View style={styles.badgeItem}>
          <View style={[styles.badgeIconWrap, { borderColor: "#fbbf24" }]}>
            <View style={[styles.badgeIconBg, { backgroundColor: "#fbbf24" }]}>
              <MapPin color="#fff" size={24} />
            </View>
            <View style={styles.badgeCheck}>
              <Text style={styles.badgeCheckText}>✓</Text>
            </View>
          </View>
          <Text style={styles.badgeName}>Explorer</Text>
        </View>
        <View style={styles.badgeItem}>
          <View style={[styles.badgeIconWrap, { borderColor: "#d1d5db" }]}>
            <View style={[styles.badgeIconBg, { backgroundColor: "#9ca3af" }]}>
              <Shield color="#fff" size={24} />
            </View>
            <View style={[styles.badgeCheck, { backgroundColor: "#d1d5db" }]}>
              <Text style={styles.badgeCheckText}>🔒</Text>
            </View>
          </View>
          <Text style={styles.badgeName}>Commuter Pro</Text>
          <Text style={styles.badgeSubtitle}>Level 15</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Redeem Rewards</Text>
        <Text style={styles.viewAllText}>View All</Text>
      </View>

      <View style={styles.redeemGrid}>
        <View style={styles.redeemItem}>
          <CreditCard color="#3b82f6" size={32} style={styles.redeemIcon} />
          <Text style={styles.redeemName}>Transit Credits</Text>
          <Text style={styles.redeemCost}>100 pts</Text>
        </View>
        <View style={styles.redeemItem}>
          <QrCode color="#0f766e" size={32} style={styles.redeemIcon} />
          <Text style={styles.redeemName}>QR Ticket</Text>
          <Text style={styles.redeemCost}>150 pts</Text>
        </View>
        <View style={styles.redeemItem}>
          <Percent color="#f59e0b" size={32} style={styles.redeemIcon} />
          <Text style={styles.redeemName}>Merchant Discount</Text>
          <Text style={styles.redeemCost}>200 pts</Text>
        </View>
        <View style={styles.redeemItem}>
          <Ticket color="#8b5cf6" size={32} style={styles.redeemIcon} />
          <Text style={styles.redeemName}>Raffle Entry</Text>
          <Text style={styles.redeemCost}>250 pts</Text>
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

export function BottomTabBar({
  activeTab,
  onTabSelect,
}: {
  activeTab: string;
  onTabSelect: (t: string) => void;
}) {
  return (
    <View style={styles.tabBar}>
      <Pressable style={styles.tabItem} onPress={() => onTabSelect("home")}>
        <Home color={activeTab === "home" ? "#1e3a8a" : "#9ca3af"} size={24} />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "home" && styles.tabLabelActive,
          ]}
        >
          Home
        </Text>
      </Pressable>
      <Pressable style={styles.tabItem} onPress={() => onTabSelect("trips")}>
        <MapIcon
          color={activeTab === "trips" ? "#1e3a8a" : "#9ca3af"}
          size={24}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "trips" && styles.tabLabelActive,
          ]}
        >
          Trips
        </Text>
      </Pressable>
      <Pressable style={styles.tabItem} onPress={() => onTabSelect("rewards")}>
        <Star
          fill={activeTab === "rewards" ? "#1e3a8a" : "transparent"}
          color={activeTab === "rewards" ? "#1e3a8a" : "#9ca3af"}
          size={24}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "rewards" && styles.tabLabelActive,
          ]}
        >
          Rewards
        </Text>
      </Pressable>
      <Pressable style={styles.tabItem} onPress={() => onTabSelect("report")}>
        <Shield
          color={activeTab === "report" ? "#1e3a8a" : "#9ca3af"}
          size={24}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "report" && styles.tabLabelActive,
          ]}
        >
          Report
        </Text>
      </Pressable>
      <Pressable style={styles.tabItem} onPress={() => onTabSelect("profile")}>
        <User
          color={activeTab === "profile" ? "#1e3a8a" : "#9ca3af"}
          size={24}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === "profile" && styles.tabLabelActive,
          ]}
        >
          Profile
        </Text>
      </Pressable>
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
  xpCard: {
    backgroundColor: "#1e3a8a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  xpCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  xpCardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  levelBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: "#1e3a8a",
    fontWeight: "bold",
    fontSize: 12,
  },
  xpProgressText: {
    color: "#cbd5e1",
    fontSize: 12,
    marginBottom: 8,
  },
  xpProgressBarBg: {
    backgroundColor: "#3b82f6",
    height: 8,
    borderRadius: 4,
    width: "75%",
  },
  xpProgressBarFill: {
    backgroundColor: "#fbbf24",
    height: 8,
    borderRadius: 4,
  },
  xpIconContainer: {
    position: "absolute",
    right: 15,
    top: 25,
    alignItems: "center",
  },
  starIconBg: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 24,
    zIndex: 2,
  },
  starRibbonLeft: {
    position: "absolute",
    bottom: -10,
    left: 5,
    width: 15,
    height: 20,
    backgroundColor: "#fbbf24",
    transform: [{ rotate: "15deg" }],
    zIndex: 1,
  },
  starRibbonRight: {
    position: "absolute",
    bottom: -10,
    right: 5,
    width: 15,
    height: 20,
    backgroundColor: "#fbbf24",
    transform: [{ rotate: "-15deg" }],
    zIndex: 1,
  },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pointsBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "flex-start",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  pointsBoxTitle: {
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  pointsBoxValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  pointsBoxSubtitle: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
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
  streakIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    color: "#1e3a8a",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  streakSubtitle: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 18,
  },
  streakCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  streakCircleValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: -2,
  },
  streakCircleDivider: {
    width: 16,
    height: 1,
    backgroundColor: "#9ca3af",
  },
  streakCircleTotal: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: -2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  viewAllText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
  },
  badgeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  badgeItem: {
    alignItems: "center",
    width: "23%",
  },
  badgeIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  badgeIconBg: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCheck: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#10b981",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeCheckText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  badgeName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  badgeSubtitle: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 2,
  },
  redeemGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  redeemItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  redeemIcon: {
    marginBottom: 12,
  },
  redeemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  redeemCost: {
    fontSize: 12,
    color: "#6b7280",
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
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#1e3a8a",
    fontWeight: "700",
  },
});
