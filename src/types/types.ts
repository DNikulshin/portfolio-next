import { Work } from "@prisma/client";

export interface IResponseDataWork {
  works: Work[];
  totalCount: number;
}

export interface IFormDataCreateWork {
  title: string;
  image: File | Blob | null;
  linkUrl: string;
  userId?: string | undefined;
}

export interface IFormDataUpdateWork {
  id: string;
  title: string;
  image: string;
  linkPath: string;
  userId?: string | undefined;
}

export interface IUserData {
  email: string;
  userId: string;
}
