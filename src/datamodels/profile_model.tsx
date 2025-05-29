export interface TraderProfile {
  id: string;
  name: string;
  location: string;
  email: string;
  bio: string;
  photoURL: string;
  role: string;
  rating: number;
  experience: string;
  specialties: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
  lastActive: string;
}
  
  export interface TradingPost {
    id: string;
    content: string;
    authorId: string;
    author: string;
    role: string;
    createdAt: string;
    authorPhotoURL: string;
  }