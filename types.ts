export enum AppScreen {
  ATTRACT = 'ATTRACT',
  COMPOSE = 'COMPOSE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
}

export interface WishSubmission {
  name: string;
  contactNumber: string;
  message: string;
  timestamp: number;
}

export interface DonationStats {
  totalDonated: number;
  messageCount: number;
}