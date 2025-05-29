'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ListWork {
    id: number
    title: string
    img: string
    link: string
}

const list: ListWork[] = [
    { id: 1, title: 'job-1', img: '/slides/slide1.webp', link: 'https://dmnitprof.github.io/Slider/' },
    { id: 2, title: 'job-2', img: '/slides/slide2.webp', link: 'https://remember-me-game.web.app/' },
    { id: 3, title: 'job-3', img: '/slides/slide3.png', link: 'https://aim-game-js.web.app/' },
    { id: 4, title: 'job-4', img: '/slides/slide4.webp', link: 'https://dmnitprof.github.io/Slider2JS/' }
]

export const WorkList = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const totalSlides = list.length

    const handleNext = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % totalSlides)
    }, [totalSlides])

    const handlePrev = () => {
        setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides)
    }

    // Автоматическая смена слайдов
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext()
        }, 5000)
        return () => clearInterval(interval)
    }, [handleNext])

    if (!list?.length) {
        return (
            <div className='w-full text-center'> <p className='text-red-500'>Not work. Add one.</p></div>
        )
    }

    return (
        <div className='w-full overflow-hidden relative'>
            {/* Обертка для слайдов */}
            <div
                className='flex transition-transform duration-700 ease-in-out'
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`
                }}
            >
                {list.map((item) => (
                    <div key={item.id} className='min-w-full max-w-full shadow-md flex flex-col'>
                        {/* Контейнер с фиксированной высотой */}
                        <div className='h-64 flex items-center justify-center'>
                            {/* Изображение с сохранением пропорций */}
                            <Image
                                src={item?.img}
                                alt={item?.title}
                                className='h-full object-contain w-full'
                                width={300}
                                height={300}
                            />
                        </div>
                        <div className='flex items-center justify-center gap-4 px-2 py-2'>
                            <p>{item?.title}</p>
                            <Link
                                href={item?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='px-2 py-1 bg-green-500/85 rounded-sm'
                            >
                                Link
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Кнопки навигации */}
            <div className='w-full flex items-center justify-between px-2 py-2'>
                <button
                    onClick={handlePrev}
                    className='px-4 py-2 bg-gray-500/85 text-white rounded-md'
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className='px-4 py-2 bg-gray-500/85 text-white rounded-md'
                >
                    Next
                </button>
            </div>
        </div>
    )
}
