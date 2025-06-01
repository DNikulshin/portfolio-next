import { getUser } from '@/hooks/useUser'
import { geWorks } from '@/hooks/useWork'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default async function Admin() {
    const user = await getUser('admin@admin.ru')
    const { works } = await geWorks('admin@admin.ru')

    return (
        <div className='px-2 py-2'>
            <h3 className='text-center'>Admin Page - {user?.error ? user?.error : <p>Welcome {user?.email}</p>}</h3>

            <div className='flex flex-col gap-4 px-4 py-4'>
                {works && works.map(work => (
                    <div key={work.id} className='flex gap-2 justify-between items-center shadow-md shadow-amber-100 px-4 py-4'>
                        <div>{work.title}</div>
                        <Image src={work.imagePath} alt={work.title} width={200} height={200} />
                        <Link href={work.linkPath} className='text-blue-500 underline'
                            target="_blank" rel="noopener noreferrer"
                        >View project
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
