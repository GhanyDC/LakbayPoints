import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import {
  Home,
  Map as MapIcon,
  Award,
  Shield,
  User,
  Bell,
  Star,
  Flame,
  CreditCard,
  QrCode,
  Percent,
  Ticket,
  TrendingUp,
  MapPin,
  ArrowRight,
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

export function PlanTripScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Plan Your Trip</Text>
        <Bell color="#0f766e" size={24} />
      </View>

      <View style={styles.tripInputCard}>
        <View style={styles.tripInputRow}>
          <View style={styles.inputDotOrigin} />
          <Text style={styles.tripInputText}>Guadalupe Station</Text>
          <TrendingUp
            color="#9ca3af"
            size={20}
            style={{ marginLeft: "auto" }}
          />
        </View>
        <View style={styles.tripInputDivider} />
        <View style={styles.tripInputRow}>
          <View style={styles.inputDotDest} />
          <Text style={styles.tripInputText}>Cubao Station</Text>
        </View>
        <View style={styles.swapIconContainer}>
          <Text style={{ color: "#6b7280" }}>↑↓</Text>
        </View>
      </View>

      <View style={styles.tripTabs}>
        <View style={[styles.tripTab, styles.tripTabActive]}>
          <Text style={[styles.tripTabText, styles.tripTabTextActive]}>
            Best Route
          </Text>
          <Text style={[styles.tripTabSub, styles.tripTabSubActive]}>
            Recommended
          </Text>
        </View>
        <View style={styles.tripTab}>
          <Text style={styles.tripTabText}>Fastest</Text>
          <Text style={styles.tripTabSub}>44 min</Text>
        </View>
        <View style={styles.tripTab}>
          <Text style={styles.tripTabText}>Least Walk</Text>
          <Text style={styles.tripTabSub}>1.1 km</Text>
        </View>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapTitle}>Transit Heatmap</Text>
        <Text style={styles.mapSubtitle}>
          See public transport access and commuter density
        </Text>

        {/* Pseudo Map Background */}
        <View style={styles.pseudoMapBg}>
          <Text
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              color: "#9ca3af",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            KAMUNING
          </Text>
          <Text
            style={{
              position: "absolute",
              top: 50,
              right: 10,
              color: "#9ca3af",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            CUBAO
          </Text>
          <Text
            style={{
              position: "absolute",
              bottom: 50,
              left: 10,
              color: "#9ca3af",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            MANDALUYONG
          </Text>

          <View style={styles.mapLineContainer}>
            <View style={styles.mapStation}>
              <MapPin fill="#fff" color="#0f766e" size={20} />
              <Text style={styles.mapStationText}>Guadalupe Station</Text>
            </View>

            <View style={styles.mapLineSegment}>
              <View style={styles.dottedLine} />
              <View style={styles.walkIconSmall}>
                <User color="#fff" size={10} />
              </View>
            </View>

            <View style={styles.mrtLineContainer}>
              <View style={styles.mrtLine} />
              <View style={styles.mrtBadge}>
                <Text style={styles.mrtBadgeText}>MRT-3</Text>
              </View>
            </View>

            <View style={styles.mapLineSegment}>
              <View style={styles.dottedLine} />
              <View style={styles.walkIconSmall}>
                <User color="#fff" size={10} />
              </View>
            </View>

            <View style={styles.mapStation}>
              <MapPin fill="#fff" color="#0f766e" size={20} />
              <Text style={styles.mapStationText}>Cubao Station</Text>
            </View>
          </View>

          <View style={styles.heatmapLegendMap}>
            <Text style={styles.heatmapLegendText}>Commuter Density</Text>
            <View style={styles.heatmapBarContainer}>
              <Text style={styles.heatmapLegendLabel}>Low</Text>
              <View style={styles.heatmapGradient} />
              <Text style={styles.heatmapLegendLabel}>High</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.routeDetailsCard}>
        <View style={styles.routeDetailsHeader}>
          <View>
            <Text style={styles.routeDetailsTitle}>Recommended Route</Text>
            <Text style={styles.routeDetailsSub}>
              Incl. 12 min walk • 1 transfer
            </Text>
          </View>
          <Text style={styles.routeTotalTime}>44 min</Text>
        </View>

        <View style={styles.segmentList}>
          <View style={styles.segmentRow}>
            <View style={styles.segmentIconContainer}>
              <View style={styles.segmentIconBg}>
                <User color="#fff" size={16} />
              </View>
              <View style={styles.segmentDash} />
            </View>
            <View style={styles.segmentInfo}>
              <Text style={styles.segmentName}>Walk to Guadalupe Station</Text>
              <Text style={styles.segmentDesc}>6 min (450 m)</Text>
            </View>
            <Text style={styles.segmentTime}>6 min</Text>
          </View>

          <View style={styles.segmentRow}>
            <View style={styles.segmentIconContainer}>
              <View
                style={[styles.segmentIconBg, { backgroundColor: "#1e3a8a" }]}
              >
                <MapIcon color="#fff" size={16} />
              </View>
              <View style={styles.segmentDash} />
            </View>
            <View style={styles.segmentInfo}>
              <Text style={styles.segmentName}>
                <Text style={styles.boldBlue}>MRT-3</Text> Guadalupe{" "}
                <ArrowRight size={14} color="#000" style={{ marginTop: 4 }} />{" "}
                Cubao Station
              </Text>
              <Text style={styles.segmentDesc}>6 stops • Every 3-4 min</Text>
            </View>
            <Text style={styles.segmentTime}>26 min</Text>
          </View>

          <View style={styles.segmentRow}>
            <View style={styles.segmentIconContainer}>
              <View style={styles.segmentIconBg}>
                <User color="#fff" size={16} />
              </View>
            </View>
            <View style={styles.segmentInfo}>
              <Text style={styles.segmentName}>Walk to Cubao Station Exit</Text>
              <Text style={styles.segmentDesc}>6 min (450 m)</Text>
            </View>
            <Text style={styles.segmentTime}>6 min</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomStatsRow}>
        <View style={styles.bottomStatBox}>
          <View style={styles.statIconRow}>
            <User color="#f59e0b" size={20} style={{ marginRight: 4 }} />
            <User
              color="#f59e0b"
              size={20}
              style={{ marginRight: 4, marginLeft: -10 }}
            />
            <User color="#f59e0b" size={20} style={{ marginLeft: -10 }} />
          </View>
          <View style={styles.bottomStatInfo}>
            <Text style={styles.bottomStatTitle}>Moderate Crowds</Text>
            <Text style={styles.bottomStatDesc}>
              Busier than usual on MRT-3. Expect moderate crowd levels.
            </Text>
          </View>
        </View>
        <View style={styles.bottomStatBoxSmall}>
          <Shield fill="#fbbf24" color="#fbbf24" size={24} />
          <View style={styles.bottomStatInfo}>
            <Text style={styles.bottomStatLabel}>Route Safety</Text>
            <Text style={styles.bottomStatValueGood}>
              Good <ArrowRight size={14} color="#10b981" />
            </Text>
          </View>
        </View>
      </View>
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
  tripInputCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: "relative",
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
    fontSize: 16,
    color: "#111827",
  },
  tripInputDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: 24,
    marginVertical: 4,
  },
  swapIconContainer: {
    position: "absolute",
    right: 16,
    top: 30,
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 16,
  },
  tripTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tripTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tripTabActive: {
    backgroundColor: "#1e3a8a",
  },
  tripTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  tripTabTextActive: {
    color: "#fff",
  },
  tripTabSub: {
    fontSize: 11,
    color: "#6b7280",
  },
  tripTabSubActive: {
    color: "#93c5fd",
  },
  mapPlaceholder: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 16,
  },
  pseudoMapBg: {
    height: 220,
    backgroundColor: "#f0fdfa",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  mapLineContainer: {
    position: "absolute",
    top: 40,
    bottom: 40,
    left: 50,
    right: 50,
    alignItems: "center",
  },
  mapStation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  mapStationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e3a8a",
    marginLeft: 6,
  },
  mapLineSegment: {
    height: 30,
    width: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dottedLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#0f766e",
  },
  walkIconSmall: {
    backgroundColor: "#1e3a8a",
    padding: 4,
    borderRadius: 10,
    zIndex: 5,
  },
  mrtLineContainer: {
    flex: 1,
    width: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  mrtLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#1e3a8a",
  },
  mrtBadge: {
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 5,
  },
  mrtBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  heatmapLegendMap: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 8,
  },
  heatmapLegendText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  heatmapBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heatmapLegendLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  heatmapGradient: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginHorizontal: 6,
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
    alignItems: "center",
    marginBottom: 20,
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
  },
  routeTotalTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  segmentList: {
    paddingLeft: 8,
  },
  segmentRow: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  segmentIconContainer: {
    alignItems: "center",
    marginRight: 16,
    width: 24,
  },
  segmentIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  segmentDash: {
    position: "absolute",
    top: 24,
    bottom: -32,
    width: 2,
    backgroundColor: "#e5e7eb",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  segmentInfo: {
    flex: 1,
  },
  segmentName: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    marginBottom: 4,
  },
  boldBlue: {
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  segmentDesc: {
    fontSize: 12,
    color: "#6b7280",
  },
  segmentTime: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  bottomStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomStatBox: {
    flex: 1,
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  statIconRow: {
    flexDirection: "row",
    marginRight: 12,
  },
  bottomStatBoxSmall: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bottomStatInfo: {
    flex: 1,
  },
  bottomStatTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 2,
  },
  bottomStatDesc: {
    fontSize: 10,
    color: "#b45309",
    lineHeight: 14,
  },
  bottomStatLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  bottomStatValueGood: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10b981",
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
