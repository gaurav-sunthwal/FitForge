import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';
import { GEMINI_MODEL } from '@/lib/ai-config';

export async function POST(request: Request) {
    try {
        const { image, foodName, validateGymImage } = await request.json();

        if (!image && !foodName) {
            return NextResponse.json({ success: false, message: 'Image data or food name is required' }, { status: 400 });
        }

        // Get user's API key from database
        const userId = await getUserId();
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

        let apiKey = user?.geminiApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                message: 'No API key configured. Please add your Gemini API key in AI Settings.',
                requiresApiKey: true
            }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        // Handle gym image validation
        if (validateGymImage && image) {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

            const gymPrompt = `Analyze this image and determine if it's a gym/fitness/workout related photo. 
            Look for: gym equipment, workout activities, fitness environment, exercise poses, athletic wear in gym setting.
            Return ONLY a JSON object with: { "isGymImage": true/false, "reason": "brief explanation" }`;

            const result = await model.generateContent([
                gymPrompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: 'image/jpeg'
                    }
                }
            ]);

            const responseText = result.response.text();
            console.log('AI Gym Validation Response:', responseText);

            // More robust JSON extraction
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const validationData = jsonMatch ? JSON.parse(jsonMatch[0].replace(/```json|```/g, '')) : null;

            if (!validationData?.isGymImage) {
                return NextResponse.json({
                    success: true,
                    message: validationData?.reason || 'This doesn\'t appear to be a gym/workout photo. Please upload a fitness-related image.',
                    isGymImage: false
                }, { status: 200 });
            }

            return NextResponse.json({
                success: true,
                isGymImage: true,
                message: 'Valid gym image'
            });
        }

        // Handle food name to nutrition analysis
        if (foodName && !image) {
            const foodPrompt = `Provide nutritional information for: "${foodName}". 
            Return ONLY a JSON object with: { "foodName": "${foodName}", "calories": number, "protein": number (in grams), "carbs": number (in grams), "fats": number (in grams) }
            Use standard serving sizes. Be accurate and realistic.`;

            const result = await model.generateContent(foodPrompt);
            const responseText = result.response.text();
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const nutritionData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

            if (!nutritionData) {
                throw new Error('Failed to parse AI response');
            }

            return NextResponse.json({
                success: true,
                data: nutritionData
            });
        }

        // Handle image to nutrition analysis
        if (image) {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

            const prompt = `Analyze this food image and provide detailed nutritional information. 
            Return ONLY a JSON object with: { "foodName": "specific food name", "calories": number, "protein": number (in grams), "carbs": number (in grams), "fats": number (in grams) }
            Be accurate and use standard serving sizes visible in the image.`;

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: 'image/jpeg'
                    }
                }
            ]);

            const responseText = result.response.text();
            console.log('AI Food Analysis Response:', responseText);

            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const analysisData = jsonMatch ? JSON.parse(jsonMatch[0].replace(/```json|```/g, '')) : null;

            if (!analysisData) {
                throw new Error('Failed to parse AI response');
            }

            return NextResponse.json({
                success: true,
                data: analysisData
            });
        }

        return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });

    } catch (error: any) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to analyze with AI',
            error: error.message
        }, { status: 500 });
    }
}
