"use client";

import { useCreateNewWork } from "@/hooks/useWork";
import { IFormDataCreateWork } from "@/types/types";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useState,
  useRef,
} from "react";

export const CreateForm = ({ userId }: { userId?: string }) => {
  const [formValue, setFormValue] = useState<IFormDataCreateWork>({
    title: "",
    linkPath: "",
    image: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createWork = useCreateNewWork();

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.type === "file") {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // // убрать префикс:
          // const base64Data = base64String.split(",")[1];

          setFormValue((prev) => ({
            ...prev,
            image: base64String,
          }));
        };
        reader.readAsDataURL(file);
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

    if (!formValue.title || !formValue.linkPath || !formValue.image || !userId)
      return;

    const payload = {
      title: formValue.title.trim(),
      linkPath: formValue.linkPath.trim(),
      image: formValue.image,
      userId,
    };

    createWork.mutate(payload, {
      onSuccess: () => {
        setFormValue({
          title: "",
          linkPath: "",
          image: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  if (createWork.isError) {
    return <div>{(createWork.error as Error).message ?? "unknown error"}</div>;
  }

  return (
    <form
      className="flex flex-col gap-4 mx-auto container"
      onSubmit={handleSubmit}
    >
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
        name="linkPath"
        className="px-2 py-2 border border-amber-100  disabled:bg-gray-500"
        onChange={changeHandler}
        value={formValue.linkPath}
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
