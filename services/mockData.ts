import { HistoricalDataPoint, FreshwaterConservationData, StatusIndicator, Notification, PollutionReport, ReportStatus, Official, MaintenanceRequest, MaintenanceRequestStatus } from '../types';

export const mockCommunityData = {
  totalHouseholds: 128,
  waterSaved: 45000,
  activeAlerts: 3,
};

export const mockMaintenanceTasks = [
  { id: 1, description: 'Central filter inspection', assignedTo: 'Team A', status: 'Completed', dueDate: '2023-10-25' },
  { id: 2, description: 'Pump calibration at Sector B', assignedTo: 'John Doe', status: 'In Progress', dueDate: '2023-11-05' },
  { id: 3, description: 'Sensor check at household #42', assignedTo: 'Jane Smith', status: 'Pending', dueDate: '2023-11-10' },
  { id: 4, description: 'Community pipeline flush', assignedTo: 'Team B', status: 'Pending', dueDate: '2023-11-12' },
];

export const mockPollutionHotspots = [
  { id: 1, location: 'Near Industrial Park', severity: 'High', lastReported: '2023-11-02' },
  { id: 2, location: 'Creek outlet, Sector D', severity: 'Medium', lastReported: '2023-11-01' },
];

export const mockHistoricalData: HistoricalDataPoint[] = [
  { date: 'Jan', usage: 4000, quality: 85 },
  { date: 'Feb', usage: 3000, quality: 88 },
  { date: 'Mar', usage: 5000, quality: 82 },
  { date: 'Apr', usage: 4500, quality: 90 },
  { date: 'May', usage: 4800, quality: 91 },
  { date: 'Jun', usage: 5200, quality: 87 },
  { date: 'Jul', usage: 6000, quality: 85 },
];

export const mockWeeklyUsageData: HistoricalDataPoint[] = [
  { date: 'Mon', usage: 180, quality: 92 },
  { date: 'Tue', usage: 210, quality: 91 },
  { date: 'Wed', usage: 190, quality: 93 },
  { date: 'Thu', usage: 220, quality: 89 },
  { date: 'Fri', usage: 250, quality: 90 },
  { date: 'Sat', usage: 280, quality: 88 },
  { date: 'Sun', usage: 260, quality: 91 },
];

export const mockWetlandData = {
  healthStatus: StatusIndicator.GREEN,
  biodiversityIndex: 0.89,
  inflow: 1200,
  outflow: 1050,
  seasonalForecast: 'Expect higher than average rainfall over the next two weeks, which may increase inflow rates. System is prepared to handle the load.',
};

export const mockAdminData = {
    totalSensors: 256,
    onlineSensors: 254,
    calibrationDue: 12,
    issuesReported: 2,
};

export const mockConservationData: FreshwaterConservationData[] = [
    { id: 1, locationType: 'Urban', populationDensity: 'High', lpcd: 'High', freshwaterSaved: 120000 },
    { id: 2, locationType: 'Suburban', populationDensity: 'Medium', lpcd: 'Medium', freshwaterSaved: 150000 },
    { id: 3, locationType: 'Rural', populationDensity: 'Low', lpcd: 'High', freshwaterSaved: 80000 },
    { id: 4, locationType: 'Urban', populationDensity: 'High', lpcd: 'Medium', freshwaterSaved: 220000 },
    { id: 5, locationType: 'Suburban', populationDensity: 'Medium', lpcd: 'Low', freshwaterSaved: 180000 },
    { id: 6, locationType: 'Urban', populationDensity: 'Medium', lpcd: 'Medium', freshwaterSaved: 95000 },
    { id: 7, locationType: 'Rural', populationDensity: 'Low', lpcd: 'Low', freshwaterSaved: 110000 },
];

export const mockHouseholdMetrics = {
    waterQuality: { ph: 7.2, tds: 250, turbidity: 4.5, temperature: 22 },
    waterSaved: { today: 150, week: 980, month: 4200, total: 35000 },
    systemStatus: { filter: StatusIndicator.GREEN, pump: StatusIndicator.GREEN, sensors: StatusIndicator.GREEN },
    tankLevels: {
        collection: { current: 180, capacity: 300 }, // Greywater collection tank
        storage: { current: 450, capacity: 500 }, // Clean water storage tank
    },
};

export const mockHouseholdNotifications: Notification[] = [
    { id: 4, type: 'action_required', message: 'Anomaly Detected: The system reports unusually high pump pressure. Please check for blockages.', timestamp: '15 minutes ago', read: false },
    { id: 1, type: 'info', message: 'Filter backwash cycle completed successfully.', timestamp: '2 hours ago', read: true },
    { id: 2, type: 'maintenance', message: 'UV lamp replacement due in 7 days.', timestamp: '1 day ago', read: false },
    { id: 3, type: 'alert', message: 'High turbidity detected. System is flushing. Reuse is paused.', timestamp: '3 days ago', read: true },
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
    {
        id: 'MR-001',
        householdId: 'user-789',
        reportedAt: '2 days ago',
        issueType: 'Leak Detected',
        urgency: 'High',
        location: 'Near the outdoor pump unit',
        details: 'There is a small but steady drip of water coming from one of the pipe connections on the main pump.',
        status: MaintenanceRequestStatus.PENDING,
    }
];

export const mockOfficials: Official[] = [
    { id: 'off1', name: 'Smt. Radha Kumari', title: 'Sarpanch, Sector B' },
    { id: 'off2', name: 'Shri. Vikram Singh', title: 'Ward Officer, Sector D' },
    { id: 'off3', name: 'Anjali Menon', title: 'Environmental Officer' },
];

export const mockPollutionReports: PollutionReport[] = [
    {
        id: 'PR-001',
        timestamp: '3 days ago',
        reporterId: 'user-123',
        imageUrl: `https://picsum.photos/seed/pr001/800/600`,
        comment: 'Industrial waste seems to be illegally dumped near the creek outlet. The water has a strange color.',
        severity: 4,
        location: { latitude: 12.9716, longitude: 77.5946, address: 'Creek outlet, Sector D' },
        taggedOfficials: [mockOfficials[1], mockOfficials[2]],
        sensorSnapshot: { tds: 850, turbidity: 25 },
        status: ReportStatus.IN_PROGRESS,
        updates: [
            { timestamp: '2 days ago', status: ReportStatus.ACKNOWLEDGED, author: 'Shri. Vikram Singh', notes: 'Team has been dispatched to investigate.' },
            { timestamp: '1 day ago', status: ReportStatus.IN_PROGRESS, author: 'Shri. Vikram Singh', notes: 'Initial cleanup has started. Water samples collected for testing.' },
        ],
    },
    {
        id: 'PR-002',
        timestamp: '1 week ago',
        reporterId: 'user-456',
        imageUrl: `https://picsum.photos/seed/pr002/800/600`,
        comment: 'Large amount of plastic bottles and bags floating on the water surface.',
        severity: 3,
        location: { latitude: 12.9720, longitude: 77.5950, address: 'Wetland Park, Sector C' },
        taggedOfficials: [mockOfficials[0]],
        status: ReportStatus.RESOLVED,
        updates: [
            { timestamp: '6 days ago', status: ReportStatus.ACKNOWLEDGED, author: 'Smt. Radha Kumari' },
            { timestamp: '5 days ago', status: ReportStatus.IN_PROGRESS, author: 'Smt. Radha Kumari', notes: 'Community cleanup drive organized.' },
            { timestamp: '4 days ago', status: ReportStatus.RESOLVED, author: 'Smt. Radha Kumari', notes: 'Area has been cleared. Thank you for reporting.', evidenceUrl: `https://picsum.photos/seed/resolved002/800/600` },
        ],
    }
];