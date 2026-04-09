import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, ComposedChart, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import {
  Home, Bot, BarChart2, Link2, Bell, Settings, ChevronRight,
  ChevronDown, AlertTriangle, CheckCircle, Clock, TrendingUp,
  DollarSign, Zap, Database, Search, Filter, Download, Plus,
  Edit2, X, RefreshCw, ExternalLink, Shield, Activity,
  FileText, ArrowLeft, Layers, Send, Pin, Info, ChevronUp,
  Calendar, User
} from 'lucide-react';

// ── CONSTANTS ────────────────────────────────────────────────────────────────

const NAVY = '#0A1F44';
const NAVY_LIGHT = '#1565C0';
const GREEN = '#1B8A4C';
const AMBER = '#D97706';
const RED = '#C62828';
const GRAY = '#6B7280';

const STORES = [
  'Rohrman Honda – Fishers', 'Rohrman Toyota – Lafayette', 'Rohrman Kia – Lafayette',
  'Rohrman Subaru – Lafayette', 'Rohrman Buick GMC – Lafayette', 'Rohrman Volkswagen – Merrillville',
  'Rohrman Mitsubishi – Lafayette', 'Rohrman Ford – Lafayette', 'Rohrman Hyundai – Lafayette',
  'Purdue Toyota – W. Lafayette', 'Rohrman Honda – Peru', 'Rohrman Chevrolet – Lafayette',
  'Rohrman Nissan – Lafayette', 'Rohrman Mazda – Lafayette', 'Rohrman CJDR – Lafayette',
  'Rohrman BMW – Lafayette', 'Rohrman Cadillac – Lafayette', 'Rohrman Lexus – Lafayette',
  'Rohrman Acura – Lafayette', 'Rohrman Genesis – Lafayette',
];

const ADE_DEFS = [
  { id: 'nova',  name: 'NOVA',  role: 'BDC / Inbound Lead Response',            icon: '📡', color: NAVY_LIGHT, tasks: 312, score: 94, escalations: 3,  stores: 8  },
  { id: 'felix', name: 'FELIX', role: 'F&I Sparring & Compliance Trainer',        icon: '🎯', color: NAVY,       tasks: 187, score: 91, escalations: 1,  stores: 20 },
  { id: 'aria',  name: 'ARIA',  role: 'Service Advisor Intake & Scheduling',      icon: '🔧', color: GREEN,      tasks: 423, score: 96, escalations: 5,  stores: 12 },
  { id: 'scout', name: 'SCOUT', role: 'Inventory Acquisition & Stocking Analyst', icon: '🔍', color: AMBER,      tasks: 89,  score: 88, escalations: 2,  stores: 20 },
  { id: 'merch', name: 'MERCH', role: 'Vehicle Merchandising & Pricing Agent',    icon: '💲', color: '#7C3AED',  tasks: 164, score: 92, escalations: 0,  stores: 20 },
  { id: 'atlas', name: 'ATLAS', role: 'Snowflake Data Lake Query & Intelligence', icon: '🌐', color: '#0891B2',  tasks: 72,  score: 99, escalations: 0,  stores: 20 },
];

const mkSparkline = (base, variance, count = 12) =>
  Array.from({ length: count }, () => ({ v: Math.max(0, base + (Math.random() - 0.5) * variance * 2) }));

const SPARKLINES = {
  active:   mkSparkline(6, 1),
  tasks:    mkSparkline(1200, 200),
  response: mkSparkline(1.3, 0.4),
  hours:    mkSparkline(3800, 300),
  savings:  mkSparkline(125000, 8000),
};

const FEEDS = {
  nova: [
    { t: '09:42:17', msg: 'Responded to inbound web lead — Darnell W. | Fishers Honda' },
    { t: '09:41:55', msg: 'Objection handled: "I need to think about it" — Score: 91/100' },
    { t: '09:41:30', msg: 'Lead scored: Marcus T. → Hot (87pts) | Toyota Lafayette' },
    { t: '09:40:12', msg: 'Follow-up SMS queued for 3pm — Jennifer K. | Kia Lafayette' },
  ],
  felix: [
    { t: '09:42:17', msg: 'F&I spar completed — Agent: Tyler M. | Pass (93/100)' },
    { t: '09:41:55', msg: 'Objection handled: "I need to think about it" — Score: 91/100' },
    { t: '09:41:30', msg: 'Compliance flag: used "warranty" — corrected | Merrillville VW' },
    { t: '09:40:18', msg: 'Session started — Agent: Rachel S. | Buick GMC Lafayette' },
  ],
  aria: [
    { t: '09:42:08', msg: 'Appt scheduled: Oil change + rotation — Kevin B. | Fishers Honda' },
    { t: '09:41:44', msg: 'Intake completed: recall inquiry — Sarah L. | Toyota Lafayette' },
    { t: '09:41:02', msg: 'Escalated to service advisor: warranty dispute | Peru Honda' },
    { t: '09:40:33', msg: 'Loaner vehicle coordinated — James W. | Subaru Lafayette' },
  ],
  scout: [
    { t: '09:42:05', msg: 'Acquisition rec: 2024 Accord EX — Buy under $25,800' },
    { t: '09:41:40', msg: 'Aging alert: 14 units 60+ days | Nissan Lafayette' },
    { t: '09:41:10', msg: 'Market gap: RAV4 Hybrid demand up 23% YoY' },
    { t: '09:40:25', msg: 'Stocking plan updated: Q2 targets revised for Kia' },
  ],
  merch: [
    { t: '09:42:11', msg: 'Price adj: 2023 Camry LE → $28,499 (was $29,250) | Toyota' },
    { t: '09:41:55', msg: 'Photo audit: 3 units missing hero shots | Buick GMC' },
    { t: '09:41:22', msg: 'VDP optimization: +14% engagement on Civic | Fishers Honda' },
    { t: '09:40:50', msg: 'Competitive alert: Carmax undercutting CR-V by $800' },
  ],
  atlas: [
    { t: '09:42:14', msg: 'Query: "F&I PVR by store YTD" — 2.3M records, 0.4s' },
    { t: '09:41:55', msg: '"Gross Profit by Model Q1" pinned to Command Center' },
    { t: '09:41:30', msg: 'Export: aged inventory → CSV (847 rows)' },
    { t: '09:40:10', msg: 'Anomaly: Svc RO volume down 18% at BMW Lafayette' },
  ],
};

// Chart data
const dailyTasks = Array.from({ length: 14 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  NOVA: 280 + Math.round((Math.random() - 0.5) * 80),
  FELIX: 160 + Math.round((Math.random() - 0.5) * 50),
  ARIA: 390 + Math.round((Math.random() - 0.5) * 90),
  SCOUT: 75 + Math.round((Math.random() - 0.5) * 30),
  MERCH: 140 + Math.round((Math.random() - 0.5) * 40),
  ATLAS: 60 + Math.round((Math.random() - 0.5) * 20),
}));

const humanHoursData = Array.from({ length: 8 }, (_, i) => ({
  week: `Wk ${i + 1}`,
  NOVA: 320 + Math.round(Math.random() * 80),
  FELIX: 210 + Math.round(Math.random() * 60),
  ARIA: 480 + Math.round(Math.random() * 100),
  SCOUT: 120 + Math.round(Math.random() * 40),
  MERCH: 180 + Math.round(Math.random() * 50),
}));

const sparScoreData = Array.from({ length: 14 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  score: 78 + Math.round(Math.random() * 18),
  avg: 88,
}));

const leadResponseData = Array.from({ length: 14 }, (_, i) => ({
  range: `${i * 7}–${(i + 1) * 7}s`,
  count: i < 4 ? Math.round(12 + Math.random() * 20) : i < 10 ? Math.round(30 + Math.random() * 50) : Math.round(3 + Math.random() * 10),
}));

const uptimeData = ADE_DEFS.map(a => ({ name: a.name, uptime: 99.1 + Math.random() * 0.88 }));

const costSavingsData = [
  { name: 'NOVA', value: 38400, fill: NAVY_LIGHT },
  { name: 'FELIX', value: 29800, fill: NAVY },
  { name: 'ARIA', value: 31200, fill: GREEN },
  { name: 'SCOUT', value: 14600, fill: AMBER },
  { name: 'MERCH', value: 13400, fill: '#7C3AED' },
];

const FELIX_SESSIONS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  agent: ['Tyler M.', 'Rachel S.', 'James W.', 'Amanda K.', 'Derek P.', 'Stephanie L.', 'Marcus B.', 'Nicole T.'][i % 8],
  store: STORES[i % 8],
  topic: ['GAP Insurance', 'Vehicle Service Contracts', 'Tire & Wheel Protection', 'Paint Protection Film', 'Credit Life Insurance', 'Key Replacement'][i % 6],
  duration: `${4 + Math.round(Math.random() * 8)}:${String(Math.round(Math.random() * 59)).padStart(2, '0')}`,
  score: 74 + Math.round(Math.random() * 24),
  status: ['Pass', 'Pass', 'Pass', 'Fail', 'Pass'][i % 5],
  date: `Apr ${Math.max(1, 9 - Math.floor(i / 3))}`,
}));

const FELIX_LIVE = [
  { agent: 'Tyler M.', store: 'Chevrolet Lafayette', topic: 'GAP Insurance', duration: '4:22', score: 91, status: 'Active' },
  { agent: 'Amanda K.', store: 'Toyota Lafayette', topic: 'VSC Presentation', duration: '2:14', score: 86, status: 'Active' },
  { agent: 'Derek P.', store: 'Kia Lafayette', topic: 'Paint Protection', duration: '6:55', score: 78, status: 'Active' },
];

const ACTIVITY_LOG = [
  { id: 1,  ts: '09:42:17', type: 'Autonomous',    ade: 'NOVA',  store: 'Fishers Honda',      action: 'Lead Response',    detail: 'Responded to Darnell W. — first contact <45s',           outcome: 'Lead Advanced' },
  { id: 2,  ts: '09:41:55', type: 'Escalation',    ade: 'ARIA',  store: 'Peru Honda',          action: 'Escalation',       detail: 'Service dispute escalated to advisor',                   outcome: 'Human Review' },
  { id: 3,  ts: '09:41:30', type: 'Human Override', ade: 'FELIX', store: 'VW Merrillville',    action: 'Session Override', detail: 'Manager ended spar early — agent score 87',              outcome: 'Overridden' },
  { id: 4,  ts: '09:40:18', type: 'Autonomous',    ade: 'SCOUT', store: 'Toyota Lafayette',    action: 'Acquisition Rec',  detail: '2024 Accord EX — buy under $25,800',                     outcome: 'Pending Review' },
  { id: 5,  ts: '09:39:55', type: 'System Event',  ade: 'ATLAS', store: 'All Stores',          action: 'Snowflake Sync',   detail: 'Full data lake refresh — 2.54M records',                 outcome: 'Completed' },
  { id: 6,  ts: '09:38:44', type: 'Autonomous',    ade: 'MERCH', store: 'Buick GMC',           action: 'Price Update',     detail: '2023 Camry LE repriced to $28,499',                      outcome: 'Published' },
  { id: 7,  ts: '09:37:22', type: 'Autonomous',    ade: 'NOVA',  store: 'Kia Lafayette',       action: 'Follow-up SMS',    detail: 'Jennifer K. follow-up queued — 3pm slot',                outcome: 'Sent' },
  { id: 8,  ts: '09:36:10', type: 'Escalation',    ade: 'FELIX', store: 'BMW Lafayette',       action: 'Compliance Flag',  detail: 'Used "warranty" — session flagged at 2:14',              outcome: 'Flagged' },
  { id: 9,  ts: '09:35:05', type: 'Autonomous',    ade: 'ARIA',  store: 'Subaru Lafayette',    action: 'Appt Scheduled',   detail: 'Oil change + alignment — Kevin B.',                      outcome: 'Confirmed' },
  { id: 10, ts: '09:34:30', type: 'System Event',  ade: 'ATLAS', store: 'All Stores',          action: 'Anomaly Alert',    detail: 'BMW Svc RO volume down 18% WoW',                         outcome: 'Alert Sent' },
  { id: 11, ts: '09:33:18', type: 'Human Override', ade: 'SCOUT', store: 'Nissan Lafayette',   action: 'Rec Rejected',     detail: 'GM rejected 2023 Pathfinder rec — overstock',           outcome: 'Overridden' },
  { id: 12, ts: '09:32:45', type: 'Autonomous',    ade: 'FELIX', store: 'Chevrolet Lafayette', action: 'Spar Completed',   detail: 'Tyler M. — Pass (93/100) | Topic: GAP Insurance',        outcome: 'Passed' },
  { id: 13, ts: '09:31:20', type: 'Autonomous',    ade: 'NOVA',  store: 'Hyundai Lafayette',   action: 'Lead Scored',      detail: 'Marcus T. → Hot (87pts) | Ioniq 6 inquiry',              outcome: 'Routed to BDC' },
  { id: 14, ts: '09:30:08', type: 'System Event',  ade: 'MERCH', store: 'All Stores',          action: 'Photo Audit',      detail: '3 units missing hero shots flagged',                     outcome: 'Task Created' },
  { id: 15, ts: '09:28:55', type: 'Autonomous',    ade: 'ARIA',  store: 'Toyota Lafayette',    action: 'Recall Intake',    detail: 'Sarah L. — recall inquiry, parts ordered',               outcome: 'In Progress' },
];

const ATLAS_RESPONSES = {
  "Which 5 stores had the lowest F&I PVR last month?": {
    summary: "5 Rohrman locations showed the lowest F&I per-vehicle-retailed (PVR) in March 2026. Combined average of $1,247 PVR vs. group average of $1,890.",
    table: {
      headers: ['Rank', 'Store', 'F&I PVR', 'Units', 'Total F&I Gross', 'vs. Group'],
      rows: [
        ['1', 'Rohrman Mitsubishi', '$847', '34', '$28,798', '−$1,043'],
        ['2', 'Rohrman Genesis', '$912', '22', '$20,064', '−$978'],
        ['3', 'Rohrman Hyundai', '$1,041', '87', '$90,567', '−$849'],
        ['4', 'Rohrman Ford', '$1,188', '112', '$133,056', '−$702'],
        ['5', 'Rohrman Kia', '$1,204', '94', '$113,176', '−$686'],
      ],
    },
    chartData: [{ name: 'Mitsubishi', value: 847 }, { name: 'Genesis', value: 912 }, { name: 'Hyundai', value: 1041 }, { name: 'Ford', value: 1188 }, { name: 'Kia', value: 1204 }],
    meta: { source: 'Snowflake', records: '2.54M', time: '0.4s' },
  },
  "Show me gross profit trend by model for Q1": {
    summary: "Q1 2026 gross profit by top 8 models. Honda Accord and Toyota Camry led front-end gross; F-150 led total combined gross at $1.3M.",
    table: {
      headers: ['Model', 'Units', 'Front-End', 'F&I Gross', 'Total Gross', 'Avg PVR'],
      rows: [
        ['F-150', '214', '$892,400', '$412,800', '$1,305,200', '$6,100'],
        ['Accord', '198', '$748,200', '$389,600', '$1,137,800', '$5,747'],
        ['Camry', '187', '$701,400', '$366,400', '$1,067,800', '$5,710'],
        ['CR-V', '162', '$605,800', '$318,400', '$924,200', '$5,706'],
        ['RAV4', '148', '$587,200', '$304,400', '$891,600', '$6,024'],
        ['Civic', '141', '$494,200', '$278,800', '$773,000', '$5,482'],
      ],
    },
    chartData: [
      { name: 'F-150', value: 1305200 }, { name: 'Accord', value: 1137800 },
      { name: 'Camry', value: 1067800 }, { name: 'CR-V', value: 924200 },
      { name: 'RAV4', value: 891600 }, { name: 'Civic', value: 773000 },
    ],
    meta: { source: 'Snowflake', records: '2.54M', time: '0.6s' },
  },
};

const ATLAS_QUERIES = [
  "Which 5 stores had the lowest F&I PVR last month?",
  "Show me gross profit trend by model for Q1",
  "Which inventory is aged 60+ days across all stores?",
  "What's the average reconditioning time by location?",
  "Compare service absorption rate YoY by store",
  "Total new vs. used gross by store MTD",
];

// ── UTILITIES ────────────────────────────────────────────────────────────────

const cn = (...cls) => cls.filter(Boolean).join(' ');

const SparklineChart = ({ data, color = NAVY_LIGHT }) => (
  <ResponsiveContainer width="100%" height={36}>
    <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
      <defs>
        <linearGradient id={`sg${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.18} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg${color.replace('#', '')})`} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

const KPICard = ({ label, value, sub, sparkData, sparkColor }) => (
  <div className="bg-white rounded-lg border border-[#E2E6EA] p-4 flex flex-col gap-1 flex-1 min-w-0" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#6B7280]">{label}</span>
    <div className="flex items-end justify-between gap-2">
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 600, color: NAVY, lineHeight: 1 }}>{value}</span>
      <div className="w-20 flex-shrink-0 pb-1">
        <SparklineChart data={sparkData} color={sparkColor || NAVY_LIGHT} />
      </div>
    </div>
    {sub && <span className="text-[11px] text-[#6B7280]">{sub}</span>}
  </div>
);

const ToggleSwitch = ({ on, onChange, size = 'md' }) => {
  const dims = size === 'sm'
    ? { track: 'h-4 w-7', thumb: 'h-3 w-3', on: 'translate-x-3', off: 'translate-x-0.5' }
    : { track: 'h-5 w-9', thumb: 'h-4 w-4', on: 'translate-x-4', off: 'translate-x-0.5' };
  return (
    <button onClick={onChange} className={cn('relative inline-flex items-center rounded-full transition-colors cursor-pointer flex-shrink-0', dims.track, on ? 'bg-[#1B8A4C]' : 'bg-[#D1D5DB]')} role="switch" aria-checked={on}>
      <span className={cn('absolute top-0.5 bg-white rounded-full shadow-sm transition-transform duration-300', dims.thumb, on ? dims.on : dims.off)} />
    </button>
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    'Active': 'bg-[#DCFCE7] text-[#1B8A4C]', 'Running': 'bg-[#DCFCE7] text-[#1B8A4C]',
    'Pass': 'bg-[#DCFCE7] text-[#1B8A4C]', 'Connected': 'bg-[#DCFCE7] text-[#1B8A4C]',
    'Operational': 'bg-[#DCFCE7] text-[#1B8A4C]', 'Completed': 'bg-[#DCFCE7] text-[#1B8A4C]',
    'Paused': 'bg-[#F3F4F6] text-[#6B7280]', 'Fail': 'bg-[#FEE2E2] text-[#C62828]',
    'Escalation': 'bg-[#FEE2E2] text-[#C62828]', 'Flagged': 'bg-[#FEE2E2] text-[#C62828]',
    'Human Override': 'bg-[#FEF3C7] text-[#D97706]', 'Overridden': 'bg-[#FEF3C7] text-[#D97706]',
    'Autonomous': 'bg-[#EEF2F9] text-[#0A1F44]', 'System Event': 'bg-[#F3F4F6] text-[#6B7280]',
    'Pending Review': 'bg-[#FEF3C7] text-[#D97706]', 'Partial': 'bg-[#FEF3C7] text-[#D97706]',
    'In Progress': 'bg-[#EFF6FF] text-[#1565C0]',
  };
  return <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap', styles[status] || 'bg-[#F3F4F6] text-[#6B7280]')}>{status}</span>;
};

const ConfirmModal = ({ title, body, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onCancel}>
    <div className="bg-white rounded-xl border border-[#E2E6EA] p-6 w-[400px] max-w-[90vw] shadow-xl" style={{ animation: 'modalIn .2s ease' }} onClick={e => e.stopPropagation()}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} color={AMBER} />
        </div>
        <div>
          <div className="font-semibold text-[#0A1F44] text-sm mb-1">{title}</div>
          <div className="text-[#6B7280] text-sm">{body}</div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-[#E2E6EA] text-sm font-medium text-[#374151] hover:bg-[#F7F8FA] transition-colors">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-[#0A1F44] text-white text-sm font-medium hover:bg-[#0d2a5e] transition-colors">Confirm</button>
      </div>
    </div>
  </div>
);

const SectionHeader = ({ title, sub, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-base font-semibold text-[#0A1F44]">{title}</h2>
      {sub && <p className="text-[12px] text-[#6B7280] mt-0.5">{sub}</p>}
    </div>
    {action}
  </div>
);

const TabBar = ({ tabs, active, onChange }) => (
  <div className="flex border-b border-[#E2E6EA]">
    {tabs.map(t => (
      <button key={t} onClick={() => onChange(t)} className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px', active === t ? 'border-[#0A1F44] text-[#0A1F44]' : 'border-transparent text-[#6B7280] hover:text-[#374151]')}>
        {t}
      </button>
    ))}
  </div>
);

// ── SIDEBAR ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'command-center', label: 'Command Center',       icon: Home      },
  { id: 'ade-roster',     label: 'ADE Roster',           icon: Bot       },
  { id: 'analytics',      label: 'Analytics & Reporting', icon: BarChart2 },
  { id: 'integrations',   label: 'Integrations',         icon: Link2     },
  { id: 'activity-log',   label: 'Activity Log',         icon: Bell      },
  { id: 'settings',       label: 'Settings & Permissions', icon: Settings },
];

const Sidebar = ({ page, onNav }) => (
  <div className="fixed left-0 top-[56px] bottom-0 w-[240px] bg-[#F0F2F5] border-r border-[#E2E6EA] flex flex-col z-40">
    <div className="py-4 flex-1 overflow-y-auto">
      <div className="px-6 mb-2">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#9CA3AF]">Navigation</span>
      </div>
      {NAV.map(item => {
        const Icon = item.icon;
        const active = page === item.id || (item.id === 'ade-roster' && page === 'ade-detail');
        return (
          <button key={item.id} onClick={() => onNav(item.id)}
            className={cn('w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all relative', active ? 'text-[#0A1F44] bg-[#EEF2F9]' : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#E8EBF0]')}>
            {active && <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#0A1F44] rounded-r" />}
            <Icon size={16} className={active ? 'text-[#0A1F44]' : 'text-[#9CA3AF]'} />
            {item.label}
          </button>
        );
      })}
    </div>
    <div className="p-4 border-t border-[#E2E6EA]">
      <div className="text-[10px] text-[#9CA3AF] font-mono">
        <div>Platform v2.4.1</div>
        <div>© 2026 Neuralogic Group</div>
      </div>
    </div>
  </div>
);

// ── TOP NAV ──────────────────────────────────────────────────────────────────

const TopNav = ({ notifCount }) => (
  <div className="fixed top-0 left-0 right-0 h-[56px] bg-white border-b border-[#E2E6EA] flex items-center justify-between px-5 z-50" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
    <div className="flex items-center gap-0 w-[240px]">
      <div>
        <svg width="160" height="32" viewBox="0 0 160 32">
          <text x="0" y="18" fontFamily="'DM Sans', sans-serif" fontWeight="700" fontSize="17" fill="#0A1F44" letterSpacing="-0.2">ROHRMAN</text>
          <text x="1" y="27" fontFamily="'DM Sans', sans-serif" fontWeight="500" fontSize="7" fill="#6B7280" letterSpacing="2">AUTOMOTIVE GROUP</text>
        </svg>
        <div className="flex items-center gap-1 -mt-1 ml-[1px]">
          <span className="text-[9px] text-[#9CA3AF]">Powered by</span>
          <span className="text-[9px] font-semibold text-[#6B7280]">Neuralogic</span>
        </div>
      </div>
    </div>
    <div className="flex-1" />
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1B8A4C] pulse-dot" />
        <span className="text-[11px] font-semibold text-[#1B8A4C]">Platform Health: Operational</span>
      </div>
      <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F8FA] transition-colors">
        <Bell size={16} color={GRAY} />
        {notifCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C62828] rounded-full text-white text-[9px] font-bold flex items-center justify-center">{notifCount}</span>}
      </button>
      <div className="w-8 h-8 rounded-full bg-[#0A1F44] flex items-center justify-center">
        <span className="text-white text-[11px] font-bold">JR</span>
      </div>
    </div>
  </div>
);

// ── COMMAND CENTER ───────────────────────────────────────────────────────────

const ADECard = ({ ade, running, onToggle, onDrillDown }) => {
  const [showModal, setShowModal] = useState(false);
  const [feed, setFeed] = useState(FEEDS[ade.id] || FEEDS.nova);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const src = FEEDS[ade.id] || FEEDS.nova;
      const line = src[Math.floor(Math.random() * src.length)];
      setFeed(prev => [{ ...line, t: new Date().toLocaleTimeString('en-US', { hour12: false }) }, ...prev].slice(0, 4));
    }, 4500 + Math.random() * 2000);
    return () => clearInterval(iv);
  }, [running, ade.id]);

  return (
    <>
      <div className="bg-white rounded-lg border border-[#E2E6EA] p-4 flex flex-col gap-3" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{ade.icon}</span>
            <div>
              <div className="font-bold text-[13px] text-[#0A1F44]">{ade.name}</div>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ color: ade.color, background: ade.color + '18', border: `1px solid ${ade.color}30` }}>
                {ade.role.split(' ').slice(0, 3).join(' ')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#6B7280]">{running ? 'Running' : 'Paused'}</span>
            <ToggleSwitch on={running} onChange={() => running ? setShowModal(true) : onToggle(ade.id)} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
          <Layers size={11} />
          <span>Assigned to <span className="font-semibold text-[#374151]">{ade.stores} stores</span></span>
        </div>
        <div className="bg-[#F7F8FA] rounded-md p-2 min-h-[72px]">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={cn('w-1.5 h-1.5 rounded-full', running ? 'bg-[#1B8A4C] pulse-dot' : 'bg-[#D1D5DB]')} />
            <span className="text-[9px] uppercase tracking-widest text-[#9CA3AF] font-semibold">Live Activity</span>
          </div>
          {feed.slice(0, 3).map((line, i) => (
            <div key={i} className="flex gap-2 text-[11px] font-mono py-0.5">
              <span className="text-[#9CA3AF] flex-shrink-0">{line.t}</span>
              <span className="text-[#374151] truncate">{line.msg}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-[#F0F2F5] pt-2">
          <div className="flex gap-4">
            {[['Tasks', ade.tasks.toLocaleString()], ['Avg Score', ade.score], ['Escalations', ade.escalations]].map(([lbl, val]) => (
              <div key={lbl} className="text-center">
                <div className="font-semibold text-[12px]" style={{ color: lbl === 'Escalations' && ade.escalations > 0 ? RED : NAVY }}>{val}</div>
                <div className="text-[9px] uppercase text-[#9CA3AF]">{lbl}</div>
              </div>
            ))}
          </div>
          <button onClick={() => onDrillDown(ade.id)} className="flex items-center gap-1 text-[11px] font-semibold text-[#1565C0] hover:text-[#0A1F44] transition-colors">
            Drill Down <ChevronRight size={12} />
          </button>
        </div>
      </div>
      {showModal && (
        <ConfirmModal
          title={`Pause ${ade.name}?`}
          body={`Active tasks will be suspended. ${ade.name} will stop processing new requests until manually resumed.`}
          onConfirm={() => { onToggle(ade.id); setShowModal(false); }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};

const CommandCenter = ({ adeStates, onToggle, onDrillDown }) => (
  <div className="space-y-6">
    <div>
      <SectionHeader title="Platform Overview" sub="Live operational metrics — all active ADEs" />
      <div className="flex gap-3">
        <KPICard label="ADEs Active Now" value="6 / 8" sparkData={SPARKLINES.active} sparkColor={GREEN} sub={<><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1B8A4C] pulse-dot mr-1" />All primary roles running</>} />
        <KPICard label="Tasks Completed Today" value="1,247" sparkData={SPARKLINES.tasks} sparkColor={NAVY_LIGHT} sub="↑ 8.4% vs. yesterday" />
        <KPICard label="Avg Response Time" value="1.3s" sparkData={SPARKLINES.response} sparkColor={AMBER} sub="SLA target: <2.0s ✓" />
        <KPICard label="Human Hours Saved (MTD)" value="3,840 hrs" sparkData={SPARKLINES.hours} sparkColor={GREEN} sub="Equivalent to 24 FTEs" />
        <KPICard label="Est. Cost Savings (MTD)" value="$127,400" sparkData={SPARKLINES.savings} sparkColor={NAVY} sub="vs. $118,200 last month" />
      </div>
    </div>
    <div>
      <SectionHeader title="ADE Live Operations" sub="Real-time status for all deployed Autonomous Digital Employees"
        action={<div className="flex items-center gap-2"><span className="text-[11px] text-[#6B7280]">Auto-refresh</span><ToggleSwitch on={true} onChange={() => {}} size="sm" /></div>}
      />
      <div className="grid grid-cols-3 gap-4">
        {ADE_DEFS.map(ade => (
          <ADECard key={ade.id} ade={ade} running={adeStates[ade.id]} onToggle={onToggle} onDrillDown={onDrillDown} />
        ))}
      </div>
    </div>
  </div>
);

// ── ADE DETAIL — TABS ────────────────────────────────────────────────────────

const OverviewTab = () => {
  const donut = [{ name: 'Pass', value: 142 }, { name: 'Fail', value: 28 }, { name: 'In Progress', value: 12 }, { name: 'Abandoned', value: 5 }];
  const DC = [GREEN, RED, NAVY_LIGHT, GRAY];
  return (
    <div className="space-y-5 pt-4">
      <div className="flex gap-3">
        {[['Sessions Today', '187'], ['Avg. Score', '91.2'], ['Pass Rate', '83.5%'], ['Escalations', '1']].map(([l, v]) => (
          <div key={l} className="bg-white border border-[#E2E6EA] rounded-lg p-4 flex-1" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="text-[10px] uppercase tracking-widest text-[#6B7280] font-semibold">{l}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, color: NAVY, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-[#E2E6EA] rounded-lg p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="text-sm font-semibold text-[#0A1F44] mb-3">F&I Spar Scores — Last 14 Days</div>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={sparScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: GRAY }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: GRAY }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <ReferenceLine y={88} stroke={AMBER} strokeDasharray="4 4" />
              <Bar dataKey="score" fill={NAVY_LIGHT} opacity={0.75} radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="avg" stroke={AMBER} dot={false} strokeDasharray="4 4" strokeWidth={1.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-[#E2E6EA] rounded-lg p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="text-sm font-semibold text-[#0A1F44] mb-2">Session Outcomes</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={donut} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value">
                {donut.map((_, i) => <Cell key={i} fill={DC[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
            {donut.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                <span className="w-2 h-2 rounded-full" style={{ background: DC[i] }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border border-[#E2E6EA] rounded-lg p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="text-sm font-semibold text-[#0A1F44] mb-3">Top Performing Agents by Store</div>
        <div className="overflow-x-auto rounded-lg border border-[#E2E6EA]">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-[#F7F8FA] border-b border-[#E2E6EA]">
              {['Name', 'Store', 'Sessions', 'Avg Score', 'Last Active'].map(h => <th key={h} className="text-left px-3 py-2 text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">{h}</th>)}
            </tr></thead>
            <tbody>
              {[['Tyler M.', 'Chevrolet Lafayette', 24, 94, '09:41'], ['Rachel S.', 'Buick GMC', 19, 92, '09:38'], ['James W.', 'Subaru Lafayette', 17, 91, '08:55'], ['Amanda K.', 'Toyota Lafayette', 21, 89, '09:22'], ['Derek P.', 'Kia Lafayette', 15, 87, '09:10']].map((r, i) => (
                <tr key={i} className="border-b border-[#F0F2F5] last:border-0 hover:bg-[#F7F8FA]">
                  {r.map((c, j) => <td key={j} className="px-3 py-2.5 text-[#374151] text-xs font-mono">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LiveSessionsTab = () => {
  const [selected, setSelected] = useState(null);
  const dims = [
    { label: 'Language Compliance', val: 96 },
    { label: 'Product Knowledge', val: 88 },
    { label: 'Objection Handling', val: 84 },
    { label: 'Tone & Professionalism', val: 92 },
    { label: 'Accuracy', val: 90 },
  ];
  return (
    <div className="pt-4 flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-[#0A1F44]">
          <span className="w-2 h-2 rounded-full bg-[#1B8A4C] pulse-dot" />
          Live Sessions ({FELIX_LIVE.length} active)
        </div>
        <div className="overflow-x-auto rounded-lg border border-[#E2E6EA]">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-[#F7F8FA] border-b border-[#E2E6EA]">
              {['Agent', 'Store', 'Topic', 'Duration', 'Score', 'Status', ''].map(h => <th key={h} className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">{h}</th>)}
            </tr></thead>
            <tbody>
              {FELIX_LIVE.map((row, i) => (
                <tr key={i} className="border-b border-[#F0F2F5] last:border-0">
                  <td className="px-3 py-2.5 font-medium text-sm text-[#374151]">{row.agent}</td>
                  <td className="px-3 py-2.5 text-xs text-[#6B7280]">{row.store}</td>
                  <td className="px-3 py-2.5 text-xs text-[#374151]">{row.topic}</td>
                  <td className="px-3 py-2.5 font-mono text-[12px] text-[#6B7280]">{row.duration}</td>
                  <td className="px-3 py-2.5 font-semibold text-sm" style={{ color: row.score >= 90 ? GREEN : row.score >= 80 ? AMBER : RED }}>{row.score}</td>
                  <td className="px-3 py-2.5"><StatusPill status={row.status} /></td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => setSelected(row)} className="flex items-center gap-1 text-[11px] font-semibold text-[#1565C0] hover:text-[#0A1F44]">View Live <ExternalLink size={10} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <div className="w-[300px] flex-shrink-0 bg-white border border-[#E2E6EA] rounded-lg p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-[#0A1F44]">{selected.agent} — Live</div>
            <button onClick={() => setSelected(null)}><X size={14} color={GRAY} /></button>
          </div>
          <div className="space-y-2 text-xs mb-4 bg-[#F7F8FA] rounded-md p-3 font-mono max-h-[160px] overflow-y-auto">
            <div><span className="text-[#9CA3AF]">09:40:01</span> <span className="font-bold text-[#0A1F44]">[FELIX]</span> <span className="text-[#374151]"> Good morning! Let's run a GAP insurance presentation. Customer: "I don't really need GAP, do I?"</span></div>
            <div><span className="text-[#9CA3AF]">09:40:14</span> <span className="font-bold text-[#6B7280]">[{selected.agent}]</span> <span className="text-[#374151]"> GAP — Guaranteed Asset Protection — covers the difference between what you owe and what insurance pays if totaled...</span></div>
            <div><span className="text-[#9CA3AF]">09:40:31</span> <span className="font-bold text-[#0A1F44]">[FELIX]</span> <span className="text-[#374151]"> Good. Now: "That sounds expensive. What does it cost?"</span></div>
            <div><span className="text-[#9CA3AF]">09:40:44</span> <span className="font-bold text-[#6B7280]">[{selected.agent}]</span> <span className="text-[#374151]"> About $3–4 per month rolled into your payment — less than a daily coffee...</span></div>
          </div>
          <div className="space-y-2">
            {dims.map(d => (
              <div key={d.label}>
                <div className="flex justify-between text-[10px] text-[#6B7280] mb-0.5"><span>{d.label}</span><span className="font-semibold text-[#374151]">{d.val}</span></div>
                <div className="h-1.5 bg-[#E2E6EA] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.val}%`, background: d.val >= 90 ? GREEN : d.val >= 80 ? AMBER : RED, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SparLogsTab = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const filtered = FELIX_SESSIONS.filter(s =>
    (filter === 'All' || s.status === filter) &&
    (s.agent.toLowerCase().includes(search.toLowerCase()) || s.topic.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="pt-4 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agent, topic..." className="w-full pl-8 pr-3 py-2 border border-[#E2E6EA] rounded-lg text-sm focus:outline-none focus:border-[#0A1F44]" />
        </div>
        {['All', 'Pass', 'Fail'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-2 rounded-lg text-sm font-medium border', filter === f ? 'bg-[#0A1F44] text-white border-[#0A1F44]' : 'border-[#E2E6EA] text-[#6B7280] hover:bg-[#F7F8FA]')}>{f}</button>
        ))}
        <button className="ml-auto px-3 py-2 rounded-lg border border-[#E2E6EA] text-sm text-[#6B7280] flex items-center gap-1.5 hover:bg-[#F7F8FA]"><Download size={13} /> Export</button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#E2E6EA]">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-[#F7F8FA] border-b border-[#E2E6EA]">
            {['Agent', 'Store', 'Topic', 'Date', 'Duration', 'Score', 'Status'].map(h => <th key={h} className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-[#F0F2F5] last:border-0 hover:bg-[#F7F8FA] cursor-pointer">
                <td className="px-3 py-2.5 font-medium text-[#374151]">{s.agent}</td>
                <td className="px-3 py-2.5 text-xs text-[#6B7280]">{s.store.replace('Rohrman ', '').split(' – ')[0]}</td>
                <td className="px-3 py-2.5 text-xs text-[#374151]">{s.topic}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-[#6B7280]">{s.date}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] text-[#6B7280]">{s.duration}</td>
                <td className="px-3 py-2.5 font-semibold text-sm" style={{ color: s.score >= 90 ? GREEN : s.score >= 80 ? AMBER : RED }}>{s.score}/100</td>
                <td className="px-3 py-2.5"><StatusPill status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComplianceTab = () => {
  const [rules, setRules] = useState([
    { id: 1, text: 'Never use the word "warranty" — use "extended service contract"', active: true, sev: 'high' },
    { id: 2, text: 'Price F&I products between $800–$2,400 per product', active: true, sev: 'high' },
    { id: 3, text: 'Always present Good / Better / Best menu options', active: true, sev: 'medium' },
    { id: 4, text: 'Avoid high-pressure closing language', active: true, sev: 'high' },
    { id: 5, text: 'Always disclose APR before discussing monthly payment', active: true, sev: 'high' },
    { id: 6, text: 'Never bundle products without individual disclosure', active: true, sev: 'medium' },
    { id: 7, text: 'Use CFPB-compliant language for credit insurance products', active: false, sev: 'low' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState('');
  const addRule = () => { if (newRule.trim()) { setRules(p => [...p, { id: Date.now(), text: newRule, active: true, sev: 'medium' }]); setNewRule(''); setShowAdd(false); } };
  return (
    <div className="pt-4 space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 bg-[#0A1F44] text-white rounded-lg text-sm font-medium hover:bg-[#0d2a5e]">
          <Plus size={14} /> Add Rule
        </button>
      </div>
      {showAdd && (
        <div className="bg-[#F7F8FA] border border-[#E2E6EA] rounded-lg p-3 flex gap-2">
          <input value={newRule} onChange={e => setNewRule(e.target.value)} placeholder="Enter compliance rule..." className="flex-1 px-3 py-2 border border-[#E2E6EA] rounded-lg text-sm focus:outline-none focus:border-[#0A1F44]" />
          <button onClick={addRule} className="px-3 py-2 bg-[#1B8A4C] text-white rounded-lg text-sm font-medium">Add</button>
          <button onClick={() => setShowAdd(false)} className="px-3 py-2 border border-[#E2E6EA] rounded-lg text-sm text-[#6B7280]">Cancel</button>
        </div>
      )}
      <div className="space-y-2">
        {rules.map(r => (
          <div key={r.id} className="bg-white border border-[#E2E6EA] rounded-lg p-3.5 flex items-center gap-3" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', r.active ? 'bg-[#1B8A4C]' : 'bg-[#D1D5DB]')} />
            <span className={cn('flex-1 text-sm', r.active ? 'text-[#374151]' : 'text-[#9CA3AF] line-through')}>{r.text}</span>
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0', r.sev === 'high' ? 'bg-[#FEE2E2] text-[#C62828]' : r.sev === 'medium' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#F3F4F6] text-[#6B7280]')}>
              {r.sev}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ToggleSwitch on={r.active} onChange={() => setRules(p => p.map(x => x.id === r.id ? { ...x, active: !x.active } : x))} size="sm" />
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F7F8FA]"><Edit2 size={12} color={GRAY} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConfigTab = () => {
  const [sel, setSel] = useState(new Set([0, 1, 2, 3, 4, 5, 6, 7]));
  const [threshold, setThreshold] = useState(75);
  const [spanish, setSpanish] = useState(true);
  const [notif, setNotif] = useState(true);
  return (
    <div className="pt-4 space-y-4 max-w-2xl">
      <div className="bg-white border border-[#E2E6EA] rounded-lg p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="text-sm font-semibold text-[#0A1F44] mb-3">Active Store Assignments ({sel.size}/20)</div>
        <div className="grid grid-cols-2 gap-1">
          {STORES.map((s, i) => (
            <label key={i} className="flex items-center gap-2 py-1 cursor-pointer">
              <input type="checkbox" checked={sel.has(i)} onChange={() => setSel(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })} className="rounded" />
              <span className="text-xs text-[#374151]">{s}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="bg-white border border-[#E2E6EA] rounded-lg p-4 space-y-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="text-sm font-semibold text-[#0A1F44]">Session Settings</div>
        <div className="flex items-center justify-between">
          <div><div className="text-sm text-[#374151]">Escalation Threshold</div><div className="text-xs text-[#6B7280]">Sessions below this score will escalate to a manager</div></div>
          <div className="flex items-center gap-3">
            <input type="range" min="60" max="90" value={threshold} onChange={e => setThreshold(+e.target.value)} className="w-24" />
            <span className="font-semibold text-sm w-12 text-[#0A1F44]">{threshold}/100</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div><div className="text-sm text-[#374151]">Spanish Language Mode</div><div className="text-xs text-[#6B7280]">FELIX responds in Spanish when detected</div></div>
          <ToggleSwitch on={spanish} onChange={() => setSpanish(p => !p)} />
        </div>
        <div className="flex items-center justify-between">
          <div><div className="text-sm text-[#374151]">Weekly Performance Reports</div><div className="text-xs text-[#6B7280]">Send digest to assigned supervisors every Monday</div></div>
          <ToggleSwitch on={notif} onChange={() => setNotif(p => !p)} />
        </div>
      </div>
    </div>
  );
};

const ScoreTab = () => (
  <div className="pt-4">
    <div className="bg-white border border-[#E2E6EA] rounded-lg p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div className="text-sm font-semibold text-[#0A1F44] mb-3">Score Distribution — All Sessions (April 2026)</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={Array.from({ length: 13 }, (_, i) => ({ range: `${62 + i * 3}–${64 + i * 3}`, count: Math.round(3 + Math.random() * 28) }))}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
          <XAxis dataKey="range" tick={{ fontSize: 10, fill: GRAY }} />
          <YAxis tick={{ fontSize: 10, fill: GRAY }} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <ReferenceLine x="86–88" stroke={RED} strokeDasharray="3 3" label={{ value: 'Pass threshold', fontSize: 9, fill: RED }} />
          <Bar dataKey="count" fill={NAVY_LIGHT} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ADEDetail = ({ adeId, onBack }) => {
  const [tab, setTab] = useState('Overview');
  const [status, setStatus] = useState('Running');
  const ade = ADE_DEFS.find(a => a.id === adeId) || ADE_DEFS[1];
  const TABS = ['Overview', 'Live Sessions', 'Spar Logs', 'Scoring', 'Compliance Rules', 'Configuration'];
  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] mb-3">
          <button onClick={onBack} className="hover:text-[#0A1F44]">Command Center</button>
          <ChevronRight size={12} /><span>ADE Roster</span>
          <ChevronRight size={12} /><span className="text-[#0A1F44] font-medium">{ade.name}</span>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ade.icon}</span>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600, color: NAVY, lineHeight: 1 }}>{ade.name}</h1>
              <p className="text-sm text-[#6B7280] mt-1">{ade.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-[11px] text-[#9CA3AF] font-mono">
              <div>Last updated: 09:42:17</div>
              <div>Version 2.1.4</div>
            </div>
            <div className="flex gap-1">
              {['Running', 'Paused', 'Stopped'].map(s => (
                <button key={s} onClick={() => setStatus(s)} className={cn('px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors', status === s ? 'bg-[#0A1F44] text-white border-[#0A1F44]' : 'border-[#E2E6EA] text-[#6B7280] hover:bg-[#F7F8FA]')}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'Overview' && <OverviewTab />}
      {tab === 'Live Sessions' && <LiveSessionsTab />}
      {tab === 'Spar Logs' && <SparLogsTab />}
      {tab === 'Scoring' && <ScoreTab />}
      {tab === 'Compliance Rules' && <ComplianceTab />}
      {tab === 'Configuration' && <ConfigTab />}
    </div>
  );
};

// ── ATLAS ────────────────────────────────────────────────────────────────────

const AtlasPage = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pinned, setPinned] = useState(null);
  const endRef = useRef(null);

  const runQuery = useCallback((q) => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setMessages(p => [...p, { role: 'user', text: q }]);
    setQuery('');
    setTimeout(() => {
      const resp = ATLAS_RESPONSES[q] || {
        summary: `ATLAS analyzed your query across 2.54M Snowflake records. Structured result for: "${q.slice(0, 50)}..."`,
        table: {
          headers: ['Store', 'Value', 'vs. Prior', 'Trend'],
          rows: STORES.slice(0, 6).map(s => [s.split(' – ')[0], `$${(12000 + Math.round(Math.random() * 8000)).toLocaleString()}`, `+${(Math.random() * 15).toFixed(1)}%`, '↑']),
        },
        chartData: STORES.slice(0, 6).map(s => ({ name: s.split(' – ')[0].replace('Rohrman ', ''), value: 12000 + Math.round(Math.random() * 8000) })),
        meta: { source: 'Snowflake', records: '2.54M', time: (0.3 + Math.random() * 0.7).toFixed(1) + 's' },
      };
      setMessages(p => [...p, { role: 'atlas', ...resp, query: q }]);
      setPinned(resp);
      setLoading(false);
    }, 1400);
  }, [loading]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: NAVY }}>ATLAS</h1>
          <p className="text-sm text-[#6B7280]">Snowflake Data Lake Query & Intelligence Agent</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1B8A4C] pulse-dot" />
          <span className="text-[11px] font-semibold text-[#1B8A4C]">Snowflake: Connected — 2.54M records</span>
        </div>
      </div>
      <div className="flex gap-5" style={{ height: 'calc(100vh - 210px)', minHeight: 500 }}>
        {/* Chat panel */}
        <div className="w-[40%] flex flex-col bg-white border border-[#E2E6EA] rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="px-4 py-3 border-b border-[#E2E6EA] bg-[#F7F8FA]">
            <div className="text-sm font-semibold text-[#0A1F44]">Query Interface</div>
            <div className="text-xs text-[#6B7280]">Ask anything about Rohrman Group performance</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌐</div>
                <div className="text-sm font-medium text-[#374151]">ATLAS is ready</div>
                <div className="text-xs text-[#6B7280] mt-1">Select a query below or type your own</div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}>
                {msg.role === 'user'
                  ? <div className="bg-[#0A1F44] text-white text-sm px-3 py-2 rounded-xl rounded-tr-sm max-w-[85%]">{msg.text}</div>
                  : (
                    <div className="w-full space-y-2">
                      <div className="bg-[#F7F8FA] border border-[#E2E6EA] rounded-xl rounded-tl-sm p-3 text-sm text-[#374151]">{msg.summary}</div>
                      {msg.table && (
                        <div className="overflow-x-auto rounded-lg border border-[#E2E6EA] text-[11px]">
                          <table className="w-full border-collapse">
                            <thead><tr className="bg-[#F7F8FA] border-b border-[#E2E6EA]">
                              {msg.table.headers.map(h => <th key={h} className="text-left px-2 py-1.5 text-[10px] uppercase font-semibold text-[#6B7280]">{h}</th>)}
                            </tr></thead>
                            <tbody>
                              {msg.table.rows.map((row, j) => (
                                <tr key={j} className="border-b border-[#F0F2F5] last:border-0">
                                  {row.map((c, k) => <td key={k} className="px-2 py-1.5 font-mono text-[10px] text-[#374151]">{c}</td>)}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {msg.meta && (
                        <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF]">
                          <Database size={10} /><span>Source: {msg.meta.source}</span><span>·</span>
                          <span>{msg.meta.records} records</span><span>·</span><span>{msg.meta.time}</span>
                          <button onClick={() => setPinned(msg)} className="ml-auto flex items-center gap-0.5 text-[#1565C0] hover:text-[#0A1F44]"><Pin size={10} /> Pin</button>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <div className="flex gap-1">{[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 bg-[#0A1F44] rounded-full pulse-dot" style={{ animationDelay: `${i * 200}ms` }} />)}</div>
                ATLAS is querying Snowflake...
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {ATLAS_QUERIES.slice(0, 4).map(q => (
              <button key={q} onClick={() => runQuery(q)} className="px-2 py-1 rounded-full border border-[#E2E6EA] text-[10px] text-[#6B7280] hover:border-[#0A1F44] hover:text-[#0A1F44] transition-colors text-left">{q}</button>
            ))}
          </div>
          <div className="p-3 border-t border-[#E2E6EA]">
            <div className="flex gap-2">
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && runQuery(query)} placeholder="Ask ATLAS anything about your group's performance..." className="flex-1 px-3 py-2 border border-[#E2E6EA] rounded-lg text-sm focus:outline-none focus:border-[#0A1F44] placeholder:text-[#9CA3AF]" />
              <button onClick={() => runQuery(query)} className="w-9 h-9 bg-[#0A1F44] text-white rounded-lg flex items-center justify-center hover:bg-[#0d2a5e] flex-shrink-0">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
        {/* Canvas panel */}
        <div className="flex-1 flex flex-col bg-white border border-[#E2E6EA] rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="px-4 py-3 border-b border-[#E2E6EA] bg-[#F7F8FA] flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#0A1F44]">Analytics Canvas</div>
              <div className="text-xs text-[#6B7280]">{pinned ? 'Pinned query result' : 'Run a query to populate this panel'}</div>
            </div>
            {pinned && (
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E6EA] rounded-lg text-xs text-[#6B7280] hover:bg-[#F7F8FA]"><Download size={11} /> CSV</button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E6EA] rounded-lg text-xs text-[#6B7280] hover:bg-[#F7F8FA]"><FileText size={11} /> PDF</button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1F44] text-white rounded-lg text-xs font-medium"><Pin size={11} /> Pin to Dashboard</button>
              </div>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {pinned ? (
              <div className="space-y-4">
                <div className="text-sm text-[#374151]">{pinned.summary}</div>
                {pinned.table && (
                  <div className="overflow-x-auto rounded-lg border border-[#E2E6EA]">
                    <table className="w-full text-sm border-collapse">
                      <thead><tr className="bg-[#F7F8FA] border-b border-[#E2E6EA]">
                        {pinned.table.headers.map(h => <th key={h} className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {pinned.table.rows.map((row, i) => (
                          <tr key={i} className="border-b border-[#F0F2F5] last:border-0 hover:bg-[#F7F8FA]">
                            {row.map((c, j) => <td key={j} className="px-3 py-2.5 font-mono text-xs text-[#374151]">{c}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {pinned.chartData && (
                  <div className="bg-white border border-[#E2E6EA] rounded-lg p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div className="text-xs font-semibold text-[#0A1F44] mb-3">Visual Summary</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={pinned.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: GRAY }} />
                        <YAxis tick={{ fontSize: 10, fill: GRAY }} tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} />
                        <Tooltip contentStyle={{ fontSize: 11 }} formatter={v => [`$${v.toLocaleString()}`, 'Value']} />
                        <Bar dataKey="value" fill={NAVY} radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {pinned.meta && (
                  <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF] font-mono">
                    <Database size={11} />
                    <span>Source: {pinned.meta.source} · {pinned.meta.records} records · Query time: {pinned.meta.time}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-[#9CA3AF]">
                <div><Database size={40} className="mx-auto mb-3 opacity-20" /><div className="text-sm">Run a query to visualize results here</div></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ANALYTICS ────────────────────────────────────────────────────────────────

const ADE_COLORS = { NOVA: NAVY_LIGHT, FELIX: NAVY, ARIA: GREEN, SCOUT: AMBER, MERCH: '#7C3AED' };

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('MTD');
  const [storeFilter, setStoreFilter] = useState('All Stores');
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-3 bg-white border border-[#E2E6EA] rounded-lg" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-1.5 text-sm text-[#6B7280] font-medium"><Calendar size={14} /> Date Range:</div>
        {['Today', 'This Week', 'MTD', 'Custom'].map(d => (
          <button key={d} onClick={() => setDateRange(d)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors', dateRange === d ? 'bg-[#0A1F44] text-white border-[#0A1F44]' : 'border-[#E2E6EA] text-[#6B7280] hover:bg-[#F7F8FA]')}>{d}</button>
        ))}
        <div className="w-px h-5 bg-[#E2E6EA] mx-1" />
        <select value={storeFilter} onChange={e => setStoreFilter(e.target.value)} className="px-3 py-1.5 border border-[#E2E6EA] rounded-lg text-sm text-[#374151] focus:outline-none focus:border-[#0A1F44]">
          <option>All Stores</option>
          {STORES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-white border border-[#E2E6EA] rounded-lg p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <SectionHeader title="Platform-Wide Performance" sub="Tasks completed per ADE per day"
          action={<button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E6EA] rounded-lg text-xs text-[#6B7280] hover:bg-[#F7F8FA]"><Download size={12} /> Export</button>}
        />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyTasks}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: GRAY }} />
            <YAxis tick={{ fontSize: 10, fill: GRAY }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {Object.entries(ADE_COLORS).map(([name, color]) => (
              <Line key={name} type="monotone" dataKey={name} stroke={color} strokeWidth={1.5} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-[#E2E6EA] rounded-lg p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <SectionHeader title="Human Hours Displaced" sub="Weekly hours saved by ADE role" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={humanHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: GRAY }} />
              <YAxis tick={{ fontSize: 10, fill: GRAY }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {Object.entries(ADE_COLORS).map(([n, c]) => <Bar key={n} dataKey={n} stackId="a" fill={c} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-[#E2E6EA] rounded-lg p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <SectionHeader title="MTD Cost Savings by ADE" sub="Total: $127,400 (April 2026)" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={costSavingsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
              <XAxis type="number" tick={{ fontSize: 10, fill: GRAY }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: GRAY }} width={50} />
              <Tooltip contentStyle={{ fontSize: 11 }} formatter={v => [`$${v.toLocaleString()}`, 'Savings']} />
              <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                {costSavingsData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-[#E2E6EA] rounded-lg p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <SectionHeader title="Lead Response Time — NOVA" sub="Distribution of first contact times (SLA: <90s)" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={leadResponseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" />
              <XAxis dataKey="range" tick={{ fontSize: 9, fill: GRAY }} />
              <YAxis tick={{ fontSize: 10, fill: GRAY }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="count" fill={NAVY_LIGHT} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-[#E2E6EA] rounded-lg p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <SectionHeader title="ADE Uptime & Reliability" sub="Availability % — last 30 days" />
          <div className="space-y-3 mt-2">
            {uptimeData.map(d => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="w-12 text-xs font-semibold text-[#374151]">{d.name}</span>
                <div className="flex-1 h-2 bg-[#E2E6EA] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.uptime}%`, background: d.uptime >= 99.5 ? GREEN : d.uptime >= 99 ? AMBER : RED, transition: 'width 0.4s' }} />
                </div>
                <span className="font-mono text-xs text-[#374151] w-16 text-right">{d.uptime.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ACTIVITY LOG ─────────────────────────────────────────────────────────────

const ActivityLogPage = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [log, setLog] = useState(ACTIVITY_LOG);

  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(() => {
      const src = ACTIVITY_LOG[Math.floor(Math.random() * ACTIVITY_LOG.length)];
      setLog(p => [{ ...src, id: Date.now(), ts: new Date().toLocaleTimeString('en-US', { hour12: false }) }, ...p].slice(0, 50));
    }, 5500);
    return () => clearInterval(iv);
  }, [autoRefresh]);

  const filtered = log.filter(e =>
    (typeFilter === 'All' || e.type === typeFilter) &&
    (e.ade + e.action + e.detail + e.store).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader title="Activity Log" sub="Real-time event stream across all ADEs and stores" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#6B7280]">Auto-refresh</span>
          <ToggleSwitch on={autoRefresh} onChange={() => setAutoRefresh(p => !p)} size="sm" />
          {autoRefresh && <span className="w-1.5 h-1.5 rounded-full bg-[#1B8A4C] pulse-dot" />}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="pl-8 pr-3 py-2 border border-[#E2E6EA] rounded-lg text-sm focus:outline-none focus:border-[#0A1F44] w-56" />
        </div>
        {['All', 'Autonomous', 'Human Override', 'Escalation', 'System Event'].map(f => (
          <button key={f} onClick={() => setTypeFilter(f)} className={cn('px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors', typeFilter === f ? 'bg-[#0A1F44] text-white border-[#0A1F44]' : 'border-[#E2E6EA] text-[#6B7280] hover:bg-[#F7F8FA]')}>{f}</button>
        ))}
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E6EA] rounded-lg text-xs text-[#6B7280] hover:bg-[#F7F8FA]"><Download size={12} /> Export</button>
      </div>
      <div className="bg-white border border-[#E2E6EA] rounded-lg overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-[#F7F8FA] border-b border-[#E2E6EA]">
            {['Timestamp', 'ADE', 'Store', 'Action Type', 'Details', 'Outcome'].map(h => <th key={h} className="text-left px-3 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(e => (
              <React.Fragment key={e.id}>
                <tr onClick={() => setExpanded(x => x === e.id ? null : e.id)} className="border-b border-[#F0F2F5] cursor-pointer hover:bg-[#F7F8FA] transition-colors">
                  <td className="px-3 py-2.5 font-mono text-[11px] text-[#6B7280]">{e.ts}</td>
                  <td className="px-3 py-2.5 font-semibold text-[12px] text-[#0A1F44]">{e.ade}</td>
                  <td className="px-3 py-2.5 text-xs text-[#6B7280]">{e.store}</td>
                  <td className="px-3 py-2.5"><StatusPill status={e.type} /></td>
                  <td className="px-3 py-2.5 text-xs text-[#374151] max-w-[280px] truncate">{e.detail}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#374151]">{e.outcome}</span>
                      {expanded === e.id ? <ChevronUp size={13} color={GRAY} /> : <ChevronDown size={13} color={GRAY} />}
                    </div>
                  </td>
                </tr>
                {expanded === e.id && (
                  <tr className="bg-[#F7F8FA] border-b border-[#E2E6EA]">
                    <td colSpan={6} className="px-6 py-3">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div><div className="text-[10px] uppercase font-semibold text-[#9CA3AF] mb-1">ADE Role</div><div className="text-[#374151]">{ADE_DEFS.find(a => a.name === e.ade)?.role || e.ade}</div></div>
                        <div><div className="text-[10px] uppercase font-semibold text-[#9CA3AF] mb-1">Full Detail</div><div className="text-[#374151]">{e.detail}</div></div>
                        <div><div className="text-[10px] uppercase font-semibold text-[#9CA3AF] mb-1">Outcome</div><div className="text-[#374151]">{e.outcome}</div></div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── INTEGRATIONS ─────────────────────────────────────────────────────────────

const IntegrationsPage = () => {
  const intgs = [
    { name: 'Snowflake', icon: '❄️', status: 'Connected', detail: '2,541,889 records', sub: 'Last sync: 2 min ago', note: 'Warehouse: rohrman_prod | us-east-2' },
    { name: 'CDK Global', icon: '🚗', status: 'Connected', detail: '20/20 stores syncing', sub: 'Last sync: 4 min ago', note: 'CDK Drive 8.2 | All stores active' },
    { name: 'VinSolutions CRM', icon: '📋', status: 'Connected', detail: '847 active leads', sub: 'Last sync: 1 min ago', note: 'Lead pipeline flowing | Real-time' },
    { name: 'Reynolds & Reynolds', icon: '🔄', status: 'Partial', detail: '17/20 stores active', sub: '3 stores pending auth', note: 'Pending: BMW, Cadillac, Lexus Lafayette' },
    { name: 'AWS (Neuralogic Cloud)', icon: '☁️', status: 'Operational', detail: 'Uptime: 99.97%', sub: 'Region: us-east-2', note: 'All ADE workloads healthy' },
    { name: 'Google Analytics 4', icon: '📊', status: 'Connected', detail: '20 property views', sub: 'Last sync: 6 min ago', note: 'Tracking VDP, lead, and appt events' },
  ];
  return (
    <div className="space-y-4">
      <SectionHeader title="Integrations" sub="Connected data sources and platform services" />
      <div className="grid grid-cols-2 gap-4">
        {intgs.map(i => (
          <div key={i.name} className="bg-white border border-[#E2E6EA] rounded-lg p-5 flex gap-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="text-3xl">{i.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-[#0A1F44]">{i.name}</span>
                <StatusPill status={i.status} />
              </div>
              <div className="text-sm text-[#374151]">{i.detail}</div>
              <div className="text-xs text-[#6B7280] mt-0.5">{i.sub}</div>
              <div className="text-[11px] text-[#9CA3AF] font-mono mt-1">{i.note}</div>
            </div>
            <button className="flex-shrink-0 px-3 py-1.5 border border-[#E2E6EA] rounded-lg text-xs font-medium text-[#374151] hover:bg-[#F7F8FA] h-fit">Manage</button>
          </div>
        ))}
      </div>
      <div className="bg-[#F7F8FA] border border-[#E2E6EA] rounded-lg p-4 flex items-center gap-3">
        <Info size={14} color={NAVY_LIGHT} className="flex-shrink-0" />
        <span className="text-xs text-[#6B7280]">All integrations managed by Neuralogic Group. To add a data source or report an auth issue, contact your Neuralogic account manager.</span>
      </div>
    </div>
  );
};

// ── SETTINGS ─────────────────────────────────────────────────────────────────

const SettingRow = ({ label, desc, defaultOn }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#F0F2F5] last:border-0">
      <div><div className="text-sm text-[#374151]">{label}</div>{desc && <div className="text-xs text-[#9CA3AF]">{desc}</div>}</div>
      <ToggleSwitch on={on} onChange={() => setOn(p => !p)} size="sm" />
    </div>
  );
};

const SettingsPage = () => (
  <div className="space-y-5 max-w-2xl">
    <SectionHeader title="Settings & Permissions" sub="Platform configuration and access control" />
    {[
      { group: 'Notifications', rows: [
        { label: 'Daily ADE performance digest (email)', desc: 'Sent to group administrators every morning at 7am', on: true },
        { label: 'Slack alerts: escalations only', desc: 'Posts to #ade-alerts channel', on: true },
        { label: 'SMS: critical system events', desc: 'For P0/P1 incidents only', on: false },
        { label: 'Weekly GM performance reports', desc: 'Store-level summaries sent every Monday', on: true },
      ]},
      { group: 'Security', rows: [
        { label: 'Require MFA for all admin actions', desc: 'TOTP or hardware key required', on: true },
        { label: 'Session timeout: 4 hours', desc: 'Auto-logout after inactivity', on: true },
        { label: 'Audit log retention: 365 days', on: true },
      ]},
      { group: 'ADE Platform Defaults', rows: [
        { label: 'Auto-resume ADEs after scheduled maintenance', on: true },
        { label: 'Spanish language mode group-wide', on: true },
        { label: 'Escalation notifications to store GMs', on: true },
      ]},
    ].map(section => (
      <div key={section.group} className="bg-white border border-[#E2E6EA] rounded-lg p-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="text-sm font-semibold text-[#0A1F44] mb-2">{section.group}</div>
        {section.rows.map(r => <SettingRow key={r.label} label={r.label} desc={r.desc} defaultOn={r.on} />)}
      </div>
    ))}
  </div>
);

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState('command-center');
  const [selectedADE, setSelectedADE] = useState(null);
  const [adeStates, setAdeStates] = useState(Object.fromEntries(ADE_DEFS.map(a => [a.id, true])));

  const handleToggle = useCallback(id => setAdeStates(p => ({ ...p, [id]: !p[id] })), []);
  const handleDrillDown = useCallback(id => { setSelectedADE(id); setPage('ade-detail'); }, []);
  const handleNav = useCallback(p => { setPage(p); if (p !== 'ade-detail') setSelectedADE(null); }, []);

  const notifCount = Object.values(adeStates).filter(v => !v).length + 2;

  const renderPage = () => {
    switch (page) {
      case 'command-center': return <CommandCenter adeStates={adeStates} onToggle={handleToggle} onDrillDown={handleDrillDown} />;
      case 'ade-detail':
        return selectedADE === 'atlas'
          ? <AtlasPage />
          : <ADEDetail adeId={selectedADE || 'felix'} onBack={() => handleNav('command-center')} />;
      case 'ade-roster': return <CommandCenter adeStates={adeStates} onToggle={handleToggle} onDrillDown={handleDrillDown} />;
      case 'analytics': return <AnalyticsPage />;
      case 'integrations': return <IntegrationsPage />;
      case 'activity-log': return <ActivityLogPage />;
      case 'settings': return <SettingsPage />;
      default: return <CommandCenter adeStates={adeStates} onToggle={handleToggle} onDrillDown={handleDrillDown} />;
    }
  };

  return (
    <div style={{ height: '100vh', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <TopNav notifCount={notifCount} />
      <div style={{ display: 'flex', flex: 1, paddingTop: 56, overflow: 'hidden' }}>
        <Sidebar page={page} onNav={handleNav} />
        <main style={{ marginLeft: 240, flex: 1, overflowY: 'auto', background: '#F7F8FA' }}>
          <div style={{ padding: 24, maxWidth: 1400 }}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
