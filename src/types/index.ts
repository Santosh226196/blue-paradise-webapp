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
  Monthly: "MONTHLY",
  Quarterly: "QUARTERLY",
  Yearly: "YEARLY",
} as const;
export type MembershipType = (typeof MembershipType)[keyof typeof MembershipType];

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
  membershipType: MembershipType;
  startDate: string;
  endDate: string;
  amount: number;
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
  duration: "MONTHLY" | "QUARTERLY" | "YEARLY";
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
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
