import { Slider } from '../Slider'

interface ListWork {
    id: number
    title: string
    img: string
    link: string
}

const list: ListWork[] = [
    { id: 1, title: 'Slider JS', img: '/slides/slide1.webp', link: 'https://dmnitprof.github.io/Slider/' },
    { id: 2, title: 'App game', img: '/slides/slide2.webp', link: 'https://remember-me-game.web.app/' },
    { id: 3, title: 'App game', img: '/slides/slide3.webp', link: 'https://aim-game-js.web.app/' },
    { id: 4, title: 'Slider JS', img: '/slides/slide4.webp', link: 'https://dmnitprof.github.io/Slider2JS/' },
    { id: 5, title: 'Test task', img: '/slides/slide5.webp', link: 'https://dnikulshin.github.io/data-heroes-test/' },
    { id: 6, title: 'Test task', img: '/slides/slide6.webp', link: 'https://test-task-slider-zeta.vercel.app/' },
    { id: 7, title: 'App Prototype', img: '/slides/slide7.webp', link: 'https://dining-room-lemon.vercel.app/' },
]

export const WorkList = () => {

    if (!list?.length) {
        return (
            <div className='w-full text-center'> <p className='text-red-500'>Not work. Add one.</p></div>
        )
    }

    return (
        <Slider list={list} />
    )
}
