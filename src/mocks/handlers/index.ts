import { http, HttpResponse } from "msw";
import type { Customer, Visit, Membership, Coaching, Transaction, BusinessSettings, MembershipPlan, Staff, AttendanceRecord, DuePayment, ScheduleSlot, Announcement } from "@/types";
import { VisitType, ServiceType, PaymentMethod, MembershipType, CoachingType, Gender, StaffRole } from "@/types";

const now = new Date().toISOString();
const today = new Date().toISOString().split("T")[0];

export const mockCustomers: Customer[] = [
  { id: "c1", name: "Rahul Sharma", mobile: "9876543210", aadhaarNumber: "1234-5678-9012", age: 28, gender: Gender.Male, address: "12 Marine Drive, Mumbai", firstVisitAt: "2025-01-15T10:00:00Z", createdAt: "2025-01-15T10:00:00Z", updatedAt: now },
  { id: "c2", name: "Priya Patel", mobile: "9876543211", aadhaarNumber: "9876-5432-1098", age: 34, gender: Gender.Female, address: "45 Linking Road, Mumbai", firstVisitAt: "2025-03-20T14:00:00Z", createdAt: "2025-03-20T14:00:00Z", updatedAt: now },
  { id: "c3", name: "Amit Kumar", mobile: "9876543212", age: 22, address: "88 Andheri West, Mumbai", firstVisitAt: "2025-06-01T09:00:00Z", createdAt: "2025-06-01T09:00:00Z", updatedAt: now },
  { id: "c4", name: "Sneha Reddy", mobile: "9876543213", aadhaarNumber: "5678-1234-5678", age: 26, gender: Gender.Female, address: "23 Juhu Beach Road, Mumbai", firstVisitAt: "2025-04-10T07:30:00Z", createdAt: "2025-04-10T07:30:00Z", updatedAt: now },
  { id: "c5", name: "Vikram Joshi", mobile: "9876543214", age: 41, gender: Gender.Male, address: "7 Bandra Reclamation, Mumbai", firstVisitAt: "2025-02-28T16:00:00Z", createdAt: "2025-02-28T16:00:00Z", updatedAt: now },
  { id: "c6", name: "Ananya Desai", mobile: "9876543215", age: 19, gender: Gender.Female, address: "91 Powai Lake, Mumbai", firstVisitAt: "2025-07-05T08:00:00Z", createdAt: "2025-07-05T08:00:00Z", updatedAt: now },
  { id: "c7", name: "Rohan Mehta", mobile: "9876543216", aadhaarNumber: "3456-7890-1234", age: 31, gender: Gender.Male, address: "15 Dadar TT Circle, Mumbai", firstVisitAt: "2025-05-12T11:00:00Z", createdAt: "2025-05-12T11:00:00Z", updatedAt: now },
  { id: "c8", name: "Kavita Nair", mobile: "9876543217", age: 29, gender: Gender.Female, address: "33 Colaba Causeway, Mumbai", firstVisitAt: "2025-08-01T06:30:00Z", createdAt: "2025-08-01T06:30:00Z", updatedAt: now },
  { id: "c9", name: "Arjun Singh", mobile: "9876543218", age: 35, gender: Gender.Male, address: "56 Thane West, Mumbai", firstVisitAt: "2025-03-15T17:00:00Z", createdAt: "2025-03-15T17:00:00Z", updatedAt: now },
  { id: "c10", name: "Meera Iyer", mobile: "9876543219", aadhaarNumber: "7890-1234-5678", age: 24, gender: Gender.Female, address: "12 Borivali East, Mumbai", firstVisitAt: "2025-09-10T09:00:00Z", createdAt: "2025-09-10T09:00:00Z", updatedAt: now },
  { id: "c11", name: "Suresh Pillai", mobile: "9876543220", age: 45, gender: Gender.Male, address: "88 Malad West, Mumbai", firstVisitAt: "2025-01-05T05:30:00Z", createdAt: "2025-01-05T05:30:00Z", updatedAt: now },
  { id: "c12", name: "Nisha Gupta", mobile: "9876543221", age: 30, gender: Gender.Female, address: "42 Kandivali East, Mumbai", firstVisitAt: "2025-10-01T10:00:00Z", createdAt: "2025-10-01T10:00:00Z", updatedAt: now },
];

export const mockVisits: Visit[] = [
  { id: "v1", customerId: "c1", visitType: VisitType.Membership, visitedAt: `${today}T10:00:00Z` },
  { id: "v2", customerId: "c1", visitType: VisitType.Membership, visitedAt: `${today}T14:00:00Z` },
  { id: "v3", customerId: "c2", visitType: VisitType.Coaching, visitedAt: `${today}T11:00:00Z` },
  { id: "v4", customerId: "c4", visitType: VisitType.Membership, visitedAt: `${today}T07:30:00Z` },
  { id: "v5", customerId: "c5", visitType: VisitType.Hourly, visitedAt: `${today}T16:00:00Z` },
  { id: "v6", customerId: "c6", visitType: VisitType.Coaching, visitedAt: `${today}T08:00:00Z` },
  { id: "v7", customerId: "c7", visitType: VisitType.Membership, visitedAt: `${today}T11:30:00Z` },
  { id: "v8", customerId: "c8", visitType: VisitType.Membership, visitedAt: `${today}T06:30:00Z` },
  { id: "v9", customerId: "c9", visitType: VisitType.WalkIn, visitedAt: `${today}T17:00:00Z` },
  { id: "v10", customerId: "c11", visitType: VisitType.Membership, visitedAt: `${today}T05:45:00Z` },
];

export const mockMemberships: Membership[] = [
  { id: "m1", customerId: "c1", membershipType: MembershipType.Monthly, startDate: "2025-12-01T00:00:00Z", endDate: "2026-01-01T00:00:00Z", amount: 1500, status: "ACTIVE" },
  { id: "m2", customerId: "c4", membershipType: MembershipType.Quarterly, startDate: "2025-10-01T00:00:00Z", endDate: "2026-01-01T00:00:00Z", amount: 4000, status: "ACTIVE" },
  { id: "m3", customerId: "c5", membershipType: MembershipType.Monthly, startDate: "2025-11-01T00:00:00Z", endDate: "2025-12-01T00:00:00Z", amount: 1500, status: "EXPIRED" },
  { id: "m4", customerId: "c7", membershipType: MembershipType.Yearly, startDate: "2025-06-01T00:00:00Z", endDate: "2026-06-01T00:00:00Z", amount: 12000, status: "ACTIVE" },
  { id: "m5", customerId: "c8", membershipType: MembershipType.Monthly, startDate: "2025-12-15T00:00:00Z", endDate: "2026-01-15T00:00:00Z", amount: 1500, status: "ACTIVE" },
  { id: "m6", customerId: "c11", membershipType: MembershipType.Yearly, startDate: "2025-03-01T00:00:00Z", endDate: "2026-03-01T00:00:00Z", amount: 12000, status: "ACTIVE" },
  { id: "m7", customerId: "c12", membershipType: MembershipType.Monthly, startDate: "2025-12-01T00:00:00Z", endDate: "2026-01-01T00:00:00Z", amount: 1500, status: "ACTIVE" },
];

export const mockCoaching: Coaching[] = [
  { id: "co1", customerId: "c2", coachingType: CoachingType.Beginner, startDate: "2025-11-01T00:00:00Z", endDate: "2026-02-01T00:00:00Z", amount: 2000, status: "ACTIVE" },
  { id: "co2", customerId: "c6", coachingType: CoachingType.Intermediate, startDate: "2025-10-15T00:00:00Z", endDate: "2026-01-15T00:00:00Z", amount: 2500, status: "ACTIVE" },
  { id: "co3", customerId: "c3", coachingType: CoachingType.Advanced, startDate: "2025-09-01T00:00:00Z", endDate: "2025-12-01T00:00:00Z", amount: 3000, status: "EXPIRED" },
  { id: "co4", customerId: "c10", coachingType: CoachingType.Beginner, startDate: "2025-12-10T00:00:00Z", endDate: "2026-03-10T00:00:00Z", amount: 2000, status: "ACTIVE" },
];

let billSequence = 20;

export const mockTransactions: Transaction[] = [
  { id: "t1", billNumber: "BP000001", customerId: "c1", serviceType: ServiceType.Membership, serviceName: "General Membership", amount: 1500, paymentMethod: PaymentMethod.Cash, paidAt: `${today}T10:05:00Z`, createdAt: `${today}T10:05:00Z` },
  { id: "t2", billNumber: "BP000002", customerId: "c2", serviceType: ServiceType.Coaching, serviceName: "Coaching", amount: 2000, paymentMethod: PaymentMethod.UPI, paidAt: `${today}T11:05:00Z`, createdAt: `${today}T11:05:00Z` },
  { id: "t3", billNumber: "BP000003", customerId: "c4", serviceType: ServiceType.Membership, serviceName: "General Membership", amount: 4000, paymentMethod: PaymentMethod.Card, paidAt: `${today}T07:35:00Z`, createdAt: `${today}T07:35:00Z` },
  { id: "t4", billNumber: "BP000004", customerId: "c5", serviceType: ServiceType.HourlySwimming, serviceName: "Hourly Swimming", amount: 200, paymentMethod: PaymentMethod.Cash, paidAt: `${today}T16:05:00Z`, createdAt: `${today}T16:05:00Z` },
  { id: "t5", billNumber: "BP000005", customerId: "c6", serviceType: ServiceType.Coaching, serviceName: "Coaching", amount: 2500, paymentMethod: PaymentMethod.UPI, paidAt: `${today}T08:10:00Z`, createdAt: `${today}T08:10:00Z` },
  { id: "t6", billNumber: "BP000006", customerId: "c7", serviceType: ServiceType.Membership, serviceName: "General Membership", amount: 12000, paymentMethod: PaymentMethod.Card, paidAt: `${today}T11:35:00Z`, createdAt: `${today}T11:35:00Z` },
  { id: "t7", billNumber: "BP000007", customerId: "c8", serviceType: ServiceType.Membership, serviceName: "General Membership", amount: 1500, paymentMethod: PaymentMethod.Cash, paidAt: `${today}T06:35:00Z`, createdAt: `${today}T06:35:00Z` },
  { id: "t8", billNumber: "BP000008", customerId: "c9", serviceType: ServiceType.HourlySwimming, serviceName: "Hourly Swimming", amount: 400, paymentMethod: PaymentMethod.UPI, paidAt: `${today}T17:10:00Z`, createdAt: `${today}T17:10:00Z` },
  { id: "t9", billNumber: "BP000009", customerId: "c10", serviceType: ServiceType.Coaching, serviceName: "Coaching", amount: 2000, paymentMethod: PaymentMethod.Cash, paidAt: `${today}T09:15:00Z`, createdAt: `${today}T09:15:00Z` },
  { id: "t10", billNumber: "BP000010", customerId: "c11", serviceType: ServiceType.Membership, serviceName: "General Membership", amount: 12000, paymentMethod: PaymentMethod.Card, paidAt: `${today}T05:50:00Z`, createdAt: `${today}T05:50:00Z` },
  { id: "t11", billNumber: "BP000011", customerId: "c12", serviceType: ServiceType.Membership, serviceName: "General Membership", amount: 1500, paymentMethod: PaymentMethod.UPI, paidAt: `${today}T10:10:00Z`, createdAt: `${today}T10:10:00Z` },
  { id: "t12", billNumber: "BP000012", customerId: "c1", serviceType: ServiceType.HourlySwimming, serviceName: "Hourly Swimming", amount: 600, paymentMethod: PaymentMethod.Cash, paidAt: `${today}T14:15:00Z`, createdAt: `${today}T14:15:00Z` },
];

export const mockSettings: BusinessSettings = {
  businessName: "Blue Paradise Water Club",
  printerSettings: { connected: true, model: "Epson TM-T20III" },
  billPrefix: "BP",
  billFooter: "Thank you for visiting Blue Paradise!",
  clubTiming: {
    openTime: "05:00",
    closeTime: "22:00",
    daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    holidaysEnabled: false,
  },
};

let mockMembershipPlans: MembershipPlan[] = [
  { id: "mp1", name: "Basic Monthly", description: "Standard monthly pool access", duration: "MONTHLY", price: 1500, features: ["Pool access", "Locker"], isActive: true, createdAt: now },
  { id: "mp2", name: "Quarterly Plus", description: "3 months with coaching discount", duration: "QUARTERLY", price: 4000, features: ["Pool access", "Locker", "Towel service", "10% coaching discount"], isActive: true, createdAt: now },
  { id: "mp3", name: "Annual Premium", description: "Full year unlimited access", duration: "YEARLY", price: 12000, features: ["Unlimited pool access", "Private locker", "Towel service", "Free coaching sessions", "Guest passes"], isActive: true, createdAt: now },
];

let mockStaff: Staff[] = [
  { id: "s1", name: "Coach Rajesh", mobile: "9876543220", role: StaffRole.Coach, specialization: "Freestyle & Backstroke", isAvailable: true, joinedAt: "2024-06-01T00:00:00Z" },
  { id: "s2", name: "Coach Meena", mobile: "9876543221", role: StaffRole.Coach, specialization: "Butterfly & Breaststroke", isAvailable: true, joinedAt: "2024-08-15T00:00:00Z" },
  { id: "s3", name: "Vikram Singh", mobile: "9876543222", role: StaffRole.Lifeguard, isAvailable: true, joinedAt: "2025-01-10T00:00:00Z" },
  { id: "s4", name: "Anjali Deshpande", mobile: "9876543223", role: StaffRole.Receptionist, isAvailable: true, joinedAt: "2025-03-01T00:00:00Z" },
  { id: "s5", name: "Coach Arvind", mobile: "9876543224", role: StaffRole.Coach, specialization: "Aqua Fitness & Senior Swim", isAvailable: true, joinedAt: "2025-05-20T00:00:00Z" },
  { id: "s6", name: "Deepak Verma", mobile: "9876543225", role: StaffRole.Manager, isAvailable: true, joinedAt: "2024-01-01T00:00:00Z" },
];

let mockAttendance: AttendanceRecord[] = [
  { id: "a1", customerId: "c1", customerName: "Rahul Sharma", checkInTime: `${today}T09:30:00Z`, checkOutTime: `${today}T10:45:00Z`, visitType: VisitType.Membership, lane: 3 },
  { id: "a2", customerId: "c2", customerName: "Priya Patel", checkInTime: `${today}T10:00:00Z`, visitType: VisitType.Coaching, lane: 1 },
  { id: "a3", customerId: "c4", customerName: "Sneha Reddy", checkInTime: `${today}T07:15:00Z`, checkOutTime: `${today}T08:30:00Z`, visitType: VisitType.Membership, lane: 5 },
  { id: "a4", customerId: "c5", customerName: "Vikram Joshi", checkInTime: `${today}T16:00:00Z`, checkOutTime: `${today}T17:00:00Z`, visitType: VisitType.Hourly, lane: 2 },
  { id: "a5", customerId: "c6", customerName: "Ananya Desai", checkInTime: `${today}T08:00:00Z`, visitType: VisitType.Coaching, lane: 4 },
  { id: "a6", customerId: "c8", customerName: "Kavita Nair", checkInTime: `${today}T06:15:00Z`, checkOutTime: `${today}T07:30:00Z`, visitType: VisitType.Membership, lane: 1 },
  { id: "a7", customerId: "c9", customerName: "Arjun Singh", checkInTime: `${today}T17:00:00Z`, visitType: VisitType.WalkIn, lane: 6 },
  { id: "a8", customerId: "c11", customerName: "Suresh Pillai", checkInTime: `${today}T05:30:00Z`, checkOutTime: `${today}T06:45:00Z`, visitType: VisitType.Membership, lane: 2 },
];

let mockDuePayments: DuePayment[] = [
  { id: "dp1", customerId: "c3", customerName: "Amit Kumar", customerMobile: "9876543212", description: "Monthly fee - December", amount: 1500, dueDate: "2025-12-15", status: "OVERDUE", createdAt: "2025-12-01T00:00:00Z" },
  { id: "dp2", customerId: "c2", customerName: "Priya Patel", customerMobile: "9876543211", description: "Coaching supplement", amount: 500, dueDate: today, status: "PENDING", createdAt: now },
  { id: "dp3", customerId: "c5", customerName: "Vikram Joshi", customerMobile: "9876543214", description: "Expired membership renewal", amount: 1500, dueDate: "2025-12-20", status: "OVERDUE", createdAt: "2025-12-05T00:00:00Z" },
  { id: "dp4", customerId: "c9", customerName: "Arjun Singh", customerMobile: "9876543218", description: "Guest entry fee", amount: 400, dueDate: today, status: "PENDING", createdAt: now },
  { id: "dp5", customerId: "c12", customerName: "Nisha Gupta", customerMobile: "9876543221", description: "Locker rental - Jan", amount: 300, dueDate: "2026-01-05", status: "PENDING", createdAt: now },
  { id: "dp6", customerId: "c3", customerName: "Amit Kumar", customerMobile: "9876543212", description: "Coaching overdue installment", amount: 1000, dueDate: "2025-12-01", status: "OVERDUE", createdAt: "2025-11-15T00:00:00Z" },
];

let mockSchedule: ScheduleSlot[] = [
  // Monday
  { id: "sh1", day: "Monday", startTime: "06:00", endTime: "07:30", type: "LANE", label: "Morning Lap Swim", lane: 1, maxCapacity: 8, currentBookings: 6 },
  { id: "sh2", day: "Monday", startTime: "08:00", endTime: "09:00", type: "COACHING", label: "Beginner Coaching", coachId: "s1", maxCapacity: 6, currentBookings: 5 },
  { id: "sh3", day: "Monday", startTime: "17:00", endTime: "19:00", type: "OPEN_SWIM", label: "Evening Open Swim", maxCapacity: 20, currentBookings: 14 },
  { id: "sh14", day: "Monday", startTime: "19:30", endTime: "20:30", type: "COACHING", label: "Advanced Stroke Drills", coachId: "s2", maxCapacity: 4, currentBookings: 3 },
  // Tuesday
  { id: "sh4", day: "Tuesday", startTime: "06:00", endTime: "07:00", type: "LANE", label: "Early Bird Laps", lane: 2, maxCapacity: 8, currentBookings: 4 },
  { id: "sh5", day: "Tuesday", startTime: "09:00", endTime: "10:30", type: "LANE", label: "Senior Swim", lane: 3, maxCapacity: 10, currentBookings: 7 },
  { id: "sh6", day: "Tuesday", startTime: "16:00", endTime: "17:00", type: "COACHING", label: "Kids Coaching", coachId: "s1", maxCapacity: 8, currentBookings: 8 },
  { id: "sh15", day: "Tuesday", startTime: "18:00", endTime: "19:30", type: "OPEN_SWIM", label: "Evening Free Swim", maxCapacity: 20, currentBookings: 11 },
  // Wednesday
  { id: "sh7", day: "Wednesday", startTime: "06:30", endTime: "08:00", type: "LANE", label: "Morning Laps", lane: 1, maxCapacity: 8, currentBookings: 5 },
  { id: "sh8", day: "Wednesday", startTime: "10:00", endTime: "11:00", type: "COACHING", label: "Butterfly Technique", coachId: "s2", maxCapacity: 4, currentBookings: 2 },
  { id: "sh16", day: "Wednesday", startTime: "17:30", endTime: "19:00", type: "OPEN_SWIM", label: "Midweek Swim", maxCapacity: 20, currentBookings: 9 },
  // Thursday
  { id: "sh9", day: "Thursday", startTime: "06:00", endTime: "07:30", type: "LANE", label: "Power Laps", lane: 4, maxCapacity: 8, currentBookings: 6 },
  { id: "sh10", day: "Thursday", startTime: "08:30", endTime: "09:30", type: "COACHING", label: "Freestyle Fundamentals", coachId: "s1", maxCapacity: 6, currentBookings: 4 },
  { id: "sh17", day: "Thursday", startTime: "16:00", endTime: "17:00", type: "COACHING", label: "Junior Swim Team", coachId: "s2", maxCapacity: 6, currentBookings: 5 },
  { id: "sh18", day: "Thursday", startTime: "19:00", endTime: "20:30", type: "OPEN_SWIM", label: "Night Swim", maxCapacity: 15, currentBookings: 10 },
  // Friday
  { id: "sh11", day: "Friday", startTime: "06:00", endTime: "07:00", type: "LANE", label: "Speed Laps", lane: 2, maxCapacity: 8, currentBookings: 3 },
  { id: "sh19", day: "Friday", startTime: "09:00", endTime: "10:00", type: "LANE", label: "Aqua Fitness", lane: 5, maxCapacity: 12, currentBookings: 9 },
  { id: "sh20", day: "Friday", startTime: "17:00", endTime: "19:00", type: "OPEN_SWIM", label: "Friday Splash", maxCapacity: 25, currentBookings: 18 },
  // Saturday
  { id: "sh12", day: "Saturday", startTime: "07:00", endTime: "09:00", type: "LANE", label: "Weekend Warrior Laps", lane: 1, maxCapacity: 10, currentBookings: 8 },
  { id: "sh21", day: "Saturday", startTime: "09:30", endTime: "11:00", type: "COACHING", label: "Weekend Bootcamp", coachId: "s1", maxCapacity: 8, currentBookings: 7 },
  { id: "sh22", day: "Saturday", startTime: "11:30", endTime: "13:00", type: "OPEN_SWIM", label: "Family Swim", maxCapacity: 30, currentBookings: 22 },
  { id: "sh23", day: "Saturday", startTime: "16:00", endTime: "18:00", type: "OPEN_SWIM", label: "Afternoon Fun", maxCapacity: 25, currentBookings: 16 },
  // Sunday
  { id: "sh13", day: "Sunday", startTime: "07:00", endTime: "08:30", type: "LANE", label: "Sunday Serenity Lanes", lane: 3, maxCapacity: 8, currentBookings: 5 },
  { id: "sh24", day: "Sunday", startTime: "09:00", endTime: "10:30", type: "COACHING", label: "Backstroke Basics", coachId: "s2", maxCapacity: 6, currentBookings: 4 },
  { id: "sh25", day: "Sunday", startTime: "11:00", endTime: "13:00", type: "OPEN_SWIM", label: "Sunday Social Swim", maxCapacity: 30, currentBookings: 20 },
  { id: "sh26", day: "Sunday", startTime: "16:00", endTime: "17:30", type: "OPEN_SWIM", label: "Evening Wind Down", maxCapacity: 20, currentBookings: 8 },
];

let mockAnnouncements: Announcement[] = [
  { id: "an1", title: "Pool Maintenance", message: "The pool will be closed for maintenance on Sunday, January 5th. Regular hours resume Monday.", priority: "HIGH", isActive: true, createdAt: `${today}T08:00:00Z`, expiresAt: "2026-01-06T00:00:00Z" },
  { id: "an2", title: "New Year Holiday Hours", message: "Special holiday hours: 6AM-6PM from Dec 25 to Jan 1. Happy New Year!", priority: "MEDIUM", isActive: true, createdAt: `${today}T09:00:00Z` },
  { id: "an3", title: "Weekend Swim Competition", message: "Annual inter-club swimming competition this Saturday. Registration open at reception. All members welcome to participate!", priority: "MEDIUM", isActive: true, createdAt: `${today}T07:00:00Z`, expiresAt: "2026-01-10T00:00:00Z" },
  { id: "an4", title: "New Coaching Batch", message: "Starting January — Beginner coaching batch for kids (ages 6-12). Limited seats, first-come-first-serve. Contact Coach Rajesh.", priority: "LOW", isActive: true, createdAt: `${today}T10:00:00Z` },
  { id: "an5", title: "Sauna Coming Soon", message: "We're installing a sauna in the wellness section. Expected to open mid-January. Stay tuned!", priority: "LOW", isActive: false, createdAt: `${today}T06:00:00Z` },
];

let transactions = [...mockTransactions];
let customers = [...mockCustomers];

function generateBillNumber(): string {
  billSequence++;
  return `BP${String(billSequence).padStart(6, "0")}`;
}

function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerArgs = { request: any; params: Record<string, string> };

let currentAdminPassword = "admin123";

export const handlers = [
  http.post("/api/auth/login", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as { username: string; password: string };
    if (body.username === "admin" && body.password === currentAdminPassword) {
      return HttpResponse.json({ token: "mock-jwt-token-abc123", user: { username: "admin" } });
    }
    return HttpResponse.json({ message: "Invalid credentials. (Default: admin / admin123)" }, { status: 401 });
  }),

  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ success: true });
  }),

  http.post("/api/auth/forgot-password", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as { identity: string };
    const ident = body.identity?.trim().toLowerCase();
    if (!ident) {
      return HttpResponse.json({ message: "Please enter your username, mobile, or email" }, { status: 400 });
    }
    return HttpResponse.json({
      success: true,
      message: "Verification code sent to registered contact",
      demoOtp: "123456",
      maskedDestination: ident.includes("@") ? ident : "adm***@blueparadise.com / 98765***10",
    });
  }),

  http.post("/api/auth/verify-otp", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as { identity: string; otp: string };
    if (body.otp === "123456" || body.otp.length === 6) {
      return HttpResponse.json({ success: true, resetToken: "reset_token_valid" });
    }
    return HttpResponse.json({ message: "Invalid 6-digit OTP code (Demo code: 123456)" }, { status: 400 });
  }),

  http.post("/api/auth/reset-password", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as { identity: string; newPassword: string };
    if (!body.newPassword || body.newPassword.length < 4) {
      return HttpResponse.json({ message: "New password must be at least 4 characters long" }, { status: 400 });
    }
    currentAdminPassword = body.newPassword;
    return HttpResponse.json({ success: true, message: "Password updated successfully" });
  }),

  http.post("/api/auth/change-password", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as { currentPassword: string; newPassword: string };
    if (body.currentPassword === currentAdminPassword) {
      currentAdminPassword = body.newPassword;
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ message: "Current password is incorrect" }, { status: 400 });
  }),

  // ── Customers ──
  http.get("/api/customers", ({ request }: HandlerArgs) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    let filtered = customers;
    if (search) {
      filtered = customers.filter(
        (c) => c.name.toLowerCase().includes(search) || c.mobile.includes(search) || c.aadhaarNumber?.includes(search)
      );
    }
    return HttpResponse.json(filtered);
  }),

  http.get("/api/customers/:id", ({ params }: HandlerArgs) => {
    const customer = customers.find((c) => c.id === params.id);
    if (!customer) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(customer);
  }),

  http.post("/api/customers", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as Partial<Customer>;
    if (customers.some((c) => c.mobile === body.mobile)) {
      return HttpResponse.json({ message: "Customer with this mobile already exists" }, { status: 409 });
    }
    const newCustomer: Customer = {
      id: generateId(),
      name: body.name ?? "",
      mobile: body.mobile ?? "",
      aadhaarNumber: body.aadhaarNumber,
      age: body.age,
      gender: body.gender,
      address: body.address,
      photoUrl: body.photoUrl,
      idCardPhoto: body.idCardPhoto,
      firstVisitAt: now,
      createdAt: now,
      updatedAt: now,
    };
    customers.push(newCustomer);
    return HttpResponse.json(newCustomer, { status: 201 });
  }),

  http.put("/api/customers/:id", async ({ request, params }: HandlerArgs) => {
    const body = (await request.json()) as Partial<Customer>;
    const idx = customers.findIndex((c) => c.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    customers[idx] = { ...customers[idx], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(customers[idx]);
  }),

  http.get("/api/customers/:id/visits", ({ params }: HandlerArgs) => {
    return HttpResponse.json(mockVisits.filter((v) => v.customerId === params.id));
  }),

  http.get("/api/customers/:id/memberships", ({ params }: HandlerArgs) => {
    return HttpResponse.json(mockMemberships.filter((m) => m.customerId === params.id));
  }),

  http.get("/api/customers/:id/coaching", ({ params }: HandlerArgs) => {
    return HttpResponse.json(mockCoaching.filter((c) => c.customerId === params.id));
  }),

  http.get("/api/customers/:id/transactions", ({ params }: HandlerArgs) => {
    return HttpResponse.json(transactions.filter((t) => t.customerId === params.id));
  }),

  // ── Billing ──
  http.get("/api/billing/transactions/today", () => {
    return HttpResponse.json(transactions.filter((t) => t.paidAt.startsWith(today)));
  }),

  http.get("/api/billing/dashboard-stats", () => {
    const todayTxns = transactions.filter((t) => t.paidAt.startsWith(today));
    return HttpResponse.json({
      totalCustomers: customers.length,
      todayVisits: mockVisits.filter((v) => v.visitedAt.startsWith(today)).length,
      todayRevenue: todayTxns.reduce((sum, t) => sum + t.amount, 0),
    });
  }),

  http.post("/api/billing/transactions", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as { customerId: string; serviceType: ServiceType; serviceName: string; amount: number; paymentMethod: PaymentMethod };
    const newTxn: Transaction = {
      id: generateId(),
      billNumber: generateBillNumber(),
      customerId: body.customerId,
      serviceType: body.serviceType,
      serviceName: body.serviceName,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTxn);
    return HttpResponse.json(newTxn, { status: 201 });
  }),

  http.get("/api/billing/transactions/:id", ({ params }: HandlerArgs) => {
    const txn = transactions.find((t) => t.id === params.id);
    if (!txn) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(txn);
  }),

  // ── Reports ──
  http.get("/api/reports/revenue", () => {
    const txns = transactions;
    const totalRevenue = txns.reduce((s, t) => s + t.amount, 0);
    const byCategory = {
      [ServiceType.Membership]: {
        total: txns.filter((t) => t.serviceType === ServiceType.Membership).reduce((s, t) => s + t.amount, 0),
        count: txns.filter((t) => t.serviceType === ServiceType.Membership).length,
      },
      [ServiceType.Coaching]: {
        total: txns.filter((t) => t.serviceType === ServiceType.Coaching).reduce((s, t) => s + t.amount, 0),
        count: txns.filter((t) => t.serviceType === ServiceType.Coaching).length,
      },
      [ServiceType.HourlySwimming]: {
        total: txns.filter((t) => t.serviceType === ServiceType.HourlySwimming).reduce((s, t) => s + t.amount, 0),
        count: txns.filter((t) => t.serviceType === ServiceType.HourlySwimming).length,
      },
    };
    // Generate 7 days of trend data for a proper chart
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const dayMultiplier = [0.6, 0.85, 1.1, 0.75, 1.2, 1.35, 1.0][6 - i];
      const memTotal = Math.round(byCategory[ServiceType.Membership].total * dayMultiplier * 0.55);
      const coachTotal = Math.round(byCategory[ServiceType.Coaching].total * dayMultiplier * 0.3);
      const hourlyTotal = Math.round(byCategory[ServiceType.HourlySwimming].total * dayMultiplier * 0.15);
      dailyData.push({
        period: dayLabel,
        date: dateStr,
        total: memTotal + coachTotal + hourlyTotal,
        count: Math.round(txns.length * dayMultiplier * 0.4),
        byCategory: {
          [ServiceType.Membership]: memTotal,
          [ServiceType.Coaching]: coachTotal,
          [ServiceType.HourlySwimming]: hourlyTotal,
        },
      });
    }
    return HttpResponse.json({
      totalRevenue,
      totalTransactions: txns.length,
      byCategory,
      dailyRevenue: dailyData,
    });
  }),

  http.get("/api/reports/transactions", () => {
    return HttpResponse.json(transactions);
  }),

  // ── Settings ──
  http.get("/api/settings", () => {
    return HttpResponse.json(mockSettings);
  }),

  http.put("/api/settings", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as Partial<BusinessSettings>;
    Object.assign(mockSettings, body);
    return HttpResponse.json(mockSettings);
  }),

  // ── Membership Plans ──
  http.get("/api/membership-plans", () => {
    return HttpResponse.json(mockMembershipPlans);
  }),

  http.get("/api/membership-plans/:id", ({ params }: HandlerArgs) => {
    const plan = mockMembershipPlans.find((p) => p.id === params.id);
    if (!plan) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(plan);
  }),

  http.post("/api/membership-plans", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as Partial<MembershipPlan>;
    const newPlan: MembershipPlan = { id: generateId(), name: body.name ?? "", description: body.description ?? "", duration: body.duration ?? "MONTHLY", price: body.price ?? 0, features: body.features ?? [], isActive: body.isActive ?? true, createdAt: now };
    mockMembershipPlans.push(newPlan);
    return HttpResponse.json(newPlan, { status: 201 });
  }),

  http.put("/api/membership-plans/:id", async ({ request, params }: HandlerArgs) => {
    const body = (await request.json()) as Partial<MembershipPlan>;
    const idx = mockMembershipPlans.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    Object.assign(mockMembershipPlans[idx], body);
    return HttpResponse.json(mockMembershipPlans[idx]);
  }),

  http.delete("/api/membership-plans/:id", ({ params }: HandlerArgs) => {
    mockMembershipPlans = mockMembershipPlans.filter((p) => p.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // ── Staff ──
  http.get("/api/staff", ({ request }: HandlerArgs) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const role = url.searchParams.get("role");
    let filtered = mockStaff;
    if (search) filtered = filtered.filter((s) => s.name.toLowerCase().includes(search) || s.mobile.includes(search));
    if (role) filtered = filtered.filter((s) => s.role === role);
    return HttpResponse.json(filtered);
  }),

  http.get("/api/staff/:id", ({ params }: HandlerArgs) => {
    const member = mockStaff.find((s) => s.id === params.id);
    if (!member) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(member);
  }),

  http.post("/api/staff", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as Partial<Staff>;
    const newStaff: Staff = { id: generateId(), name: body.name ?? "", mobile: body.mobile ?? "", role: body.role ?? StaffRole.Coach, specialization: body.specialization, isAvailable: body.isAvailable ?? true, joinedAt: now };
    mockStaff.push(newStaff);
    return HttpResponse.json(newStaff, { status: 201 });
  }),

  http.put("/api/staff/:id", async ({ request, params }: HandlerArgs) => {
    const body = (await request.json()) as Partial<Staff>;
    const idx = mockStaff.findIndex((s) => s.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    Object.assign(mockStaff[idx], body);
    return HttpResponse.json(mockStaff[idx]);
  }),

  http.delete("/api/staff/:id", ({ params }: HandlerArgs) => {
    mockStaff = mockStaff.filter((s) => s.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // ── Attendance ──
  http.get("/api/attendance/today", () => {
    return HttpResponse.json(mockAttendance.filter((a) => a.checkInTime.startsWith(today)));
  }),

  http.get("/api/attendance/active", () => {
    return HttpResponse.json(mockAttendance.filter((a) => !a.checkOutTime));
  }),

  http.get("/api/attendance/:date", ({ params }: HandlerArgs) => {
    return HttpResponse.json(mockAttendance.filter((a) => a.checkInTime.startsWith(params.date)));
  }),

  http.post("/api/attendance/check-in", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as { customerId: string; customerName: string; visitType: string; lane?: number; photoUrl?: string };
    const record: AttendanceRecord = { id: generateId(), customerId: body.customerId, customerName: body.customerName, checkInTime: new Date().toISOString(), visitType: body.visitType as VisitType, lane: body.lane, photoUrl: body.photoUrl };
    mockAttendance.push(record);
    return HttpResponse.json(record, { status: 201 });
  }),

  http.post("/api/attendance/:id/check-out", ({ params }: HandlerArgs) => {
    const record = mockAttendance.find((a) => a.id === params.id);
    if (!record) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    record.checkOutTime = new Date().toISOString();
    return HttpResponse.json(record);
  }),

  // ── Due Payments ──
  http.get("/api/due-payments", ({ request }: HandlerArgs) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    let filtered = mockDuePayments;
    if (status) filtered = filtered.filter((p) => p.status === status);
    return HttpResponse.json(filtered);
  }),

  http.get("/api/due-payments/summary", () => {
    const pending = mockDuePayments.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
    const overdue = mockDuePayments.filter((p) => p.status === "OVERDUE").reduce((s, p) => s + p.amount, 0);
    return HttpResponse.json({ totalPending: pending, totalOverdue: overdue, count: mockDuePayments.filter((p) => p.status !== "PAID").length });
  }),

  http.get("/api/due-payments/:id", ({ params }: HandlerArgs) => {
    const payment = mockDuePayments.find((p) => p.id === params.id);
    if (!payment) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(payment);
  }),

  http.post("/api/due-payments", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as Partial<DuePayment>;
    const newPayment: DuePayment = { id: generateId(), customerId: body.customerId ?? "", customerName: body.customerName ?? "", customerMobile: body.customerMobile ?? "", description: body.description ?? "", amount: body.amount ?? 0, dueDate: body.dueDate ?? today, status: body.status ?? "PENDING", createdAt: now };
    mockDuePayments.push(newPayment);
    return HttpResponse.json(newPayment, { status: 201 });
  }),

  http.post("/api/due-payments/:id/pay", ({ params }: HandlerArgs) => {
    const payment = mockDuePayments.find((p) => p.id === params.id);
    if (!payment) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    payment.status = "PAID";
    return HttpResponse.json(payment);
  }),

  http.delete("/api/due-payments/:id", ({ params }: HandlerArgs) => {
    mockDuePayments = mockDuePayments.filter((p) => p.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // ── Schedule ──
  http.get("/api/schedule", ({ request }: HandlerArgs) => {
    const url = new URL(request.url);
    const day = url.searchParams.get("day");
    let filtered = mockSchedule;
    if (day) filtered = filtered.filter((s) => s.day === day);
    return HttpResponse.json(filtered);
  }),

  http.get("/api/schedule/:id", ({ params }: HandlerArgs) => {
    const slot = mockSchedule.find((s) => s.id === params.id);
    if (!slot) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(slot);
  }),

  http.post("/api/schedule", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as Partial<ScheduleSlot>;
    const newSlot: ScheduleSlot = { id: generateId(), day: body.day ?? "Monday", startTime: body.startTime ?? "06:00", endTime: body.endTime ?? "07:00", type: body.type ?? "LANE", label: body.label ?? "", lane: body.lane, coachId: body.coachId, maxCapacity: body.maxCapacity ?? 8, currentBookings: 0 };
    mockSchedule.push(newSlot);
    return HttpResponse.json(newSlot, { status: 201 });
  }),

  http.put("/api/schedule/:id", async ({ request, params }: HandlerArgs) => {
    const body = (await request.json()) as Partial<ScheduleSlot>;
    const idx = mockSchedule.findIndex((s) => s.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    Object.assign(mockSchedule[idx], body);
    return HttpResponse.json(mockSchedule[idx]);
  }),

  http.delete("/api/schedule/:id", ({ params }: HandlerArgs) => {
    mockSchedule = mockSchedule.filter((s) => s.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // ── Announcements ──
  http.get("/api/announcements", () => {
    return HttpResponse.json(mockAnnouncements);
  }),

  http.get("/api/announcements/active", () => {
    return HttpResponse.json(mockAnnouncements.filter((a) => a.isActive));
  }),

  http.get("/api/announcements/:id", ({ params }: HandlerArgs) => {
    const announcement = mockAnnouncements.find((a) => a.id === params.id);
    if (!announcement) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(announcement);
  }),

  http.post("/api/announcements", async ({ request }: HandlerArgs) => {
    const body = (await request.json()) as Partial<Announcement>;
    const newAnnouncement: Announcement = { id: generateId(), title: body.title ?? "", message: body.message ?? "", priority: body.priority ?? "MEDIUM", isActive: body.isActive ?? true, createdAt: now, expiresAt: body.expiresAt };
    mockAnnouncements.push(newAnnouncement);
    return HttpResponse.json(newAnnouncement, { status: 201 });
  }),

  http.put("/api/announcements/:id", async ({ request, params }: HandlerArgs) => {
    const body = (await request.json()) as Partial<Announcement>;
    const idx = mockAnnouncements.findIndex((a) => a.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    Object.assign(mockAnnouncements[idx], body);
    return HttpResponse.json(mockAnnouncements[idx]);
  }),

  http.delete("/api/announcements/:id", ({ params }: HandlerArgs) => {
    mockAnnouncements = mockAnnouncements.filter((a) => a.id !== params.id);
    return HttpResponse.json({ success: true });
  }),
];
