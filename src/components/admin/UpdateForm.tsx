'use client';

import { useUpdateWork } from '@/hooks/useWork';
import { IFormDataCreateWork } from '@/types/types';
import { Work } from '@prisma/client';
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
    .any()
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .png and .webp formats are supported.',
    ),
});

interface UpdateFormProps {
  work: Work;
  onClose: () => void;
}

export const UpdateForm = ({ work, onClose }: UpdateFormProps) => {
  const [formValue, setFormValue] = useState<IFormDataCreateWork>({
    title: work.title,
    linkUrl: work.linkUrl,
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(work.imageUrl);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateWork = useUpdateWork();

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.type === 'file') {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setFormValue((prev) => ({ ...prev, image: file }));
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const validatedData = formSchema.parse(formValue);
      const formData = new FormData();

      formData.append('title', validatedData.title);
      formData.append('linkUrl', validatedData.linkUrl);
      if (validatedData.image) {
        formData.append('image', validatedData.image);
      }

      updateWork.mutate(
        { id: work.id, data: formData },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            setErrorMsg((error as Error).message);
          },
        },
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrorMsg(err.errors[0].message);
      } else {
        setErrorMsg('Unknown validation error');
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-4 mt-4 p-4 border-t border-gray-700"
      onSubmit={handleSubmit}
    >
      {errorMsg && (
        <div className="text-red-500 text-sm mb-2">{errorMsg}</div>
      )}
      <Input
        name="title"
        placeholder="Title"
        value={formValue.title}
        onChange={changeHandler}
        disabled={updateWork.isPending}
      />
      <Input
        name="linkUrl"
        placeholder="Link URL"
        value={formValue.linkUrl}
        onChange={changeHandler}
        disabled={updateWork.isPending}
      />
      <Input
        type="file"
        name="image"
        accept="image/png, image/jpeg, image/webp"
        onChange={changeHandler}
        disabled={updateWork.isPending}
        ref={fileInputRef}
      />
      {preview && (
        <div className="mt-2">
          <p className="text-sm text-gray-400 mb-1">Image Preview:</p>
          <Image
            src={preview}
            alt="Preview"
            width={128}
            height={128}
            className="object-cover rounded-md"
          />
        </div>
      )}
      <div className="flex gap-2 self-end mt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={updateWork.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="destructive"
          disabled={updateWork.isPending}
        >
          {updateWork.isPending ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  );
};
