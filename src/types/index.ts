export const ServiceType = {
  Membership: "MEMBERSHIP",
  Coaching: "COACHING",
  HourlySwimming: "HOURLY_SWIMMING",
} as const;
export type ServiceType = (typeof ServiceType)[keyof typeof ServiceType];

export const PaymentMethod = {
  Cash: "CASH",
  UPI: "UPI",
  Card: "CARD",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const MembershipType = {
  Hourly: "HOURLY",
  Daily: "DAILY",
  Monthly: "MONTHLY",
  Quarterly: "QUARTERLY",
  Yearly: "YEARLY",
} as const;
export type MembershipType = (typeof MembershipType)[keyof typeof MembershipType];

export interface ExpiringMembership {
  customerId: string;
  customerName: string;
  customerMobile: string;
  membershipType: MembershipType;
  endDate: string;
  status: "EXPIRING_SOON" | "EXPIRED";
  daysLeft: number;
}

export const CoachingType = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
} as const;
export type CoachingType = (typeof CoachingType)[keyof typeof CoachingType];

export const Gender = {
  Male: "MALE",
  Female: "FEMALE",
  Other: "OTHER",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const VisitType = {
  WalkIn: "WALK_IN",
  Membership: "MEMBERSHIP",
  Coaching: "COACHING",
  Hourly: "HOURLY",
} as const;
export type VisitType = (typeof VisitType)[keyof typeof VisitType];

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  aadhaarNumber?: string;
  age?: number;
  gender?: Gender;
  address?: string;
  photoUrl?: string;
  idCardPhoto?: string;
  firstVisitAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  customerId: string;
  visitType: VisitType;
  visitedAt: string;
}

export interface Membership {
  id: string;
  customerId: string;
  planId?: string | null;
  planName?: string | null;
  planTotalSessions?: number | null;
  batchId?: string | null;
  batchName?: string | null;
  batchSchedule?: {
    days: string[];
    startTime: string;
    endTime: string;
    coach: string;
    level: string;
  } | null;
  membershipType: MembershipType;
  startDate: string;
  endDate: string;
  amount: number;
  totalSessions?: number | null;
  usedSessions?: number;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
}

export interface Coaching {
  id: string;
  customerId: string;
  coachingType: CoachingType;
  startDate: string;
  endDate: string;
  amount: number;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
}

export interface Transaction {
  id: string;
  billNumber: string;
  customerId: string;
  serviceType: ServiceType;
  serviceName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
  createdAt: string;
}

export interface ClubTiming {
  openTime: string;
  closeTime: string;
  daysOpen: string[];
  holidaysEnabled: boolean;
}

export interface BusinessSettings {
  businessName: string;
  logo?: string;
  printerSettings: {
    connected: boolean;
    model?: string;
  };
  billPrefix: string;
  billFooter: string;
  scannerImage?: string | null;
  clubTiming: ClubTiming;
}

export interface AuthState {
  user: { username: string } | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const SERVICE_NAMES: Record<ServiceType, string> = {
  [ServiceType.Membership]: "General Membership",
  [ServiceType.Coaching]: "Coaching",
  [ServiceType.HourlySwimming]: "Hourly Swimming",
};

export const SERVICE_AMOUNTS: Record<ServiceType, number> = {
  [ServiceType.Membership]: 1500,
  [ServiceType.Coaching]: 2000,
  [ServiceType.HourlySwimming]: 200,
};

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  duration: "HOURLY" | "DAILY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  price: number;
  totalSessions?: number | null;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export const BatchLevel = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
} as const;
export type BatchLevel = (typeof BatchLevel)[keyof typeof BatchLevel];

export const AgeGroup = {
  Kids: "KIDS",
  Teens: "TEENS",
  Adults: "ADULTS",
  All: "ALL",
} as const;
export type AgeGroup = (typeof AgeGroup)[keyof typeof AgeGroup];

export interface MembershipBatch {
  id: string;
  name: string;
  description: string;
  planId?: string | null;
  startDate: string;
  endDate: string;
  days: string[];
  startTime: string;
  endTime: string;
  level: BatchLevel;
  ageGroup: AgeGroup;
  coachId?: string | null;
  coach: string;
  maxMembers: number;
  currentMembers: number;
  status: "ACTIVE" | "UPCOMING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface BatchMember {
  assignmentId: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerPhoto?: string | null;
  membershipId: string;
  membershipType: MembershipType | null;
  membershipStatus: string | null;
  endDate: string | null;
  assignedAt: string;
}

export interface BatchMembersResponse {
  batch: { id: string; name: string; maxMembers: number };
  members: BatchMember[];
  availableSeats: number;
}

export interface ActiveBatchForCustomer {
  membershipId: string;
  batchId: string;
  batchName: string;
  days: string[];
  startTime: string;
  endTime: string;
  coach: string;
  level: string;
  planName: string;
  startDate: string;
  endDate: string;
  maxMembers: number;
}

export const StaffRole = {
  Coach: "COACH",
  Lifeguard: "LIFEGUARD",
  Receptionist: "RECEPTIONIST",
  Manager: "MANAGER",
} as const;
export type StaffRole = (typeof StaffRole)[keyof typeof StaffRole];

export interface Staff {
  id: string;
  name: string;
  mobile: string;
  role: StaffRole;
  specialization?: string;
  isAvailable: boolean;
  photoUrl?: string;
  joinedAt: string;
}

export interface AttendanceRecord {
  id: string;
  customerId: string;
  customerName: string;
  checkInTime: string;
  checkOutTime?: string;
  visitType: VisitType;
  lane?: number;
  photoUrl?: string;
}

export interface DuePayment {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "PENDING" | "OVERDUE" | "PAID";
  createdAt: string;
}

export const DayOfWeek = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
} as const;
export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export interface ScheduleSlot {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  type: "LANE" | "COACHING" | "OPEN_SWIM";
  label: string;
  lane?: number;
  coachId?: string;
  maxCapacity: number;
  currentBookings: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

// ── Auth API Types ──

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: { username: string };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  identity: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  demoOtp?: string;
  maskedDestination: string;
}

export interface VerifyOtpRequest {
  identity: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  resetToken: string;
}

export interface ResetPasswordRequest {
  identity: string;
  newPassword: string;
  resetToken?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// ── Billing API Types ──

export interface CreateTransactionPayload {
  customerId: string;
  serviceType: ServiceType;
  serviceName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  planId?: string;
  batchId?: string;
  startDate?: string;
}

// ── Reports API Types ──

export interface RevenueByPeriod {
  period: string;
  total: number;
  count: number;
  byCategory: Record<ServiceType, number>;
}

export interface ReportSummary {
  totalRevenue: number;
  totalTransactions: number;
  byCategory: Record<ServiceType, { total: number; count: number }>;
  dailyRevenue: RevenueByPeriod[];
}

// ── Printer Types ──

export interface PrinterService {
  getStatus(): Promise<{ connected: boolean; model?: string }>;
  testPrint(): Promise<boolean>;
  printReceipt(data: ReceiptData): Promise<boolean>;
}

export interface ReceiptData {
  settings: BusinessSettings;
  transaction: Transaction;
  customer: Customer;
}

// ── UI Types ──

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  loading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  animate?: boolean;
  style?: React.CSSProperties;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
}

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export interface SkeletonGlassProps {
  className?: string;
  lines?: number;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export interface StepperHeaderProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export interface ServiceCardProps {
  title: string;
  description: string;
  amount: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  title?: string;
  guideMode?: "avatar" | "document" | "general";
  initialFacingMode?: "user" | "environment";
}

export interface ReceiptCardProps {
  transaction: Transaction;
  customer: Customer;
  settings: BusinessSettings;
  onPrintComplete?: () => void;
  compact?: boolean;
}

export type ModalVariant = "success" | "error" | "warning" | "info" | "confirm";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  variant?: ModalVariant;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showActions?: boolean;
  children?: React.ReactNode;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

// ── Auth Component Types ──

export interface AuthLayoutProps {
  brandPanel: React.ReactNode;
  children: React.ReactNode;
}

export interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  error?: string;
}

export interface AuthPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// ── Layout Types ──

export interface NavItemData {
  to: string;
  iconOutline: React.ComponentType<{ size: number; className?: string }>;
  iconFilled: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  badge?: number;
}

export interface LogoProps {
  size?: number;
  className?: string;
}
