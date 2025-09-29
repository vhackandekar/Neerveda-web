export enum UserRole {
  HOUSEHOLD = 'HOUSEHOLD',
  COMMUNITY = 'COMMUNITY',
  WETLAND = 'WETLAND',
  ADMIN = 'ADMIN',
  RESEARCHER = 'RESEARCHER',
}

export enum StatusIndicator {
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red',
}

export enum MaintenanceRequestStatus {
    PENDING = 'Pending',
    SCHEDULED = 'Scheduled',
    RESOLVED = 'Resolved',
    CANCELLED = 'Cancelled',
}

export interface MaintenanceRequest {
    id: string;
    householdId: string; // To know who reported it
    reportedAt: string;
    issueType: string;
    urgency: 'Low' | 'Medium' | 'High';
    location: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    details: string;
    mediaUrl?: string;
    status: MaintenanceRequestStatus;
    scheduledFor?: string; // e.g., '2023-11-20 @ 10:00 AM'
    // Link back to the originating notification and anomaly context (if any)
    originNotificationId?: number;
    anomalyContext?: { sensor?: string; value?: number };
}

export interface Notification {
  id: number;
  type: 'info' | 'alert' | 'maintenance' | 'action_required';
  message: string;
  timestamp: string;
  read?: boolean;
  // Optional metadata for alerts
  severity?: 'low' | 'medium' | 'high' | 'critical';
  sensor?: string;
  value?: number;
}

export interface HistoricalDataPoint {
  date: string;
  usage: number;
  quality: number;
}

export interface FreshwaterConservationData {
    id: number;
    locationType: 'Urban' | 'Suburban' | 'Rural';
    populationDensity: 'High' | 'Medium' | 'Low';
    lpcd: 'High' | 'Medium' | 'Low';
    freshwaterSaved: number;
}

export interface WaterQualityMetrics {
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
}

export enum RecommendationStatus {
    EXCELLENT = 'Excellent',
    GOOD = 'Good',
    CAUTION = 'Caution',
    UNSAFE = 'Unsafe'
}

export interface AIRecommendation {
    status: RecommendationStatus;
    recommendation: string;
    suitableUses: string[];
    unsuitableUses: string[];
    explanation: string;
}

export enum SystemHealthStatus {
    OPTIMAL = 'Optimal',
    DEGRADED = 'Degraded',
    CRITICAL = 'Critical'
}

export interface PredictiveAlert {
    component: string;
    status: SystemHealthStatus;
    prediction: string;
    recommendation: string;
}

export interface SystemHealthData {
    filterPressure: number;
    pumpUptimeHours: number;
    waterTurbidityTrend: 'increasing' | 'decreasing' | 'stable';
}

export enum ReportStatus {
    SUBMITTED = 'Submitted',
    ACKNOWLEDGED = 'Acknowledged',
    IN_PROGRESS = 'In Progress',
    RESOLVED = 'Resolved',
    DUPLICATE = 'Duplicate'
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Official {
    id: string;
    name: string;
    title: string;
}

export interface ReportUpdate {
    timestamp: string;
    status: ReportStatus;
    author: string;
    notes?: string;
    evidenceUrl?: string;
}

export interface PollutionReport {
    id: string;
    timestamp: string;
    reporterId: string;
    imageUrl: string;
    boundingBox?: BoundingBox;
    comment: string;
    severity: number;
    location: {
        latitude: number;
        longitude: number;
        address: string;
    };
    taggedOfficials: Official[];
    sensorSnapshot?: {
        tds: number;
        turbidity: number;
    };
    status: ReportStatus;
    updates: ReportUpdate[];
}