import { geWorks } from '@/hooks/useWork'
import { Slider } from '../Slider'

export const WorkList = async () => {
    const { works } = await geWorks('admin@admin.ru')

    if (!works?.length) {
        return (
            <div className='w-full text-center'> <p className='text-red-500'>Not work. Add one.</p></div>
        )
    }

    return (
        <Slider list={works || []} />
    )
}
