export interface Winner {
  id: number | string;
  name: string;
  nameAm: string;
  prize: string;
  prizeAm: string;
  cycle: string;
  cycleAm: string;
  location: string;
  locationAm: string;
}

export interface AppNotification {
  id: number | string;
  title: { en: string; am: string };
  desc: { en: string; am: string };
  time: Date;
  urgent: boolean;
  read: boolean;
  targetUserId?: string | number; // Optional: If present, only this user sees it
}

export interface CurrentWinner {
  userId: string | number;
  userName: string;
  ticketNumber: number;
  prizeName: string;
  announcedAt: string;
}

export interface AppSettings {
  nextDrawDateEn: string;
  nextDrawDateAm: string;
  potValue: number;
  totalMembers: number;
  cycle: number;
  daysRemaining: number;
  drawDate: string;
  iphonesDelivered: number;
  trustScore: number;
  prizeName: string;
  prizeValue: string;
  prizeImage: string;
  prizeImages: string[];
  recentWinners: Winner[];
  currentWinner?: CurrentWinner | null; // New field for live winner announcement
  winnerAnnouncementMode: boolean; // Toggle to replace prize card with winner card
  liveStreamUrl: string;
  isLive: boolean;
  registrationEnabled: boolean;
  adminPassword?: string;
  ticketSelectionEnabled: boolean; // New field to control ticket grid interactivity
}

export type ViewState = 'landing' | 'login' | 'dashboard' | 'admin' | 'terms';

export type Language = 'en' | 'am';

export interface PaymentRequest {
  id: string;
  userId: string | number;
  userName: string;
  userPhone: string;
  amount: number;
  date: string;
  receiptUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedTicket?: number;
};

export interface TicketType {
  id: string;
  ticketNumber: number;
  userId: string | number;
  userName: string;
  cycle: number;
  status: 'ACTIVE' | 'VOID' | 'PENDING' | 'RESERVED';
  assignedDate: string;
  assignedBy: 'SYSTEM' | 'ADMIN' | 'USER';
};

export const ETHIOPIAN_MONTHS = [
    { val: 1, name: "Meskerem (Sep-Oct)" },
    { val: 2, name: "Tikimt (Oct-Nov)" },
    { val: 3, name: "Hidar (Nov-Dec)" },
    { val: 4, name: "Tahsas (Dec-Jan)" },
    { val: 5, name: "Tir (Jan-Feb)" },
    { val: 6, name: "Yekatit (Feb-Mar)" },
    { val: 7, name: "Megabit (Mar-Apr)" },
    { val: 8, name: "Miyazia (Apr-May)" },
    { val: 9, name: "Ginbot (May-Jun)" },
    { val: 10, name: "Sene (Jun-Jul)" },
    { val: 11, name: "Hamle (Jul-Aug)" },
    { val: 12, name: "Nehase (Aug-Sep)" },
    { val: 13, name: "Pagume (Sep)" },
];

export const AMHARIC_MONTHS = [
    "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሀምሌ", "ነሃሴ", "ጳጉሜ"
];

export interface AdminUser {
  id?: number | string;
  name: string;
  phone: string;
  status: 'PENDING' | 'VERIFIED';
  contribution: number;
  prizeNumber?: number | string;
  joinedDate?: string;
}

export interface FeedItem {
  id: number;
  name: string;
  action: string;
  time: string;
}
