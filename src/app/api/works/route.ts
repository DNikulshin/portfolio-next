import { NextRequest, NextResponse } from "next/server"
import { prismaClient } from "@/shared/lib/prisma-client";
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(req: NextRequest) {
    try {
        const totalCount = await prismaClient.work.count();
        const works = await prismaClient.work.findMany({});

        return NextResponse.json({ works, totalCount }, { status: 200 });

    } catch (error) {
        console.error('Ошибка при обработке GET запроса:', error)
        return NextResponse.json(
            { error: (error as Error).message || 'Внутренняя ошибка сервера' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData()

        if (!data) {
            return NextResponse.json({ error: 'Нет данных формы' }, { status: 400 })
        }

        const title = data.get('title') as string
        const linkPath = data.get('linkPath') as string
        const userId = data.get('userId') as string
        const imageFile = data.get('image') as File

        if (!imageFile || imageFile.size === 0) {
            return NextResponse.json({ error: 'Нет загруженного изображения' }, { status: 400 })
        }

        const imageBuffer = await imageFile.arrayBuffer()

        const uploadsDir = path.join(process.cwd(), 'public', 'slides')
        const filename = `${Date.now()}_${imageFile.name}`
        const filePath = path.join(uploadsDir, filename)

        await fs.mkdir(uploadsDir, { recursive: true })
        await fs.writeFile(filePath, Buffer.from(imageBuffer))

        const imagePath = `/slides/${filename}`

        const newWork = await prismaClient.work.create({
            data: {
                title,
                linkPath,
                userId,
                imagePath,
            },
        })

        return NextResponse.json(newWork, { status: 200 })

    } catch (error) {
        console.error('Ошибка при обработке POST запроса:', error)
        return NextResponse.json(
            { error: (error as Error).message || 'Внутренняя ошибка сервера' },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const workId = searchParams.get('id')

        if (!workId) {
            return NextResponse.json({ error: 'Отсутствует ID работы' }, { status: 400 })
        }

        const data = await req.formData()

        const title = data.get('title') as string
        const linkPath = data.get('linkPath') as string
        const userId = data.get('userId') as string
        const imageFile = data.get('image') as File | null

        const existingWork = await prismaClient.work.findUnique({
            where: { id: workId },
        })

        if (!existingWork) {
            return NextResponse.json({ error: 'Работа не найдена' }, { status: 404 })
        }

        let imagePath: string | undefined

        if (imageFile && imageFile.size > 0) {
            if (existingWork.imagePath) {
                const oldImagePath = path.join(process.cwd(), 'public', existingWork.imagePath)
                try {
                    await fs.unlink(oldImagePath)
                } catch (err) {
                    console.error('Ошибка при удалении старой картинки:', err)
                }
            }
            const imageBuffer = await imageFile.arrayBuffer()
            const uploadsDir = path.join(process.cwd(), 'public', 'slides')
            const filename = `${Date.now()}_${imageFile.name}`
            const filePath = path.join(uploadsDir, filename)

            await fs.mkdir(uploadsDir, { recursive: true })
            await fs.writeFile(filePath, Buffer.from(imageBuffer))
            imagePath = `/slides/${filename}`
        }


        type UpdateData = {
            title: string
            linkPath: string
            userId: string
            imagePath?: string
        }
        const updateData: UpdateData = {
            title,
            linkPath,
            userId,
            imagePath
        }

        if (imagePath) {
            updateData.imagePath = imagePath
        }

        const updatedWork = await prismaClient.work.update({
            where: { id: workId },
            data: updateData,
        })

        return NextResponse.json(updatedWork, { status: 200 })

    } catch (error) {
        console.error('Ошибка при обновлении работы:', error)
        return NextResponse.json(
            { error: (error as Error).message || 'Внутренняя ошибка сервера' },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {

        const data = await req.formData()

        const id = data.get('id') as string

        if (!data || !id) {
            return NextResponse.json({ error: 'Отсутствует ID работы' }, { status: 400 })
        }

        const work = await prismaClient.work.findUnique({ where: { id } })

        if (!work) {
            return NextResponse.json({ error: 'Работа не найдена' }, { status: 404 })
        }

        if (work.imagePath) {
            const imageFullPath = path.join(process.cwd(), 'public', work.imagePath)
            try {
                await fs.unlink(imageFullPath)
            } catch (err) {
                console.warn('Не удалось удалить изображение:', err)
            }
        }

        await prismaClient.work.delete({ where: { id } })

        return NextResponse.json({ message: 'Работа успешно удалена' }, { status: 200 })

    } catch (error) {
        console.error('Ошибка при удалении работы:', error)
        return NextResponse.json(
            { error: (error as Error).message || 'Внутренняя ошибка сервера' },
            { status: 500 }
        )
    }
}