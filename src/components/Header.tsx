import React from 'react'
import Image from 'next/image'
import Notebook from '@/images/notebook.webp'
import Avatar from '@/images/avatar.webp'
import Link from 'next/link'
import { FaGithub } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { GitHubStats } from './GitHubStats'

export const Header = () => {
    const username = process.env.GITHUB_USERNAME || '';
    const token = process.env.GITHUB_TOKEN || '';

    return (
        <div className='w-full flex-col  items-center gap-4'>
            <div className='w-full flex items-center justify-center gap-4 shadow-md px-2 py-2'>
                <h1 className='text-xl font-semibold'>Nikulshin Dmitriy</h1>
                <h2 className='text-xl font-semibold'>Developer Page</h2>
            </div>

            <div className='flex justify-between items-center gap-4'>
                <div>

                    <div className='flex gap-4 justify-center items-center  py-4'>

                        <div className='flex flex-col gap-2 items-center justify-center max-w-[150px] select-none pointer-events-none'>
                            <Image src={Avatar} alt='avatar' priority className='shadow-md rounded-md' />


                        </div>

                        <ul className='flex flex-col gap-3 justify-center items-center'>
                            <li className='px-1 py-0.5 shadow-md rounded-md hover:text-red-500/85' title='https://github.com/DNikulshin'>
                                <Link href="https://github.com/DNikulshin" target="_blank" rel="noopener noreferrer">
                                    <FaGithub className='text-3xl' />
                                </Link>
                            </li>
                            <li className='px-1 py-0.5 shadow-md rounded-md hover:text-red-500/85' title='d.nikulshin.dev@gmail.com' >
                                <Link href="mailto:d.nikulshin.dev@gmail.com" target="_blank" rel="noopener noreferrer">
                                    <MdAlternateEmail className='text-3xl' />
                                </Link>
                            </li>
                            <li className='px-1 py-0.5 shadow-md rounded-md hover:text-red-500/85' title='+7925-861-59-59' >
                                <Link href="tel:+7925-861-59-59" target="_blank" rel="noopener noreferrer">
                                    <FaMobileAlt className='text-3xl' />
                                </Link>
                            </li>
                        </ul>

                    </div>
                </div>

                <div className='flex justify-center items-center'>
                    {token && username &&
                        <div className='hidden sm:block'>
                            <GitHubStats
                                token={token}
                                username={username}
                            />
                        </div>
                    }

                    <div className='max-w-[150px] select-none pointer-events-none'>
                        <Image src={Notebook} alt='notebook' priority />
                    </div>
                </div>
            </div>
        </div>
    )
}
