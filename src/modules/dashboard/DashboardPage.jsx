import { Link } from "react-router-dom";
import {
  Users, UserCog, UserCheck, UserX, CreditCard, DollarSign,
  FolderTree, TrendingUp, ArrowUpRight, ArrowDownRight, Activity,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip as ReTooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardHeader, Badge, Table } from "../../components/ui/index.jsx";
import { dashboardMetrics, appUsers, auditLogs } from "../../mock/data.js";
import { formatCurrency, formatDate, formatNumber, initials } from "../../utils/format.js";

const stats = [
  { key: "totalAppUsers", label: "Total App Users", value: dashboardMetrics.totalAppUsers, icon: Users, delta: 8.4, up: true },
  { key: "totalAdminUsers", label: "Total Admin Users", value: dashboardMetrics.totalAdminUsers, icon: UserCog, delta: 2.1, up: true },
  { key: "activeUsers", label: "Active Users", value: dashboardMetrics.activeUsers, icon: UserCheck, delta: 12.3, up: true },
  { key: "blockedUsers", label: "Blocked Users", value: dashboardMetrics.blockedUsers, icon: UserX, delta: -1.6, up: false },
  { key: "subs", label: "Active Subscriptions", value: dashboardMetrics.activeSubscriptions, icon: CreditCard, delta: 5.2, up: true },
  { key: "revenue", label: "Monthly Revenue", value: dashboardMetrics.monthlyRevenue, currency: true, icon: DollarSign, delta: 14.7, up: true },
  { key: "categories", label: "Categories", value: dashboardMetrics.categories, icon: FolderTree, delta: 0, up: true },
];

const userGrowthData = [
  { day: "Day 1", users: 12 }, { day: "Day 2", users: 18 }, { day: "Day 3", users: 22 },
  { day: "Day 4", users: 15 }, { day: "Day 5", users: 28 }, { day: "Day 6", users: 34 },
  { day: "Day 7", users: 30 }, { day: "Day 8", users: 42 }, { day: "Day 9", users: 38 },
  { day: "Day 10", users: 48 }, { day: "Day 11", users: 55 }, { day: "Day 12", users: 60 },
  { day: "Day 13", users: 52 }, { day: "Day 14", users: 65 },
];

const revenueData = [
  { month: "Jan", revenue: 3200 }, { month: "Feb", revenue: 3400 },
  { month: "Mar", revenue: 4100 }, { month: "Apr", revenue: 3900 },
  { month: "May", revenue: 4600 }, { month: "Jun", revenue: 5100 },
  { month: "Jul", revenue: 5600 }, { month: "Aug", revenue: 6100 },
  { month: "Sep", revenue: 5800 }, { month: "Oct", revenue: 6400 },
  { month: "Nov", revenue: 7200 }, { month: "Dec", revenue: 7800 },
];

const subscriptionPieData = [
  { name: "Free", value: 1240 },
  { name: "Basic", value: 820 },
  { name: "Pro", value: 412 },
  { name: "Enterprise", value: 24 },
];

const PIE_COLORS = ["#94a3b8", "#60a5fa", "#2563eb", "#1e40af"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-md border shadow-sm px-3 py-2 text-xs"
      style={{ background: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
    >
      <div className="font-medium">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted">{p.name}:</span>
          <span className="font-medium">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const recentUsers = [...appUsers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentActivity = [...auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.key} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted font-medium">{s.label}</div>
                <div className="text-2xl font-bold text-main mt-2 tabular-nums">
                  {s.currency ? formatCurrency(s.value) : formatNumber(s.value)}
                </div>
                {s.delta !== 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: s.up ? "var(--color-success)" : "var(--color-danger)" }}>
                    {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(s.delta)}% vs last month
                  </div>
                )}
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}
              >
                <s.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="User Growth"
            subtitle="New sign-ups over the last 14 days"
            action={<Badge variant="success"><TrendingUp size={12} /> +18.2%</Badge>}
          />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={userGrowthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <ReTooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-primary-soft)" }} />
                <Bar dataKey="users" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Revenue Trend" subtitle="Last 12 months" />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <ReTooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Subscription split + Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Subscription Distribution" subtitle="Active users per plan" />
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={subscriptionPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {subscriptionPieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={30}
                  wrapperStyle={{ fontSize: "12px", color: "var(--color-text-muted)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padded={false} className="lg:col-span-2">
          <div className="p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-main">Recent Users</h3>
              <p className="text-xs text-muted mt-0.5">Latest app registrations</p>
            </div>
            <Link to="/users/app" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <Table
            columns={[
              {
                key: "name",
                header: "User",
                render: (u) => (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: "var(--color-primary)" }}>
                      {initials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-main truncate">{u.name}</div>
                      <div className="text-xs text-muted truncate">{u.email}</div>
                    </div>
                  </div>
                ),
              },
              { key: "subscription", header: "Plan", render: (u) => <Badge variant="muted">{u.subscription}</Badge> },
              {
                key: "status", header: "Status",
                render: (u) => (
                  <Badge variant={u.status === "Active" ? "success" : u.status === "Blocked" ? "danger" : "warning"}>
                    {u.status}
                  </Badge>
                ),
              },
            ]}
            rows={recentUsers}
          />
        </Card>
      </div>

      {/* Recent Activity full width */}
      <Card padded={false}>
        <div className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-main">Recent Activity</h3>
            <p className="text-xs text-muted mt-0.5">Latest audit log entries</p>
          </div>
          <Link to="/audit-log" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-app border-t border-app">
          {recentActivity.map((a) => (
            <div key={a.id} className="px-5 py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                <Activity size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-main">
                  <span className="font-medium">{a.user}</span>{" "}
                  <span className="text-muted">performed</span>{" "}
                  <span className="font-medium">{a.activity}</span>{" "}
                  <span className="text-muted">on</span>{" "}
                  <span>{a.module}</span>
                </div>
                <div className="text-xs text-muted mt-0.5">{formatDate(a.timestamp)} · {a.ip}</div>
              </div>
              <Badge variant={a.status === "Success" ? "success" : "danger"}>{a.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
