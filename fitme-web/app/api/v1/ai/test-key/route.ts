import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_MODEL } from '@/lib/ai-config';

export async function POST(request: Request) {
    try {
        const { apiKey } = await request.json();

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                message: 'API key is required'
            }, { status: 400 });
        }

        console.log(`Testing API key with model: ${GEMINI_MODEL}`);
        console.log('API key starts with:', apiKey.substring(0, 10) + '...');

        // Test the API key with a simple request
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        console.log('Sending test request to Gemini API...');
        const result = await model.generateContent('Hello, respond with exactly "API key works!" and nothing else.');
        const responseText = result.response.text();

        console.log('API key test successful! Response:', responseText);

        // If we got here, the API key works
        return NextResponse.json({
            success: true,
            message: 'API key is valid',
            testResponse: responseText,
            modelUsed: GEMINI_MODEL
        });
    } catch (error: any) {
        console.error('API Key Test Error:', error);

        // Extract specific error details
        const errorDetails = {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            name: error.name,
            model: GEMINI_MODEL
        };

        console.error('Detailed error info:', JSON.stringify(errorDetails, null, 2));

        // Check for specific error messages
        if (error.message?.includes('API_KEY_INVALID') ||
            error.message?.includes('invalid') ||
            error.status === 400) {
            return NextResponse.json({
                success: false,
                message: 'Invalid API key. Please check your key and try again.',
                details: error.message,
                modelUsed: GEMINI_MODEL
            }, { status: 400 });
        }

        if (error.status === 403 || error.message?.includes('403')) {
            return NextResponse.json({
                success: false,
                message: 'API key does not have permission. Please enable the Generative Language API in Google Cloud Console.',
                details: error.message,
                modelUsed: GEMINI_MODEL
            }, { status: 403 });
        }

        if (error.message?.includes('model not found') || error.message?.includes('404')) {
            return NextResponse.json({
                success: false,
                message: `Model '${GEMINI_MODEL}' not found. Please check if this model is available for your API key.`,
                details: error.message,
                modelUsed: GEMINI_MODEL
            }, { status: 404 });
        }

        return NextResponse.json({
            success: false,
            message: 'Failed to validate API key',
            error: error.message,
            details: error.toString(),
            modelUsed: GEMINI_MODEL
        }, { status: 500 });
    }
}
