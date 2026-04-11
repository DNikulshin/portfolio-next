import { Work } from "@prisma/client";

export interface IResponseDataWork {
  works: Work[];
  totalCount: number;
}

export interface IFormDataCreateWork {
  title: string;
  imageUrl: string;
  linkUrl: string;
}

export interface IFormDataUpdateWork {
  id: string;
  title: string;
  imageUrl?: string;
  linkUrl: string;
}
