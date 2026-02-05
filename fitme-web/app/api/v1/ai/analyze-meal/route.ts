import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { image } = await request.json(); // base64 string

        if (!image) {
            return NextResponse.json({ success: false, message: 'Image data is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY is not set in environment variables');
            // For demo purposes, we'll return mock data if API key is missing
            // In production, you would return an error
            return NextResponse.json({
                success: true,
                message: 'AI analysis successful (Mock Data - ADD GEMINI_API_KEY to .env)',
                data: {
                    foodName: 'Avocado Toast with Egg',
                    calories: 450,
                    protein: 18,
                    carbs: 35,
                    fats: 28
                }
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Remove data:image/jpeg;base64, prefix if exists
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

        const prompt = "Analyze this food image and provide the estimated calories, protein (in grams), carbs, and fats. Return the response in JSON format only with the following keys: foodName, calories, protein, carbs, fats.";

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

        // Clean up response text in case Gemini adds markdown formatting
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!analysisData) {
            throw new Error('Failed to parse AI response');
        }

        return NextResponse.json({
            success: true,
            data: analysisData
        });
    } catch (error: any) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to analyze meal',
            error: error.message
        }, { status: 500 });
    }
}
