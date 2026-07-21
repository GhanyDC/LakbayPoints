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
  ArrowUpDown,
  Users,
  ShieldCheck,
  ChevronRight,
  Bus,
} from "lucide-react-native";
import MapView from "react-native-maps";

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
        <View style={styles.pointsDivider} />
        <View style={styles.pointsColumn}>
          <Text style={styles.pointsLabel}>Eco Impact</Text>
          <Text style={styles.pointsValueGreen}>{demoUserRewardState.estimatedCo2eAvoidedKg}kg</Text>
          <Text style={styles.pointsSub}>CO2 Avoided</Text>
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
  onBeginPlayback,
}: {
  route: RouteOption;
  onCompareRoutes: () => void;
  onBeginPlayback: () => void;
}) {
  const totals = getRouteTotals(route);
  const origin = getRouteAccessPointLabel(route, route.originAccessPointId);
  const destination = getRouteAccessPointLabel(
    route,
    route.destinationAccessPointId,
  );

  const [selectedTab, setSelectedTab] = React.useState("best");

  const getSegmentIcon = (mode: string) => {
    switch (mode) {
      case "walk":
        return <Footprints color="#fff" size={14} />;
      case "mrt_3":
      case "lrt_1":
      case "lrt_2":
        return <Train color="#fff" size={14} />;
      case "edsa_carousel":
      case "puv":
        return <Bus color="#fff" size={14} />;
      default:
        return <MapPin color="#fff" size={14} />;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.planContent} bounces={false}>
      <View style={styles.planTopBar}>
        <View style={{ width: 24 }} />
        <Text style={styles.planTopBarTitle}>Plan Your Trip</Text>
        <Bell color="#1e3a8a" size={24} />
      </View>

      <View style={styles.locationBlock}>
        <View style={styles.locationInputArea}>
          <View style={styles.locationInputLeft}>
            <View style={styles.locationRow}>
              <View style={styles.dotOrigin} />
              <Text style={styles.locationText} numberOfLines={1}>{origin}</Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationRow}>
              <View style={styles.dotDest} />
              <Text style={styles.locationText} numberOfLines={1}>{destination}</Text>
            </View>
          </View>
          <Pressable style={styles.swapButton}>
            <ArrowUpDown color="#64748b" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeTabs}>
        <Pressable 
          style={[styles.routeTab, selectedTab === "best" && styles.routeTabActive]}
          onPress={() => setSelectedTab("best")}
        >
          <Text style={[styles.routeTabTitle, selectedTab === "best" && styles.routeTabTitleActive]}>Best Route</Text>
          <Text style={[styles.routeTabSub, selectedTab === "best" && styles.routeTabSubActive]}>Recommended</Text>
        </Pressable>
        <Pressable 
          style={[styles.routeTab, selectedTab === "fastest" && styles.routeTabActive]}
          onPress={() => setSelectedTab("fastest")}
        >
          <Text style={[styles.routeTabTitle, selectedTab === "fastest" && styles.routeTabTitleActive]}>Fastest</Text>
          <Text style={[styles.routeTabSub, selectedTab === "fastest" && styles.routeTabSubActive]}>44 min</Text>
        </Pressable>
        <Pressable 
          style={[styles.routeTab, selectedTab === "least_walk" && styles.routeTabActive]}
          onPress={() => setSelectedTab("least_walk")}
        >
          <Text style={[styles.routeTabTitle, selectedTab === "least_walk" && styles.routeTabTitleActive]}>Least Walk</Text>
          <Text style={[styles.routeTabSub, selectedTab === "least_walk" && styles.routeTabSubActive]}>1.1 km</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.mapArea}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 14.5818,
            longitude: 121.0531,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
        
        {/* Mock heatmap density bar */}
        <View style={styles.densityLegend}>
          <Text style={styles.densityLegendTitle}>Commuter Density</Text>
          <View style={styles.densityGradientRow}>
            <View style={[styles.densityBlock, { backgroundColor: "#86efac" }]} />
            <View style={[styles.densityBlock, { backgroundColor: "#fde047" }]} />
            <View style={[styles.densityBlock, { backgroundColor: "#f97316" }]} />
            <View style={[styles.densityBlock, { backgroundColor: "#dc2626" }]} />
          </View>
          <View style={styles.densityLabels}>
            <Text style={styles.densityLabelText}>Low</Text>
            <Text style={styles.densityLabelText}>High</Text>
          </View>
        </View>
        
        {/* Mock pins */}
        <View style={[styles.mapOverlayPin, { top: 120, left: 60 }]}>
          <View style={styles.mapPinIconContainer}>
            <Train color="#1e3a8a" size={14} />
          </View>
          <Text style={styles.mapPinLabel}>Guadalupe Station</Text>
        </View>
        
        <View style={[styles.mapOverlayPin, { top: 50, right: 60 }]}>
          <View style={styles.mapPinIconContainer}>
            <Train color="#1e3a8a" size={14} />
          </View>
          <Text style={styles.mapPinLabel}>Cubao Station</Text>
        </View>
      </View>

      <View style={styles.bottomRouteCard}>
        <View style={styles.routeHeaderRow}>
          <View>
            <Text style={styles.routeHeaderTitle}>Recommended Route</Text>
            <Text style={styles.routeHeaderSub}>Incl. 12 min walk • {route.segments.length - 1} transfer</Text>
          </View>
          <Text style={styles.routeTimeBig}>{formatRouteTime(route)}</Text>
        </View>

        <View style={styles.timelineList}>
          {route.segments.map((segment, index) => {
            const isWalk = segment.mode === "walk";
            const segmentColor = isWalk ? "#2563eb" : "#1e3a8a";
            return (
              <View style={styles.timelineRow} key={segment.id}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineIconBg, { backgroundColor: segmentColor }]}>
                    {getSegmentIcon(segment.mode)}
                  </View>
                  {index < route.segments.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineRight}>
                  {isWalk ? (
                    <>
                      <Text style={styles.timelineActionText}>{segment.label}</Text>
                      <Text style={styles.timelineMetaText}>{segment.travelTimeMin} min ({segment.distanceKm?.toFixed(1) || 0.4} km)</Text>
                    </>
                  ) : (
                    <>
                      <View style={styles.timelineTransitRow}>
                        <View style={[styles.transitBadge, { backgroundColor: segmentColor }]}>
                          <Text style={styles.transitBadgeText}>{segment.displayMode}</Text>
                        </View>
                        <Text style={styles.timelineActionText} numberOfLines={1}>{segment.label}</Text>
                      </View>
                      <Text style={styles.timelineMetaText}>{segment.travelTimeMin} min • Every 3-4 min</Text>
                    </>
                  )}
                  {index < route.segments.length - 1 && <View style={styles.timelineSpacing} />}
                </View>
                <View style={styles.timelineTimeRight}>
                   <Text style={styles.timelineTimeText}>{segment.travelTimeMin} min</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.chipsRow}>
          <View style={styles.chipCardYellow}>
            <Users color="#d97706" size={24} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.chipTitleYellow}>Moderate Crowds</Text>
              <Text style={styles.chipSubYellow}>Busier than usual on MRT-3. Expect moderate crowd levels.</Text>
            </View>
          </View>
          
          <View style={styles.chipCardGreen}>
            <View style={styles.chipGreenIconContainer}>
               <ShieldCheck color="#fff" size={16} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.chipSubGreen}>Route Safety</Text>
              <Text style={styles.chipTitleGreen}>Good</Text>
            </View>
            <ChevronRight color="#15803d" size={20} />
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onBeginPlayback}
        style={[styles.primaryButtonLarge, { marginHorizontal: 16, marginBottom: 16 }]}
      >
        <Text style={styles.primaryButtonText}>Begin Trip Playback</Text>
      </Pressable>
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
    fontSize: 22,
    fontWeight: "800",
  },
  pointsValueGreen: {
    color: "#16a34a",
    fontSize: 22,
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
  planContent: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
  },
  planTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  planTopBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  locationBlock: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  locationInputArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  locationInputLeft: {
    flex: 1,
  },
  locationRow: {
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
  locationText: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  locationDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginLeft: 24,
    marginVertical: 4,
  },
  swapButton: {
    padding: 12,
    marginLeft: 8,
  },
  routeTabs: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  routeTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  routeTabActive: {
    backgroundColor: "#1e3a8a",
    borderColor: "#1e3a8a",
  },
  routeTabTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  routeTabTitleActive: {
    color: "#fff",
  },
  routeTabSub: {
    fontSize: 11,
    color: "#64748b",
  },
  routeTabSubActive: {
    color: "#e0e7ff",
  },
  mapArea: {
    height: 320,
    position: "relative",
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  densityLegend: {
    position: "absolute",
    bottom: 12,
    right: 16,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: 140,
  },
  densityLegendTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 4,
    textAlign: "center",
  },
  densityGradientRow: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  densityBlock: {
    flex: 1,
  },
  densityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  densityLabelText: {
    fontSize: 9,
    color: "#64748b",
  },
  mapOverlayPin: {
    position: "absolute",
    alignItems: "center",
  },
  mapPinIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 4,
  },
  mapPinLabel: {
    backgroundColor: "#fff",
    color: "#1e3a8a",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomRouteCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  routeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  routeHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  routeHeaderSub: {
    fontSize: 12,
    color: "#64748b",
  },
  routeTimeBig: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e3a8a",
  },
  timelineList: {
    marginBottom: 20,
  },
  timelineRow: {
    flexDirection: "row",
  },
  timelineLeft: {
    alignItems: "center",
    width: 32,
    marginRight: 16,
  },
  timelineIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#1e3a8a",
    borderStyle: "dashed",
    opacity: 0.3,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  timelineMetaText: {
    fontSize: 12,
    color: "#64748b",
  },
  timelineTransitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  transitBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  transitBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  timelineTimeRight: {
    marginLeft: 12,
  },
  timelineTimeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    paddingTop: 4,
  },
  timelineSpacing: {
    height: 4,
  },
  chipsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chipCardYellow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  chipTitleYellow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#b45309",
    marginBottom: 2,
  },
  chipSubYellow: {
    fontSize: 9,
    color: "#92400e",
    lineHeight: 12,
  },
  chipCardGreen: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    borderRadius: 12,
  },
  chipGreenIconContainer: {
    backgroundColor: "#f59e0b",
    padding: 4,
    borderRadius: 12,
  },
  chipTitleGreen: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16a34a",
  },
  chipSubGreen: {
    fontSize: 10,
    color: "#64748b",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: 0,
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
  primaryButtonLarge: {
    backgroundColor: "#1e3a8a",
    paddingVertical: 16,
    borderRadius: 16,
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
});
