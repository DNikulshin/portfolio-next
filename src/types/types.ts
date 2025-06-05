import { Work } from "@prisma/client";

export interface IResponseDataWork {
  works: Work[];
  totalCount: number;
}

export interface IFormDataCreateWork {
  title: string;
  image: File | Blob;
  linkPath: string;
  userId?: string | undefined;
}

export interface IUserData {
  email: string;
  error: string | null;
}
