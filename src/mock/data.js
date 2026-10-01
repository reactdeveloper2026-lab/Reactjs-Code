/** Centralized mock data used across the admin panel. */

const firstNames = ["Aarav", "Vivaan", "Aditya", "Ishaan", "Krishna", "Diya", "Meera", "Ananya", "Riya", "Kavya", "Arjun", "Rohan", "Nisha", "Priya", "Sana", "Zara", "Kabir", "Neel", "Om", "Yash"];
const lastNames = ["Sharma", "Verma", "Iyer", "Kapoor", "Menon", "Nair", "Patel", "Rao", "Gupta", "Reddy", "Khan", "Singh", "Joshi", "Malhotra", "Bose"];

function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

// Seeded pseudo-random so lists stay stable across renders
let seed = 42;
function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function rpick(a) { return a[Math.floor(rand() * a.length)]; }

function makeName() { return `${rpick(firstNames)} ${rpick(lastNames)}`; }

function dateOffset(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

/* ============ APP USERS ============ */
export const appUsers = Array.from({ length: 48 }).map((_, i) => {
  const name = makeName();
  const first = name.split(" ")[0].toLowerCase();
  const statuses = ["Active", "Active", "Active", "Blocked", "Inactive"];
  const subs = ["Free", "Basic", "Pro", "Enterprise"];
  return {
    id: `usr_${String(1000 + i)}`,
    name,
    email: `${first}${i}@example.com`,
    status: rpick(statuses),
    subscription: rpick(subs),
    createdAt: dateOffset(Math.floor(rand() * 400)),
    lastActive: dateOffset(Math.floor(rand() * 30)),
    country: rpick(["India", "USA", "UK", "Germany", "UAE", "Canada"]),
    scenariosCompleted: Math.floor(rand() * 120),
    device: rpick(["iOS", "Android", "Web"]),
  };
});

/* ============ ADMIN USERS ============ */
export const adminUsers = Array.from({ length: 12 }).map((_, i) => {
  const name = makeName();
  const first = name.split(" ")[0].toLowerCase();
  return {
    id: `adm_${String(100 + i)}`,
    name,
    email: `${first}.${i}@nova.com`,
    role: rpick(["Super Admin", "Admin", "Support Admin", "Custom Role"]),
    status: rpick(["Active", "Active", "Active", "Blocked"]),
    createdAt: dateOffset(Math.floor(rand() * 300)),
    lastLogin: dateOffset(Math.floor(rand() * 15)),
    department: rpick(["Operations", "Support", "Product", "Engineering"]),
  };
});

/* ============ CATEGORIES ============ */
export const categories = [
  { id: "cat_1", name: "Communication", description: "Interpersonal communication scenarios", status: "Active", questions: 24, createdAt: dateOffset(120), updatedAt: dateOffset(3) },
  { id: "cat_2", name: "Leadership", description: "Leadership and management growth", status: "Active", questions: 18, createdAt: dateOffset(90), updatedAt: dateOffset(6) },
  { id: "cat_3", name: "Conflict Resolution", description: "Resolving personal & team conflicts", status: "Active", questions: 15, createdAt: dateOffset(60), updatedAt: dateOffset(1) },
  { id: "cat_4", name: "Emotional Intelligence", description: "Self-awareness and empathy training", status: "Inactive", questions: 9, createdAt: dateOffset(45), updatedAt: dateOffset(14) },
  { id: "cat_5", name: "Public Speaking", description: "Presentation and speaking exercises", status: "Active", questions: 12, createdAt: dateOffset(30), updatedAt: dateOffset(2) },
  { id: "cat_6", name: "Career Growth", description: "Long-term career planning scenarios", status: "Active", questions: 20, createdAt: dateOffset(15), updatedAt: dateOffset(0) },
];

/* ============ GENERATION MESSAGES ============ */
export const generationMessages = [
  { id: "gm_1", categoryId: "cat_1", order: 1, text: "Hi {{userName}}, let's start with the {{categoryName}} scenario today.", enabled: true },
  { id: "gm_2", categoryId: "cat_1", order: 2, text: "Think carefully before responding — this is about {{scenarioName}}.", enabled: true },
  { id: "gm_3", categoryId: "cat_1", order: 3, text: "Reflection time! It's {{date}} — how would you approach this?", enabled: false },
  { id: "gm_4", categoryId: "cat_1", order: 4, text: "Take your time, {{userName}}. Quality over speed.", enabled: true },
];

export const placeholders = [
  { key: "{{userName}}", description: "Full name of the current app user" },
  { key: "{{categoryName}}", description: "Name of the selected category" },
  { key: "{{scenarioName}}", description: "Currently active scenario title" },
  { key: "{{date}}", description: "Current date, formatted per user timezone" },
  { key: "{{time}}", description: "Current time in user's timezone" },
  { key: "{{subscriptionPlan}}", description: "User's active subscription tier" },
];

/* ============ REFLECTION QUESTION ============ */
export const reflectionQuestion = {
  id: "rq_3",
  label: "Reflection Question 3",
  text: "What is one key insight you gained from this scenario, and how will you apply it going forward?",
  enabled: true,
  updatedAt: dateOffset(4),
};

/* ============ RETENTION ============ */
export const retentionConfig = { days: 90 };

/* ============ AUDIT LOG ============ */
const modules = ["User Management", "Category", "Subscription", "Payment", "Auth", "Role", "Settings"];
const activities = ["LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "BLOCK", "UNBLOCK", "EXPORT"];
export const auditLogs = Array.from({ length: 60 }).map((_, i) => ({
  id: `log_${1000 + i}`,
  timestamp: dateOffset(Math.floor(rand() * 30)),
  user: makeName(),
  role: rpick(["Super Admin", "Admin", "Support Admin"]),
  activity: rpick(activities),
  module: rpick(modules),
  ip: `${Math.floor(rand()*255)}.${Math.floor(rand()*255)}.${Math.floor(rand()*255)}.${Math.floor(rand()*255)}`,
  device: rpick(["Chrome / Windows", "Safari / macOS", "Firefox / Linux", "Edge / Windows"]),
  status: rpick(["Success", "Success", "Success", "Failed"]),
  details: "The action was performed on the target resource. Metadata is available in the details view.",
}));

/* ============ ROLES ============ */
export const roles = [
  { id: "role_1", name: "Super Admin", description: "Full system access", permissionCount: 32, users: 2, status: "Active" },
  { id: "role_2", name: "Admin", description: "Manages users, categories & subscriptions", permissionCount: 22, users: 5, status: "Active" },
  { id: "role_3", name: "Support Admin", description: "Read-only + user support tools", permissionCount: 10, users: 8, status: "Active" },
  { id: "role_4", name: "Content Manager", description: "Manages categories and messages", permissionCount: 12, users: 3, status: "Inactive" },
];

/* ============ SUBSCRIPTION PLANS ============ */
export const subscriptionPlans = [
  { id: "plan_free", name: "Free", description: "Get started with limited scenarios", monthly: 0, yearly: 0, trialDays: 0, features: ["3 scenarios / month", "Basic reflection", "Community support"], status: "Active", activeUsers: 1240 },
  { id: "plan_basic", name: "Basic", description: "For casual learners", monthly: 4.99, yearly: 49, trialDays: 7, features: ["25 scenarios / month", "Standard reflection", "Email support"], status: "Active", activeUsers: 820 },
  { id: "plan_pro", name: "Pro", description: "Unlock full potential", monthly: 12.99, yearly: 129, trialDays: 14, features: ["Unlimited scenarios", "Advanced reflection", "Priority support", "Analytics"], status: "Active", activeUsers: 412 },
  { id: "plan_ent", name: "Enterprise", description: "For teams & organizations", monthly: 49, yearly: 490, trialDays: 30, features: ["Unlimited seats", "Team analytics", "Dedicated CSM", "SSO"], status: "Inactive", activeUsers: 24 },
];

/* ============ TRANSACTIONS ============ */
export const transactions = Array.from({ length: 32 }).map((_, i) => ({
  id: `txn_${100000 + i}`,
  user: makeName(),
  email: `user${i}@example.com`,
  plan: rpick(["Basic", "Pro", "Enterprise"]),
  amount: rpick([4.99, 12.99, 49, 129, 490]),
  currency: "USD",
  status: rpick(["Successful", "Successful", "Successful", "Pending", "Failed", "Refunded"]),
  gateway: "Pending Setup",
  date: dateOffset(Math.floor(rand() * 60)),
}));

/* ============ NOTIFICATIONS ============ */
export const emailNotifications = [
  { id: "en_1", name: "Welcome Email", subject: "Welcome to Nova, {{userName}}!", body: "Hi {{userName}}, thanks for signing up. Your journey begins now.", enabled: true, updatedAt: dateOffset(4) },
  { id: "en_2", name: "OTP Verification", subject: "Your Nova OTP", body: "Your verification code is {{otp}}. It expires in 10 minutes.", enabled: true, updatedAt: dateOffset(1) },
  { id: "en_3", name: "Password Changed", subject: "Password Successfully Changed", body: "Hi {{userName}}, your password was recently updated.", enabled: true, updatedAt: dateOffset(10) },
  { id: "en_4", name: "Subscription Expiring", subject: "Your subscription expires soon", body: "Renew now to keep enjoying premium features.", enabled: false, updatedAt: dateOffset(30) },
];

export const inAppNotifications = [
  { id: "in_1", name: "New Scenario Available", title: "New scenario for you!", message: "A brand new {{categoryName}} scenario just landed.", type: "Info", enabled: true },
  { id: "in_2", name: "Weekly Streak", title: "You're on a 7-day streak 🔥", message: "Keep it up to unlock rewards.", type: "Success", enabled: true },
  { id: "in_3", name: "Account Blocked", title: "Account Blocked", message: "Contact support for more information.", type: "Warning", enabled: false },
];

/* ============ POLICY / OTP CONFIG ============ */
export const defaultPasswordPolicy = {
  minLength: 8,
  maxLength: 32,
  uppercase: true,
  lowercase: true,
  numbers: true,
  specialChars: true,
  expiryDays: 90,
  history: 5,
  initialPasswordAutoGenerate: true,
  firstLoginChange: true,
};

export const defaultOtpConfig = {
  expirySeconds: 600,
  resendSeconds: 30,
  maxAttempts: 3,
  emailFrom: "no-reply@nova.com",
  emailSubject: "Your OTP for Nova Admin",
};

/* ============ DASHBOARD METRICS ============ */
export const dashboardMetrics = {
  totalAppUsers: appUsers.length + 12518,
  totalAdminUsers: adminUsers.length,
  activeUsers: 9420,
  blockedUsers: 214,
  activeSubscriptions: 1268,
  monthlyRevenue: 24380,
  categories: categories.length,
};

/* ============ TIMEZONES ============ */
export const timezones = [
  "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo",
  "Europe/London", "Europe/Berlin", "Europe/Paris",
  "America/New_York", "America/Chicago", "America/Los_Angeles",
  "Australia/Sydney", "UTC",
];
