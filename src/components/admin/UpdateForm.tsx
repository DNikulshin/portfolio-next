// "use client";

// import { useCreateNewWork } from "@/hooks/useWork";
// import { IFormDataCreateWork } from "@/types/types";
// import React, {
//   ChangeEventHandler,
//   FormEventHandler,
//   useState,
//   useRef,
// } from "react";

// interface Props {
//   userId: string | undefined;
//   children: React.ReactNode;
// }

// export const UpdateForm = ({ userId, children }: Props) => {
//   const [formValue, setFormValue] = useState<IFormDataCreateWork>({
//     title: "",
//     linkPath: "",
//     image: "",
//   });

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const createWork = useCreateNewWork();

//   const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
//     if (e.target.type === "file") {
//       const files = e.target.files;
//       if (files && files.length > 0) {
//         const file = files[0];
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const base64String = reader.result as string;
//           setFormValue((prev) => ({
//             ...prev,
//             image: base64String,
//           }));
//         };
//         reader.readAsDataURL(file);
//       }
//     } else {
//       setFormValue((prev) => ({
//         ...prev,
//         [e.target.name]: e.target.value,
//       }));
//     }
//   };

//   const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
//     e.preventDefault();

//     if (!formValue.title || !formValue.linkPath || !formValue.image || !userId)
//       return;

//     const payload = {
//       title: formValue.title.trim(),
//       linkPath: formValue.linkPath.trim(),
//       image: formValue.image,
//       userId,
//     };

//     createWork.mutate(payload, {
//       onSuccess: () => {
//         setFormValue({
//           title: "",
//           linkPath: "",
//           image: "",
//         });
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }
//       },
//       onError: (error) => {
//         console.log(error);
//       },
//     });
//   };

//   if (createWork.isError) {
//     return <div>{(createWork.error as Error).message ?? "unknown error"}</div>;
//   }

//   return (
//     <form
//       className="flex flex-col gap-4 mx-auto container"
//       onSubmit={handleSubmit}
//     >
//       {children}
//     </form>
//   );
// };
