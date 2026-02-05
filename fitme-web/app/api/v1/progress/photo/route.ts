import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { progressPhotos } from '@/lib/db/schema';
import { getUserId } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        let imageUrl = '';
        let caption = '';
        const userId = await getUserId();

        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const body = await request.json();
            imageUrl = body.imageUrl;
            caption = body.caption;
        } else {
            const formData = await request.formData();
            const image = formData.get('image') as File;
            caption = formData.get('caption') as string;
            imageUrl = `https://storage.googleapis.com/fitme-mock/${image?.name || 'photo.jpg'}`;
        }

        if (!imageUrl) {
            return NextResponse.json({ success: false, message: 'Image is required' }, { status: 400 });
        }

        const [newPhoto] = await db.insert(progressPhotos).values({
            userId: userId,
            imageUrl: imageUrl,
            caption: caption,
        }).returning();

        return NextResponse.json({
            success: true,
            message: 'Progress photo uploaded successfully',
            data: newPhoto
        });
    } catch (error: any) {
        console.error('Error uploading photo:', error);
        return NextResponse.json({ success: false, message: 'Failed to upload photo', error: error.message }, { status: 500 });
    }
}
