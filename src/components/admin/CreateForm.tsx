"use client";
import { useCreateNewWork } from "@/hooks/useWork";
import { IFormDataCreateWork } from "@/types/types";
import React, { ChangeEventHandler, FormEventHandler, useState } from "react";

export const CreateForm = ({ userId }: { userId?: string }) => {
  const [formValue, setFormValue] = useState<IFormDataCreateWork>({
    title: "",
    linkPath: "",
    image: null as unknown as File | Blob,
  });

  const createWork = useCreateNewWork();

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.type === "file") {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFormValue((prev) => ({
          ...prev,
          [e.target.name]: files[0],
        }));
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
    const formData = new FormData();
    if (!formValue.title || !formValue.linkPath || !formValue.image || !userId)
      return;
    formData.append("title", formValue.title.trim());
    formData.append("linkPath", formValue.linkPath.trim());
    formData.append("image", formValue.image);

    createWork.mutate(
      { ...formValue, userId },
      {
        onSuccess: () => {
          setFormValue({
            title: "",
            linkPath: "",
            image: null as unknown as File | Blob,
            userId: "",
          });
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  return (
    <form
      className="flex flex-col gap-4 mx-auto container"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="title"
        className="px-2 py-2 border border-amber-100"
        onChange={changeHandler}
        value={formValue.title}
      />
      <input
        type="text"
        name="linkPath"
        className="px-2 py-2 border border-amber-100"
        onChange={changeHandler}
        value={formValue.linkPath}
      />
      <input
        type="file"
        name="image"
        accept="image/png, image/jpeg"
        className="px-2 py-2 border border-amber-100"
        onChange={changeHandler}
      />
      <button
        type="submit"
        className="px-2 py-2 bg-red-500/85 self-end rounded-md shadow-md"
      >
        Create Work
      </button>
    </form>
  );
};
