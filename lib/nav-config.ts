import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Upload,
  Image as ImageIcon,
  Rows3,
  Building2,
  Landmark,
  CreditCard,
  ListTree,
  PencilRuler,
  Receipt,
  HandCoins,
  Wallet,
  FileOutput,
  FileStack,
  ClipboardList,
  Search,
  PieChart,
  Calculator,
  Scale,
  FileText,
  BarChart3,
  AlertTriangle,
  ListChecks,
  Banknote,
  MessageSquareText,
  Coins,
  History,
  Briefcase,
  DollarSign,
  FileSpreadsheet,
  BookText,
  ArrowLeftRight,
  ClipboardCheck,
  NotebookText,
  ShieldCheck,
} from "lucide-react";

export type Role = "super_admin" | "finance" | "registrar" | "head_teacher" | "payroll";

export const ROLES: { id: Role; label: string; blurb: string }[] = [
  { id: "super_admin", label: "Super Admin", blurb: "Full access to every module" },
  { id: "finance", label: "Finance / Bursar", blurb: "Transactions, Fees Admin, Reports, Recon" },
  { id: "registrar", label: "Registrar", blurb: "Registration module only" },
  { id: "head_teacher", label: "Head Teacher", blurb: "Read-only Reports & IPSAS" },
  { id: "payroll", label: "Payroll Officer", blurb: "PayRoll module only" },
];

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  badge?: string;
};

export type NavModule = {
  id: string;
  label: string;
  number: string;
  icon: LucideIcon;
  roles: Role[];
  items: NavItem[];
};

const ALL: Role[] = ["super_admin", "finance", "registrar", "head_teacher", "payroll"];

export const NAV: NavModule[] = [
  {
    id: "overview",
    label: "Overview",
    number: "00",
    icon: LayoutDashboard,
    roles: ALL,
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ALL },
    ],
  },
  {
    id: "registration",
    label: "Registration",
    number: "01",
    icon: UserPlus,
    roles: ["super_admin", "registrar"],
    items: [
      { label: "Student Registration", href: "/registration/students/new", icon: UserPlus, roles: ["super_admin", "registrar"] },
      { label: "View / Edit Students", href: "/registration/students", icon: Users, roles: ["super_admin", "registrar"] },
      { label: "Bulk Excel Upload", href: "/registration/bulk-upload", icon: Upload, roles: ["super_admin", "registrar"] },
      { label: "Student Photos", href: "/registration/photos", icon: ImageIcon, roles: ["super_admin", "registrar"] },
      { label: "Bulk Student Edit", href: "/registration/bulk-edit", icon: Rows3, roles: ["super_admin", "registrar"] },
      { label: "Streams Registration", href: "/registration/streams", icon: ListTree, roles: ["super_admin", "registrar"] },
      { label: "School Details", href: "/registration/school-details", icon: Building2, roles: ["super_admin", "registrar"] },
      { label: "Fees Structure", href: "/registration/fees-structure", icon: PencilRuler, roles: ["super_admin", "registrar"] },
      { label: "Bank Accounts", href: "/registration/bank-accounts", icon: Landmark, roles: ["super_admin", "registrar"] },
      { label: "Payment Types", href: "/registration/payment-types", icon: CreditCard, roles: ["super_admin", "registrar"] },
      { label: "Vote Heads Registration", href: "/registration/vote-heads", icon: ListTree, roles: ["super_admin", "registrar"] },
    ],
  },
  {
    id: "transactions",
    label: "Transactions",
    number: "02",
    icon: Receipt,
    roles: ["super_admin", "finance"],
    items: [
      { label: "Fees Payment", href: "/transactions/fees-payment", icon: Receipt, roles: ["super_admin", "finance"] },
      { label: "Bursary RCT", href: "/transactions/bursary", icon: HandCoins, roles: ["super_admin", "finance"] },
      { label: "Other Income", href: "/transactions/other-income", icon: Wallet, roles: ["super_admin", "finance"] },
      { label: "Payment Voucher", href: "/transactions/payment-voucher", icon: FileOutput, roles: ["super_admin", "finance"] },
      { label: "Register Invoice", href: "/transactions/invoices", icon: FileStack, roles: ["super_admin", "finance"] },
      { label: "Set Commitment", href: "/transactions/commitments", icon: ClipboardList, roles: ["super_admin", "finance"] },
      { label: "Search Student", href: "/transactions/search-student", icon: Search, roles: ["super_admin", "finance", "registrar"] },
      { label: "Votes Assignment", href: "/transactions/votes-assignment", icon: PieChart, roles: ["super_admin", "finance"] },
    ],
  },
  {
    id: "fees-admin",
    label: "Fees Admin",
    number: "03",
    icon: Calculator,
    roles: ["super_admin", "finance"],
    items: [
      { label: "Fee Structure Builder", href: "/fees-admin/structure-builder", icon: PencilRuler, roles: ["super_admin", "finance"] },
      { label: "Student Balances", href: "/fees-admin/balances", icon: Scale, roles: ["super_admin", "finance"] },
      { label: "Fee Statements", href: "/fees-admin/statements", icon: FileText, roles: ["super_admin", "finance"] },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    number: "04",
    icon: BarChart3,
    roles: ["super_admin", "finance", "head_teacher"],
    items: [
      { label: "Collection Reports", href: "/reports/collections", icon: BarChart3, roles: ["super_admin", "finance", "head_teacher"] },
      { label: "Defaulters List", href: "/reports/defaulters", icon: AlertTriangle, roles: ["super_admin", "finance", "head_teacher"] },
      { label: "Vote Head Summary", href: "/reports/vote-head-summary", icon: ListChecks, roles: ["super_admin", "finance", "head_teacher"] },
    ],
  },
  {
    id: "recon",
    label: "Recon. Statements",
    number: "05",
    icon: ArrowLeftRight,
    roles: ["super_admin", "finance"],
    items: [
      { label: "Bank Reconciliation", href: "/recon", icon: Banknote, roles: ["super_admin", "finance"] },
    ],
  },
  {
    id: "messages",
    label: "Message",
    number: "06",
    icon: MessageSquareText,
    roles: ["super_admin", "finance"],
    items: [
      { label: "Bulk SMS", href: "/messages/bulk-sms", icon: MessageSquareText, roles: ["super_admin", "finance"] },
      { label: "SMS Units", href: "/messages/units", icon: Coins, roles: ["super_admin", "finance"] },
      { label: "Delivery Log", href: "/messages/delivery-log", icon: History, roles: ["super_admin", "finance"] },
    ],
  },
  {
    id: "payroll",
    label: "PayRoll",
    number: "07",
    icon: Briefcase,
    roles: ["super_admin", "payroll"],
    items: [
      { label: "Staff Records", href: "/payroll/staff", icon: Users, roles: ["super_admin", "payroll"] },
      { label: "Salary Structure", href: "/payroll/salary-structure", icon: DollarSign, roles: ["super_admin", "payroll"] },
      { label: "Payslips", href: "/payroll/payslips", icon: FileSpreadsheet, roles: ["super_admin", "payroll"] },
    ],
  },
  {
    id: "ipsas",
    label: "IPSAS",
    number: "08",
    icon: BookText,
    roles: ["super_admin", "finance", "head_teacher"],
    items: [
      { label: "Receipts & Payments", href: "/ipsas/receipts-payments", icon: BookText, roles: ["super_admin", "finance", "head_teacher"] },
      { label: "Statement of Cash Flow", href: "/ipsas/cash-flow", icon: ArrowLeftRight, roles: ["super_admin", "finance", "head_teacher"] },
      { label: "Budget vs Actual", href: "/ipsas/budget-vs-actual", icon: ClipboardCheck, roles: ["super_admin", "finance", "head_teacher"] },
      { label: "Notes to Financials", href: "/ipsas/notes", icon: NotebookText, roles: ["super_admin", "finance", "head_teacher"] },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    number: "09",
    icon: ShieldCheck,
    roles: ["super_admin"],
    items: [
      { label: "Users & Roles", href: "/settings/users-roles", icon: ShieldCheck, roles: ["super_admin"] },
    ],
  },
];

export function navForRole(role: Role): NavModule[] {
  return NAV.filter((m) => m.roles.includes(role))
    .map((m) => ({ ...m, items: m.items.filter((i) => i.roles.includes(role)) }))
    .filter((m) => m.items.length > 0);
}
