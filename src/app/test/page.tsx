import TestForm from '@/app/test/TestForm';
// import { createFile } from '@/shared/lib/actions'
export default async function Test() {

    const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());


    return (
        <TestForm posts={posts} />
        // <form className='flex flex-col gap-4 mx-auto container' action={action}>
        //     <input
        //         type="text"
        //         name='title'
        //         className='px-2 py-2 border border-amber-100'
        //     />
        //     <input
        //         type="text"
        //         name='linkPath'
        //         className='px-2 py-2 border border-amber-100'
        //     />
        //     <input
        //         type="file"
        //         name='image'
        //         accept="image/png, image/jpeg"
        //         className='px-2 py-2 border border-amber-100'
        //     />
        //     <button type="submit" className='px-2 py-2 bg-red-500/85 self-end rounded-md shadow-md'>
        //         Create Work
        //     </button>
        // </form>
    )
}
