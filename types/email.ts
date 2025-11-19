export interface Email {
  _id: string;
  subject: string;
  content: string; // HTML from Tiptap
  signature: string;
  authorId: 'user_1' | 'user_2';
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailFormData {
  subject: string;
  content: string;
  signature: string;
}

export interface RecentEmailData {
  emailId: string;
  authorId: 'user_1' | 'user_2';
  postedAt: number; // timestamp in milliseconds
}
