# App User Flow

## Main Demo Story

Persona: A commuter traveling from Guadalupe to Cubao.

### Step 1: Search Route

User opens LakbayPoints and enters:
- Origin: Guadalupe
- Destination: Cubao

Primary CTA:
- Find Sustainable Routes

### Step 2: Route Comparison

Show three route cards only:

#### 1. Private Vehicle Baseline
Purpose: comparison only.

Fields:
- estimated travel time
- estimated cost
- traffic condition
- CO2e baseline
- no rewards

#### 2. Recommended Sustainable Trip
Purpose: main route.

Trip chain:
- Walk → MRT3 / public transport → Walk

Fields:
- estimated travel time
- estimated fare
- access score
- estimated CO2e avoided
- Lakbay Score to earn
- campaign points eligibility

CTA:
- Start Trip

#### 3. Phase 2 Multimodal Preview
Purpose: show future extendability without making it MVP-critical.

Trip chain:
- Walk / e-bike connector → transit/ferry connector → Walk

Label clearly:
- Phase 2 Preview
- Requires partner/data integration

### Step 3: Route Detail

Show:
- route map
- segment list
- access notes
- expected trip signals
- reward eligibility

### Step 4: Start Trip / Playback

For MVP:
- use sample trace playback
- show segment-by-segment movement
- display current segment

Segments:
1. Walk to station/loading area
2. Ride transit corridor
3. Walk to destination

### Step 5: Verify the Shift

Show classifier result:
- confidence score
- result label
- reward eligibility
- signal checklist

Example:
- Confidence: 87%
- Result: Verified sustainable trip chain
- Reward: Full Lakbay Score + campaign points

### Step 6: Reward Result

Show:
- Lakbay Score gained
- campaign points earned
- campaign cap reminder
- estimated CO2e avoided

Do not show real cash redemption.

### Step 7: Report Access Barrier

User reports:
- sidewalk obstruction
- unsafe crossing
- flooding
- illegal parking/loading obstruction
- damaged walkway/access path

Fields:
- category
- severity
- location
- photo placeholder/upload
- short description

### Step 8: MMDA Dashboard Payoff

Dashboard shows:
- new report in queue
- map pin
- status update
- corridor verified trips
- estimated CO2e impact
- campaign performance

## Key UX Rule

The user should understand the app in one sentence:

> LakbayPoints helps me choose a better commute, verifies my sustainable trip, rewards my consistency, and lets me report barriers that MMDA can see.
