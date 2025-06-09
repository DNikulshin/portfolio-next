"use client";

import { useCreateNewWork } from "@/hooks/useWork";
import { IFormDataCreateWork } from "@/types/types";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useState,
  useRef,
} from "react";

import { z } from "zod";

const formSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  linkUrl: z
    .string()
    .nonempty({ message: "Link is required" })
    .url({ message: "Invalid URL" }),
  image: z.any(),
  // .refine((files) => files?.length === 1, "Image is required."),
});

export const CreateForm = ({ userId }: { userId?: string }) => {
  const [formValue, setFormValue] = useState<IFormDataCreateWork>({
    title: "",
    linkUrl: "",
    image: null,
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createWork = useCreateNewWork();

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.type === "file") {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFormValue((prev) => ({
          ...prev,
          [e.target.name]: file,
        }));

        // const reader = new FileReader();
        // reader.onloadend = () => {
        //   const base64String = reader.result as string;
        //   setFormValue((prev) => ({
        //     ...prev,
        //     image: base64String,
        //   }));
        // };
        // reader.readAsDataURL(file);
      }
    } else {
      setFormValue((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const validatedData = formSchema.parse({
        title: formValue.title.trim(),
        linkUrl: formValue.linkUrl.trim(),
        image: formValue.image,
      });

      if (!userId) return;

      console.log({
        validatedData,
      });

      const formData = new FormData();
      formData.append("title", validatedData.title);
      formData.append("linkUrl", validatedData.linkUrl);
      formData.append("image", validatedData.image);
      formData.append("userId", userId);
      // Можно добавить изображение как файл, если есть
      // или оставить как строку base64, в зависимости от API
      // Например, если API ожидает файл:
      // formData.append("image", fileFromReader); // если есть файл
      // Или если API принимает base64 строку:
      // formData.append("image", validatedData.image);
      // // formData.append("userId", userId);
      // for (const [key, value] of formData.entries()) {
      //   console.log(`Ключ: ${key}, Значение: ${value}`);
      // }
      // const formData = Object.keys(formValue).reduce((fd, key) => {
      //   const k = key as keyof IFormDataCreateWork;
      //   const value = formValue[k];
      //   if (value !== null && value !== undefined) {
      //     fd.append(k, value);
      //   }
      //   return fd;
      // }, new FormData());

      // for (const [key, value] of formData.entries()) {
      //   console.log(`Ключ: ${key}, Значение: ${value}`);
      // }

      await new Promise((resolve, reject) => {
        createWork.mutate(formData, {
          onSuccess: () => {
            setFormValue({ title: "", linkUrl: "", image: null });
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setErrorMsg(null);
            resolve(null);
          },
          onError: (error) => {
            console.log(error);
            setErrorMsg((error as Error).message);
            reject(error);
          },
        });
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        setErrorMsg(firstError.message);
      } else {
        setErrorMsg("Unknown validation error");
      }
    }
  };

  if (createWork.isError) {
    return <div>{(createWork.error as Error).message ?? "unknown error"}</div>;
  }

  return (
    <form
      className="flex flex-col gap-4 mx-auto container"
      onSubmit={handleSubmit}
    >
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      <input
        type="text"
        name="title"
        className="px-2 py-2 border border-amber-100  disabled:bg-gray-500"
        onChange={changeHandler}
        value={formValue.title}
        disabled={createWork.isPending}
      />
      <input
        type="text"
        name="linkUrl"
        className="px-2 py-2 border border-amber-100  disabled:bg-gray-500"
        onChange={changeHandler}
        value={formValue.linkUrl}
        disabled={createWork.isPending}
      />
      <input
        type="file"
        name="image"
        accept="image/png, image/jpeg"
        className="px-2 py-2 border border-amber-100  disabled:bg-gray-500"
        onChange={changeHandler}
        disabled={createWork.isPending}
        ref={fileInputRef}
      />
      <button
        type="submit"
        className="px-2 py-2 bg-red-500/85 self-end rounded-md shadow-md cursor-pointer disabled:bg-gray-500"
        disabled={createWork.isPending}
      >
        Create Work
      </button>
    </form>
  );
};
