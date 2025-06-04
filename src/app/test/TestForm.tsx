"use client"

import { IFormDataCreateWork } from '@/types/types';
import { useState } from 'react'

export default function TestForm({ posts }) {
    const [formValue, setFormValue] = useState<IFormDataCreateWork>(
        { title: '', linkPath: '', image: null as unknown as File | Blob });
    console.log(posts);


    return (

        <form className='flex flex-col gap-4 mx-auto container'>
            <input
                type="text"
                name='title'
                className='px-2 py-2 border border-amber-100'
            />
            <input
                type="text"
                name='linkPath'
                className='px-2 py-2 border border-amber-100'
            />
            <input
                type="file"
                name='image'
                accept="image/png, image/jpeg"
                className='px-2 py-2 border border-amber-100'
            />
            <button type="submit" className='px-2 py-2 bg-red-500/85 self-end rounded-md shadow-md'>
                Create Work
            </button>
        </form>
    )
}
