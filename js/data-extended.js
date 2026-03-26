/**
 * ==========================================================
 * DATA-EXTENDED MODULE
 * Weight trajectories, appointment histories, and
 * intervention log entries for the Patient Profile and
 * Intervention Log views.
 * ==========================================================
 */

/* ── Weight trajectories (weekly weigh-ins) ── */
EnaraApp.WEIGHT_HISTORY = {
  'P-4521': { start: 238, goal: 195, unit: 'lb', entries: [
    { week: 0,  value: 238 }, { week: 2,  value: 234 }, { week: 4,  value: 231 },
    { week: 6,  value: 228 }, { week: 8,  value: 226 }, { week: 10, value: 225 },
    { week: 12, value: 225 }, { week: 14, value: 225 }
  ]},
  'P-3892': { start: 272, goal: 220, unit: 'lb', entries: [
    { week: 0,  value: 272 }, { week: 2,  value: 269 }, { week: 4,  value: 265 },
    { week: 6,  value: 263 }, { week: 8,  value: 261 }
  ]},
  'P-3321': { start: 204, goal: 170, unit: 'lb', entries: [
    { week: 0,  value: 204 }, { week: 2,  value: 202 }, { week: 4,  value: 201 }
  ]},
  'P-7743': { start: 256, goal: 210, unit: 'lb', entries: [
    { week: 0,  value: 256 }, { week: 2,  value: 253 }, { week: 4,  value: 250 },
    { week: 6,  value: 248 }, { week: 8,  value: 247 }, { week: 10, value: 246 }
  ]},
  'P-5107': { start: 215, goal: 175, unit: 'lb', entries: [
    { week: 0,  value: 215 }, { week: 2,  value: 212 }, { week: 4,  value: 209 },
    { week: 6,  value: 206 }, { week: 8,  value: 203 }, { week: 10, value: 200 },
    { week: 12, value: 198 }, { week: 14, value: 196 }, { week: 16, value: 194 },
    { week: 18, value: 192 }, { week: 20, value: 191 }, { week: 22, value: 190 }
  ]},
  'P-4830': { start: 198, goal: 165, unit: 'lb', entries: [
    { week: 0,  value: 198 }, { week: 2,  value: 197 }, { week: 4,  value: 197 },
    { week: 6,  value: 198 }
  ]},
  'P-2910': { start: 222, goal: 180, unit: 'lb', entries: [
    { week: 0,  value: 222 }, { week: 2,  value: 219 }, { week: 4,  value: 216 },
    { week: 6,  value: 213 }, { week: 8,  value: 210 }, { week: 10, value: 208 },
    { week: 12, value: 206 }, { week: 14, value: 204 }, { week: 16, value: 203 },
    { week: 18, value: 202 }
  ]},
  'P-8892': { start: 210, goal: 170, unit: 'lb', entries: [
    { week: 0,  value: 210 }, { week: 2,  value: 207 }, { week: 4,  value: 204 },
    { week: 6,  value: 202 }, { week: 8,  value: 200 }, { week: 10, value: 198 },
    { week: 12, value: 196 }, { week: 14, value: 195 }, { week: 16, value: 195 },
    { week: 18, value: 195 }, { week: 20, value: 195 }
  ]},
  'P-6234': { start: 245, goal: 200, unit: 'lb', entries: [
    { week: 0,  value: 245 }, { week: 2,  value: 242 }, { week: 4,  value: 239 },
    { week: 6,  value: 236 }, { week: 8,  value: 233 }, { week: 10, value: 230 },
    { week: 12, value: 227 }, { week: 14, value: 225 }, { week: 16, value: 222 },
    { week: 18, value: 220 }, { week: 20, value: 218 }, { week: 22, value: 216 },
    { week: 24, value: 214 }, { week: 26, value: 212 }, { week: 28, value: 211 },
    { week: 30, value: 210 }
  ]},
  'P-1183': { start: 195, goal: 155, unit: 'lb', entries: [
    { week: 0,  value: 195 }, { week: 2,  value: 192 }, { week: 4,  value: 189 },
    { week: 6,  value: 186 }, { week: 8,  value: 184 }, { week: 10, value: 181 },
    { week: 12, value: 179 }, { week: 14, value: 176 }, { week: 16, value: 174 },
    { week: 18, value: 172 }, { week: 20, value: 170 }, { week: 22, value: 168 },
    { week: 24, value: 166 }, { week: 26, value: 164 }, { week: 28, value: 162 },
    { week: 30, value: 161 }, { week: 32, value: 160 }
  ]}
};

/* ── Appointment histories ── */
EnaraApp.APPOINTMENTS = {
  'P-4521': [
    { date: 'Dec 12', type: 'Provider Visit',   status: 'completed', note: 'Initial assessment, GLP-1 prescribed' },
    { date: 'Dec 26', type: 'Dietitian Session', status: 'completed', note: 'Meal plan established' },
    { date: 'Jan 9',  type: 'Provider Visit',   status: 'completed', note: 'Dosage adjustment reviewed' },
    { date: 'Jan 23', type: 'Behavioral Health', status: 'completed', note: 'Goal setting session' },
    { date: 'Feb 6',  type: 'Dietitian Session', status: 'canceled', note: 'Patient requested reschedule' },
    { date: 'Feb 20', type: 'Provider Visit',   status: 'no-show',  note: 'No contact, voicemail left' },
    { date: 'Mar 6',  type: 'Dietitian Session', status: 'canceled', note: 'Third cancellation' },
    { date: 'Mar 20', type: 'Provider Visit',   status: 'scheduled', note: 'Urgent follow-up pending' }
  ],
  'P-3892': [
    { date: 'Jan 30', type: 'Provider Visit',   status: 'completed', note: 'Intake assessment' },
    { date: 'Feb 13', type: 'Dietitian Session', status: 'completed', note: 'Nutrition baseline' },
    { date: 'Feb 27', type: 'Provider Visit',   status: 'no-show',  note: 'No notification received' },
    { date: 'Mar 11', type: 'Provider Visit',   status: 'no-show',  note: 'Second consecutive no-show' }
  ],
  'P-5107': [
    { date: 'Oct 10', type: 'Provider Visit',   status: 'completed', note: 'Intake — GLP-1 initiated' },
    { date: 'Oct 24', type: 'Dietitian Session', status: 'completed', note: 'Mediterranean diet plan' },
    { date: 'Nov 7',  type: 'Behavioral Health', status: 'completed', note: 'Motivation assessment' },
    { date: 'Nov 21', type: 'Provider Visit',   status: 'completed', note: 'Dosage increase' },
    { date: 'Dec 5',  type: 'Group Class',       status: 'completed', note: 'Mindful eating workshop' },
    { date: 'Dec 19', type: 'Dietitian Session', status: 'completed', note: 'Holiday nutrition plan' },
    { date: 'Jan 9',  type: 'Provider Visit',   status: 'completed', note: 'Labs reviewed — on track' },
    { date: 'Jan 30', type: 'Behavioral Health', status: 'completed', note: 'Stress management techniques' },
    { date: 'Feb 13', type: 'Provider Visit',   status: 'completed', note: 'Steady progress' },
    { date: 'Feb 27', type: 'Behavioral Health', status: 'no-show',  note: 'Missed — rescheduled' },
    { date: 'Mar 16', type: 'Dietitian Session', status: 'completed', note: 'Plateau strategies discussed' }
  ],
  'P-1183': [
    { date: 'Aug 15', type: 'Provider Visit',   status: 'completed', note: 'Intake — GLP-1 started' },
    { date: 'Aug 29', type: 'Dietitian Session', status: 'completed', note: 'Calorie budget set' },
    { date: 'Sep 12', type: 'Group Class',       status: 'completed', note: 'Intro to movement' },
    { date: 'Sep 26', type: 'Provider Visit',   status: 'completed', note: 'Great early progress' },
    { date: 'Oct 10', type: 'Behavioral Health', status: 'completed', note: 'Habit loop training' },
    { date: 'Oct 24', type: 'Dietitian Session', status: 'completed', note: 'Macro adjustments' },
    { date: 'Nov 7',  type: 'Provider Visit',   status: 'completed', note: 'Dosage optimization' },
    { date: 'Nov 21', type: 'Group Class',       status: 'completed', note: 'Strength training basics' },
    { date: 'Dec 5',  type: 'Provider Visit',   status: 'completed', note: 'Continued progress' },
    { date: 'Dec 19', type: 'Behavioral Health', status: 'completed', note: 'End-of-year check-in' },
    { date: 'Jan 16', type: 'Provider Visit',   status: 'completed', note: 'Labs excellent' },
    { date: 'Feb 6',  type: 'Dietitian Session', status: 'completed', note: 'Approaching goal weight' },
    { date: 'Mar 6',  type: 'Group Class',       status: 'completed', note: 'Maintenance strategies' },
    { date: 'Mar 22', type: 'Provider Visit',   status: 'completed', note: 'Near goal — transition plan' }
  ]
};

/* ── Intervention log (cross-patient, chronological) ── */
EnaraApp.INTERVENTIONS = [
  {
    id: 'INT-301', date: 'Mar 25', time: '09:15 AM',
    patientId: 'P-4521', patientName: 'Maria Rodriguez',
    type: 'Phone Call', initiatedBy: 'Maria Lopez, RD',
    outcome: 'No Answer', riskAtTime: 94,
    note: 'Called patient per critical risk flag. No answer — voicemail left requesting callback within 24h.'
  },
  {
    id: 'INT-300', date: 'Mar 25', time: '08:45 AM',
    patientId: 'P-3321', patientName: 'Thomas Chen',
    type: 'Phone Call', initiatedBy: 'System (Auto-assign)',
    outcome: 'Left Voicemail', riskAtTime: 82,
    note: 'Automated outreach trigger. Unassigned patient — escalated to care coordinator for assignment.'
  },
  {
    id: 'INT-299', date: 'Mar 24', time: '03:30 PM',
    patientId: 'P-3892', patientName: 'James Thompson',
    type: 'Secure Message', initiatedBy: 'Dr. Sarah Chen',
    outcome: 'Sent', riskAtTime: 89,
    note: 'Sent message via patient portal: "We noticed you\'ve missed recent appointments. We\'d love to help you get back on track. Please call us or reply to schedule."'
  },
  {
    id: 'INT-298', date: 'Mar 24', time: '11:00 AM',
    patientId: 'P-5107', patientName: 'Karen Liu',
    type: 'Phone Call', initiatedBy: 'James Wu, LCSW',
    outcome: 'Connected', riskAtTime: 72,
    note: 'Spoke with patient. She reported work stress causing missed behavioral sessions. Rescheduled for next week. Expressed commitment to continue.'
  },
  {
    id: 'INT-297', date: 'Mar 23', time: '02:15 PM',
    patientId: 'P-7743', patientName: 'Michael Davis',
    type: 'Care Plan Review', initiatedBy: 'Maria Lopez, RD',
    outcome: 'Updated', riskAtTime: 78,
    note: 'Reviewed care plan. Patient is lifestyle-only track at age 61 — discussed adding dietitian sessions. Booked first nutrition visit for next week.'
  },
  {
    id: 'INT-296', date: 'Mar 22', time: '04:00 PM',
    patientId: 'P-2910', patientName: 'Patricia Hernandez',
    type: 'Prior Auth Follow-up', initiatedBy: 'Maria Lopez, RD',
    outcome: 'In Progress', riskAtTime: 58,
    note: 'Called Humana regarding GLP-1 prior authorization delay. Representative said decision expected within 5 business days. Patient notified.'
  },
  {
    id: 'INT-295', date: 'Mar 22', time: '10:30 AM',
    patientId: 'P-4830', patientName: 'David Washington',
    type: 'Automated Check-in', initiatedBy: 'System',
    outcome: 'Delivered', riskAtTime: 65,
    note: 'Automated engagement message sent: encouragement for early-program participants with stalled weight. Included link to group class registration.'
  },
  {
    id: 'INT-294', date: 'Mar 21', time: '01:45 PM',
    patientId: 'P-8892', patientName: 'Linda Martinez',
    type: 'Secure Message', initiatedBy: 'Dr. Sarah Chen',
    outcome: 'Read', riskAtTime: 51,
    note: 'Sent plateau support resources and suggested behavioral health visit to address motivation. Patient read the message same day.'
  },
  {
    id: 'INT-293', date: 'Mar 20', time: '09:00 AM',
    patientId: 'P-6234', patientName: 'Robert Kim',
    type: 'Phone Call', initiatedBy: 'Dr. Sarah Chen',
    outcome: 'Connected', riskAtTime: 44,
    note: 'Routine milestone check-in at 30 weeks. Patient is doing well — discussed transition plan. Rescheduled behavioral visit he missed.'
  },
  {
    id: 'INT-292', date: 'Mar 19', time: '11:15 AM',
    patientId: 'P-1183', patientName: 'Susan Park',
    type: 'Provider Visit', initiatedBy: 'James Wu, LCSW',
    outcome: 'Completed', riskAtTime: 18,
    note: 'Maintenance phase transition discussion. Patient approaching goal weight — reviewed long-term sustainability plan. Exemplary engagement throughout.'
  },
  {
    id: 'INT-291', date: 'Mar 18', time: '02:00 PM',
    patientId: 'P-4521', patientName: 'Maria Rodriguez',
    type: 'Secure Message', initiatedBy: 'Maria Lopez, RD',
    outcome: 'Unread', riskAtTime: 91,
    note: 'Second outreach attempt. Sent via app messaging. Message remains unread after 7 days — escalating to phone call.'
  },
  {
    id: 'INT-290', date: 'Mar 17', time: '10:00 AM',
    patientId: 'P-3892', patientName: 'James Thompson',
    type: 'Phone Call', initiatedBy: 'Dr. Sarah Chen',
    outcome: 'No Answer', riskAtTime: 86,
    note: 'First outreach attempt after risk flag. No answer. Sent follow-up secure message.'
  }
];

/* ── Engagement metrics per patient ── */
EnaraApp.ENGAGEMENT_METRICS = {
  'P-4521': { appLogins7d: 0,  appointmentRate: 40, labsComplete: 75,  groupClasses: 1, behavioralVisits: 1 },
  'P-3892': { appLogins7d: 1,  appointmentRate: 50, labsComplete: 50,  groupClasses: 0, behavioralVisits: 0 },
  'P-3321': { appLogins7d: 0,  appointmentRate: 50, labsComplete: 100, groupClasses: 0, behavioralVisits: 0 },
  'P-7743': { appLogins7d: 2,  appointmentRate: 60, labsComplete: 80,  groupClasses: 0, behavioralVisits: 0 },
  'P-5107': { appLogins7d: 4,  appointmentRate: 91, labsComplete: 100, groupClasses: 3, behavioralVisits: 3 },
  'P-4830': { appLogins7d: 3,  appointmentRate: 100,labsComplete: 100, groupClasses: 0, behavioralVisits: 0 },
  'P-2910': { appLogins7d: 5,  appointmentRate: 100,labsComplete: 90,  groupClasses: 4, behavioralVisits: 2 },
  'P-8892': { appLogins7d: 3,  appointmentRate: 95, labsComplete: 100, groupClasses: 2, behavioralVisits: 3 },
  'P-6234': { appLogins7d: 6,  appointmentRate: 93, labsComplete: 100, groupClasses: 5, behavioralVisits: 4 },
  'P-1183': { appLogins7d: 7,  appointmentRate: 100,labsComplete: 100, groupClasses: 8, behavioralVisits: 6 }
};

/* ── Model Performance data ── */
EnaraApp.MODEL_COMPARISON = [
  { name: 'Logistic Regression', accuracy: 0.81, precision: 0.78, recall: 0.76, f1: 0.77, auc: 0.84, trainTime: '2.1s' },
  { name: 'Random Forest',       accuracy: 0.89, precision: 0.85, recall: 0.88, f1: 0.86, auc: 0.93, trainTime: '8.4s' },
  { name: 'XGBoost',             accuracy: 0.87, precision: 0.84, recall: 0.86, f1: 0.85, auc: 0.91, trainTime: '5.7s' }
];

EnaraApp.CONFUSION_MATRIX = {
  labels: ['Stayed', 'Dropped Out'],
  values: [[924, 36], [47, 240]]  /* [TN, FP], [FN, TP] */
};

EnaraApp.FEATURE_IMPORTANCE = [
  { feature: 'Days since last appointment',  importance: 0.18 },
  { feature: 'Appointment cancellation rate', importance: 0.15 },
  { feature: 'App login frequency (7d)',      importance: 0.13 },
  { feature: 'Weight change velocity',        importance: 0.11 },
  { feature: 'Weeks in program',              importance: 0.09 },
  { feature: 'Behavioral visits completed',   importance: 0.08 },
  { feature: 'Group class attendance',         importance: 0.07 },
  { feature: 'Medication track',               importance: 0.06 },
  { feature: 'Modality',                       importance: 0.05 },
  { feature: 'Lab completion rate',            importance: 0.04 }
];

EnaraApp.ROC_POINTS = [
  { fpr: 0.00, tpr: 0.00 },
  { fpr: 0.02, tpr: 0.35 },
  { fpr: 0.05, tpr: 0.62 },
  { fpr: 0.08, tpr: 0.74 },
  { fpr: 0.12, tpr: 0.82 },
  { fpr: 0.18, tpr: 0.88 },
  { fpr: 0.25, tpr: 0.91 },
  { fpr: 0.35, tpr: 0.94 },
  { fpr: 0.50, tpr: 0.96 },
  { fpr: 0.70, tpr: 0.98 },
  { fpr: 1.00, tpr: 1.00 }
];

EnaraApp.CV_SCORES = {
  folds: ['Fold 1','Fold 2','Fold 3','Fold 4','Fold 5'],
  accuracy:  [0.88, 0.90, 0.87, 0.91, 0.89],
  f1:        [0.85, 0.87, 0.84, 0.88, 0.86]
};

/* ── Heatmap data (Stage × Modality risk) ── */
EnaraApp.HEATMAP_DATA = {
  rows: ['0–4 wk', '5–12 wk', '13–24 wk', '25+ wk'],
  cols: ['Virtual', 'Hybrid', 'Clinic'],
  values: [
    [52, 41, 33],
    [38, 30, 24],
    [31, 25, 19],
    [22, 16, 12]
  ]
};

/* ── Radar chart dimensions ── */
EnaraApp.RADAR_DIMENSIONS = [
  { label: 'Age 60+',       value: 42 },
  { label: 'Early Stage',   value: 45 },
  { label: 'Low Engage.',   value: 54 },
  { label: 'Lifestyle Only', value: 41 },
  { label: 'Virtual',        value: 35 },
  { label: 'South Region',  value: 38 }
];
