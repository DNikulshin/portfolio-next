import { Work } from "@/generated/prisma";

export interface IResponseDataWork {
  works: Work[];
  totalCount: number;
}

export interface IFormDataCreateWork {
  title: string;
  image: string;
  linkPath: string;
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
  error: string | null;
}
