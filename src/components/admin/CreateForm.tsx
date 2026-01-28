'use client';

import { useCreateNewWork } from '@/hooks/useWork';
import { IFormDataCreateWork } from '@/types/types';
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useState,
  useRef,
  useEffect,
} from 'react';

import { z } from 'zod';
import { Input } from '@/shared/ui/kit/input';
import { Button } from '@/shared/ui/kit/button';
import Image from 'next/image'; // Импортируем Image

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const formSchema = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  linkUrl: z
    .string()
    .nonempty({ message: 'Link is required' })
    .url({ message: 'Invalid URL' }),
  image: z
    .instanceof(File, { message: 'Image is required.' })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .png and .webp formats are supported.',
    ),
});

export const CreateForm = ({ userId }: { userId?: string }) => {
  const [formValue, setFormValue] = useState<IFormDataCreateWork>({
    title: '',
    linkUrl: '',
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createWork = useCreateNewWork();

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.type === 'file') {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFormValue((prev) => ({
          ...prev,
          image: file,
        }));
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormValue((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const validatedData = formSchema.parse({
        title: formValue.title.trim(),
        linkUrl: formValue.linkUrl.trim(),
        image: formValue.image,
      });

      if (!userId) return;

      const formData = new FormData();
      formData.append('title', validatedData.title);
      formData.append('linkUrl', validatedData.linkUrl);
      formData.append('image', validatedData.image);
      formData.append('userId', userId);

      createWork.mutate(formData, {
        onSuccess: () => {
          setFormValue({ title: '', linkUrl: '', image: null });
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }
          setErrorMsg(null);
        },
        onError: (error) => {
          setErrorMsg((error as Error).message);
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        setErrorMsg(firstError.message);
      } else {
        setErrorMsg('Unknown validation error');
      }
    }
  };

  if (createWork.isError) {
    return <div>{(createWork.error as Error).message ?? 'unknown error'}</div>;
  }

  return (
    <form
      className="flex flex-col gap-4 mx-auto container"
      onSubmit={handleSubmit}
    >
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      <Input
        type="text"
        name="title"
        placeholder="Enter title"
        onChange={changeHandler}
        value={formValue.title}
        disabled={createWork.isPending}
      />
      <Input
        type="text"
        name="linkUrl"
        placeholder="Enter link"
        onChange={changeHandler}
        value={formValue.linkUrl}
        disabled={createWork.isPending}
      />
      <Input
        type="file"
        name="image"
        accept="image/png, image/jpeg, image/webp"
        onChange={changeHandler}
        disabled={createWork.isPending}
        ref={fileInputRef}
      />
      {preview && (
        <div className="mt-4">
          <Image
            src={preview}
            alt="Image preview"
            width={128} // w-32
            height={128} // h-32
            className="object-cover rounded-md"
          />
        </div>
      )}
      <Button
        type="submit"
        variant="destructive"
        className="self-end"
        disabled={createWork.isPending}
      >
        {createWork.isPending ? 'Creating...' : 'Create Work'}
      </Button>
    </form>
  );
};
