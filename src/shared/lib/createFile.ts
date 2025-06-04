// import { promises as fs } from 'fs'
// import path from 'path'
// import { v4 as uuidv4 } from 'uuid'


// // Предполагается, что файл передается как объект multer
// export async function createFile(imageFile: File | Blob): Promise<string> {
//     if (!imageFile || !imageFile.buffer) {
//         throw new Error('Image file is required')
//     }

//     const uploadDir = path.resolve(process.cwd(), 'public', 'slides')
//     await fs.mkdir(uploadDir, { recursive: true })

//     const uniqueFilename = `${uuidv4()}-${imageFile.originalname}`
//     const filePath = path.join(uploadDir, uniqueFilename)

//     await fs.writeFile(filePath, imageFile.buffer)

//     const relativePath = path.relative(path.resolve(process.cwd(), 'public'), filePath)

//     return `/${relativePath.replace(/\\/g, '/')}`
// }