/**
 * ==========================================================
 * DATA MODULE
 * Mock patient data and configuration constants.
 * In production, this would be replaced by API calls.
 * ==========================================================
 */

/* Initialize shared application namespace */
window.EnaraApp = window.EnaraApp || {};

/* ----- Risk color resolver ----- */
EnaraApp.getRiskColor = function(riskScore) {
  if (riskScore >= 80) return 'var(--color-danger)';
  if (riskScore >= 60) return 'var(--color-warning)';
  if (riskScore >= 40) return 'var(--color-caution)';
  return 'var(--color-success)';
};

/* ----- Class maps for badges ----- */
EnaraApp.RISK_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

EnaraApp.RISK_BADGE_CLASS = {
  Critical: 'badge--critical',
  High:     'badge--high',
  Medium:   'badge--medium',
  Low:      'badge--low'
};

EnaraApp.STATUS_BADGE_CLASS = {
  'Pending':             'badge--pending',
  'Contacted':           'badge--contacted',
  'Follow-up Scheduled': 'badge--followup',
  'Completed':           'badge--completed'
};

/* ----- KPI definitions ----- */
EnaraApp.KPI_DATA = [
  { label: 'Active Patients',        value: '1,247', delta: '↑ 3.2%', cls: 'kpi__delta--up',   hero: false, tooltip: 'Total patients enrolled in weight care program',   ringPct: 85, ringLabel: '85%', ringColor: 'var(--color-primary)' },
  { label: 'High-Risk Patients',     value: '38',    delta: '↑ 5',    cls: 'kpi__delta--down', hero: true,  tooltip: 'Patients with >60% predicted dropout probability',  ringPct: 30, ringLabel: '38',  ringColor: '#FC8181' },
  { label: 'Dropout Rate (30d)',     value: '4.8%',  delta: '↓ 0.6%', cls: 'kpi__delta--up',   hero: false, tooltip: 'Estimated dropout rate next 30 days',              ringPct: 48, ringLabel: '4.8', ringColor: 'var(--color-warning)' },
  { label: 'Retention Rate',         value: '78.4%', delta: '↑ 2.1%', cls: 'kpi__delta--up',   hero: false, tooltip: 'Patients completing program milestones',            ringPct: 78, ringLabel: '78%', ringColor: 'var(--color-success)' },
  { label: 'Avg Lead Time',          value: '18d',   delta: 'Steady', cls: 'kpi__delta--flat', hero: false, tooltip: 'Days before dropout the model flags patient',        ringPct: 60, ringLabel: '18d', ringColor: 'var(--color-primary)' },
  { label: 'Coverage',               value: '92%',   delta: '↑ 4%',  cls: 'kpi__delta--up',   hero: false, tooltip: 'High-risk patients with assigned action',            ringPct: 92, ringLabel: '92%', ringColor: 'var(--color-success)' },
  { label: 'Retained Post-Outreach', value: '78%',   delta: '↑ 3%',  cls: 'kpi__delta--up',   hero: false, tooltip: 'Contacted high-risk patients who stayed',            ringPct: 78, ringLabel: '78%', ringColor: 'var(--color-primary)' },
  { label: 'Pending Contact',        value: '14',    delta: '↓ 8',   cls: 'kpi__delta--up',   hero: false, tooltip: 'High-risk patients not yet reached',                 ringPct: 18, ringLabel: '14',  ringColor: 'var(--color-warning)' }
];

/* ----- Distribution data ----- */
EnaraApp.DISTRIBUTION = [
  { label: 'Critical', count: 12,   color: 'var(--color-danger)',  total: 1247 },
  { label: 'High',     count: 26,   color: 'var(--color-warning)', total: 1247 },
  { label: 'Medium',   count: 58,   color: 'var(--color-caution)', total: 1247 },
  { label: 'Low',      count: 1151, color: 'var(--color-success)', total: 1247 }
];

/* ----- Trend data (8 weeks) ----- */
EnaraApp.TREND_DATA = [
  { week: 'Feb 3',  value: 28 },
  { week: 'Feb 10', value: 31 },
  { week: 'Feb 17', value: 25 },
  { week: 'Feb 24', value: 33 },
  { week: 'Mar 3',  value: 29 },
  { week: 'Mar 10', value: 35 },
  { week: 'Mar 17', value: 32 },
  { week: 'Mar 24', value: 38 }
];

/* ----- Analytics segments ----- */
EnaraApp.SEGMENTS = [
  { title: 'Risk by Age Range',      items: [{ l:'18–29', p:22 },{ l:'30–44', p:31 },{ l:'45–59', p:35 },{ l:'60+', p:42 }] },
  { title: 'Risk by Insurer',        items: [{ l:'United', p:28 },{ l:'Aetna', p:34 },{ l:'BlueCross', p:26 },{ l:'Cigna', p:38 },{ l:'Humana', p:31 }] },
  { title: 'Risk by Med Track',      items: [{ l:'Lifestyle Only', p:41 },{ l:'Non-GLP Med', p:29 },{ l:'GLP-1', p:22 }] },
  { title: 'Risk by Modality',       items: [{ l:'Virtual', p:35 },{ l:'Hybrid', p:28 },{ l:'Clinic-Linked', p:21 }] },
  { title: 'Risk by State',          items: [{ l:'California', p:29 },{ l:'Texas', p:36 },{ l:'New York', p:27 },{ l:'Florida', p:38 },{ l:'Illinois', p:33 },{ l:'Ohio', p:40 }] },
  { title: 'Risk by Program Stage',  items: [{ l:'0–4 weeks', p:45 },{ l:'5–12 weeks', p:34 },{ l:'13–24 weeks', p:26 },{ l:'25+ weeks', p:18 }] },
  { title: 'Risk by Sex',            items: [{ l:'Female', p:30 },{ l:'Male', p:34 }] },
  { title: 'Risk by Engagement',     items: [{ l:'High', p:12 },{ l:'Medium', p:31 },{ l:'Low', p:54 }] },
  { title: 'Risk by Clinic',         items: [{ l:'West LA', p:26 },{ l:'Houston', p:35 },{ l:'NYC', p:28 },{ l:'Miami', p:32 },{ l:'SF', p:30 }] }
];

/* ----- Mock patient records -----
   Each patient represents a realistic Enara Health participant
   with clinical, behavioral, and engagement attributes.
*/
EnaraApp.PATIENTS = [
  {
    id: 'P-4521', name: 'Maria Rodriguez', initials: 'MR',
    sex: 'F', age: 42, state: 'CA',
    insurer: 'Aetna', weeks: 14, modality: 'Virtual',
    medTrack: 'GLP-1 Supported', clinic: 'Enara West LA',
    owner: 'Maria Lopez, RD',
    risk: 94, riskLevel: 'Critical', priority: 'Critical',
    status: 'Pending', dropoutWindow: 8, daysSince: 18,
    lastAppt: 'Mar 6', engagement: 'Low',
    factors: [
      { text: '3 of 5 appointments canceled',    value: 0.24, type: 'negative' },
      { text: 'Weight stagnant 4+ weeks',         value: 0.19, type: 'negative' },
      { text: 'No app login for 18 days',          value: 0.16, type: 'negative' },
      { text: 'Declined medication adjustment',    value: 0.08, type: 'negative' },
      { text: '14 weeks in program',               value: -0.05, type: 'positive' },
      { text: 'Initial BMI in range',              value: -0.03, type: 'positive' }
    ],
    summary: 'Maria has missed most recent appointments, her weight has stalled, and she hasn\'t logged into the app in over two weeks. She also declined a recent medication adjustment. The model sees a pattern consistent with imminent dropout.',
    action: 'Call patient'
  },
  {
    id: 'P-3892', name: 'James Thompson', initials: 'JT',
    sex: 'M', age: 38, state: 'TX',
    insurer: 'United Healthcare', weeks: 8, modality: 'Hybrid',
    medTrack: 'Non-GLP Medication', clinic: 'Enara Houston',
    owner: 'Dr. Sarah Chen',
    risk: 89, riskLevel: 'Critical', priority: 'Critical',
    status: 'Pending', dropoutWindow: 11, daysSince: 14,
    lastAppt: 'Mar 11', engagement: 'Low',
    factors: [
      { text: '2 consecutive no-shows',            value: 0.22, type: 'negative' },
      { text: 'No dietitian session in 6 weeks',   value: 0.17, type: 'negative' },
      { text: 'Labs pending since February',        value: 0.09, type: 'negative' },
      { text: 'Weight trending down slightly',      value: -0.07, type: 'positive' },
      { text: 'Active medication track',            value: -0.04, type: 'positive' }
    ],
    summary: 'James missed two consecutive appointments and hasn\'t had a dietitian session in over six weeks. His labs are overdue. Despite slight weight progress, his disengagement pattern is a strong dropout signal.',
    action: 'Call patient'
  },
  {
    id: 'P-3321', name: 'Thomas Chen', initials: 'TC',
    sex: 'M', age: 36, state: 'CA',
    insurer: 'Cigna', weeks: 4, modality: 'Virtual',
    medTrack: 'Lifestyle Only', clinic: 'Enara SF',
    owner: 'Unassigned',
    risk: 82, riskLevel: 'High', priority: 'Critical',
    status: 'Pending', dropoutWindow: 10, daysSince: 20,
    lastAppt: 'Mar 5', engagement: 'Low',
    factors: [
      { text: 'No contact in 20 days',              value: 0.21, type: 'negative' },
      { text: 'Very early in program (4 weeks)',     value: 0.18, type: 'negative' },
      { text: 'Never attended group class',          value: 0.09, type: 'negative' },
      { text: 'Completed intake labs',               value: -0.04, type: 'positive' }
    ],
    summary: 'Thomas is very early in the program and has had no contact in 20 days — the longest gap of any active patient. Early-stage disengagement is the strongest dropout predictor.',
    action: 'Call patient'
  },
  {
    id: 'P-7745', name: 'Michael Brown', initials: 'MB',
    sex: 'M', age: 61, state: 'OH',
    insurer: 'Humana', weeks: 10, modality: 'Hybrid',
    medTrack: 'Lifestyle Only', clinic: 'Enara Columbus',
    owner: 'Maria Lopez, RD',
    risk: 78, riskLevel: 'High', priority: 'High',
    status: 'Pending', dropoutWindow: 14, daysSince: 16,
    lastAppt: 'Mar 9', engagement: 'Low',
    factors: [
      { text: 'Long gap since provider visit',       value: 0.20, type: 'negative' },
      { text: 'No dietitian session booked',          value: 0.14, type: 'negative' },
      { text: 'Low app engagement',                   value: 0.10, type: 'negative' },
      { text: 'Age group higher dropout',              value: 0.05, type: 'negative' },
      { text: 'Hybrid modality engaged',               value: -0.06, type: 'positive' }
    ],
    summary: 'Michael has a significant gap since his last provider touchpoint and no upcoming dietitian session. Patients in his age group and engagement profile have historically higher dropout rates.',
    action: 'Escalate to nutritionist'
  },
  {
    id: 'P-5107', name: 'Karen Liu', initials: 'KL',
    sex: 'F', age: 51, state: 'NY',
    insurer: 'BlueCross BlueShield', weeks: 22, modality: 'Clinic-Linked',
    medTrack: 'GLP-1 Supported', clinic: 'Enara NYC',
    owner: 'James Wu, LCSW',
    risk: 72, riskLevel: 'High', priority: 'High',
    status: 'Contacted', dropoutWindow: 18, daysSince: 9,
    lastAppt: 'Mar 16', engagement: 'Medium',
    factors: [
      { text: 'Appointments spacing out',            value: 0.14, type: 'negative' },
      { text: 'Missed behavioral visit',              value: 0.11, type: 'negative' },
      { text: 'Group class inactive 3 weeks',         value: 0.08, type: 'negative' },
      { text: 'BMI improving steadily',                value: -0.12, type: 'positive' },
      { text: 'App moderately active',                 value: -0.06, type: 'positive' }
    ],
    summary: 'Karen\'s appointment frequency is declining and she missed her last behavioral health visit. However, her BMI continues to improve and she still uses the app. Mixed signals — worth monitoring closely.',
    action: 'Schedule nutritionist'
  },
  {
    id: 'P-4830', name: 'David Washington', initials: 'DW',
    sex: 'M', age: 34, state: 'IL',
    insurer: 'Cigna', weeks: 6, modality: 'Virtual',
    medTrack: 'Lifestyle Only', clinic: 'Enara Chicago',
    owner: 'Unassigned',
    risk: 65, riskLevel: 'High', priority: 'High',
    status: 'Pending', dropoutWindow: 21, daysSince: 12,
    lastAppt: 'Mar 13', engagement: 'Medium',
    factors: [
      { text: 'Only 6 weeks in program',              value: 0.15, type: 'negative' },
      { text: 'Weight unchanged since start',          value: 0.13, type: 'negative' },
      { text: 'No medication track',                   value: 0.06, type: 'negative' },
      { text: 'Attendance regular so far',             value: -0.10, type: 'positive' },
      { text: 'Completed initial labs',                value: -0.04, type: 'positive' }
    ],
    summary: 'David is early in the program and hasn\'t seen weight progress yet — a common trigger in the first 8 weeks. He\'s attending sessions but may need encouragement or care plan reassessment.',
    action: 'Send message'
  },
  {
    id: 'P-2910', name: 'Patricia Hernandez', initials: 'PH',
    sex: 'F', age: 47, state: 'FL',
    insurer: 'Humana', weeks: 18, modality: 'Hybrid',
    medTrack: 'GLP-1 Supported', clinic: 'Enara Miami',
    owner: 'Maria Lopez, RD',
    risk: 58, riskLevel: 'Medium', priority: 'Medium',
    status: 'Follow-up Scheduled', dropoutWindow: 25, daysSince: 5,
    lastAppt: 'Mar 20', engagement: 'Medium',
    factors: [
      { text: 'Prior auth delay on medication',        value: 0.12, type: 'negative' },
      { text: 'Slowed weight loss',                    value: 0.09, type: 'negative' },
      { text: 'Regular app usage',                     value: -0.11, type: 'positive' },
      { text: 'Attending group classes',               value: -0.08, type: 'positive' },
      { text: 'Recent provider visit',                 value: -0.06, type: 'positive' }
    ],
    summary: 'Patricia\'s GLP-1 prior authorization has been delayed, which may be affecting her motivation. Weight loss has slowed. However, she remains engaged with the app and group classes.',
    action: 'Monitor'
  },
  {
    id: 'P-8892', name: 'Linda Martinez', initials: 'LM',
    sex: 'F', age: 44, state: 'AZ',
    insurer: 'BlueCross BlueShield', weeks: 20, modality: 'Virtual',
    medTrack: 'GLP-1 Supported', clinic: 'Enara Phoenix',
    owner: 'Dr. Sarah Chen',
    risk: 51, riskLevel: 'Medium', priority: 'Medium',
    status: 'Pending', dropoutWindow: 22, daysSince: 8,
    lastAppt: 'Mar 17', engagement: 'Medium',
    factors: [
      { text: 'Weight plateau 3 weeks',                value: 0.11, type: 'negative' },
      { text: 'Reduced app usage',                     value: 0.08, type: 'negative' },
      { text: 'Consistent attendance',                 value: -0.13, type: 'positive' },
      { text: 'Active medication track',               value: -0.07, type: 'positive' },
      { text: 'Completed behavioral visit',            value: -0.05, type: 'positive' }
    ],
    summary: 'Linda is experiencing a weight plateau and her app usage has decreased. She continues attending appointments and recently completed a behavioral visit. Mixed signals — worth monitoring.',
    action: 'Send message'
  },
  {
    id: 'P-6234', name: 'Robert Kim', initials: 'RK',
    sex: 'M', age: 55, state: 'WA',
    insurer: 'Aetna', weeks: 30, modality: 'Virtual',
    medTrack: 'Non-GLP Medication', clinic: 'Enara Seattle',
    owner: 'Dr. Sarah Chen',
    risk: 44, riskLevel: 'Medium', priority: 'Medium',
    status: 'Contacted', dropoutWindow: 30, daysSince: 7,
    lastAppt: 'Mar 18', engagement: 'High',
    factors: [
      { text: 'Approaching program milestone',         value: 0.07, type: 'negative' },
      { text: 'Missed last behavioral visit',          value: 0.06, type: 'negative' },
      { text: 'Strong weight progress',                value: -0.15, type: 'positive' },
      { text: 'High app engagement',                   value: -0.10, type: 'positive' },
      { text: 'All labs current',                      value: -0.05, type: 'positive' }
    ],
    summary: 'Robert is doing well with strong weight progress and high engagement. The model flags slight concern as he approaches a program milestone — a common risk point. Low urgency.',
    action: 'Monitor'
  },
  {
    id: 'P-1183', name: 'Susan Park', initials: 'SP',
    sex: 'F', age: 29, state: 'CA',
    insurer: 'United Healthcare', weeks: 32, modality: 'Clinic-Linked',
    medTrack: 'GLP-1 Supported', clinic: 'Enara West LA',
    owner: 'James Wu, LCSW',
    risk: 18, riskLevel: 'Low', priority: 'Low',
    status: 'Completed', dropoutWindow: 60, daysSince: 3,
    lastAppt: 'Mar 22', engagement: 'High',
    factors: [
      { text: 'Perfect attendance',                    value: -0.18, type: 'positive' },
      { text: 'On track for weight goal',              value: -0.15, type: 'positive' },
      { text: 'Daily app user',                        value: -0.12, type: 'positive' },
      { text: 'All group classes completed',           value: -0.08, type: 'positive' }
    ],
    summary: 'Susan is one of the most engaged patients. Perfect attendance, on track for her weight goal, daily app user. The model sees no dropout signals.',
    action: 'No action needed'
  }
];

/* ----- Shared state ----- */
EnaraApp.state = {
  filteredPatients: [...EnaraApp.PATIENTS],
  selectedPatientId: null,
  sortColumn: 'risk',
  sortDirection: -1  /* -1 = descending, 1 = ascending */
};
