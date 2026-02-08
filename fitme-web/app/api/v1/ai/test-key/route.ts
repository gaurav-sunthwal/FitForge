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

        console.log('Testing API key:', apiKey.substring(0, 10) + '...');

        // Test the API key with a simple request
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        console.log('Sending test request to Gemini API...');
        const result = await model.generateContent('Hello, respond with "API key works!"');
        const responseText = result.response.text();

        console.log('API key test successful!');

        // If we got here, the API key works
        return NextResponse.json({
            success: true,
            message: 'API key is valid',
            testResponse: responseText
        });
    } catch (error: any) {
        console.error('API Key Test Error:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            name: error.name
        });

        // Check for specific error messages
        if (error.message?.includes('API_KEY_INVALID') ||
            error.message?.includes('invalid') ||
            error.status === 400) {
            return NextResponse.json({
                success: false,
                message: 'Invalid API key. Please check your key and try again.',
                details: error.message
            }, { status: 400 });
        }

        if (error.status === 403) {
            return NextResponse.json({
                success: false,
                message: 'API key does not have permission. Please enable the Generative Language API in Google Cloud Console.',
                details: error.message
            }, { status: 403 });
        }

        return NextResponse.json({
            success: false,
            message: 'Failed to validate API key',
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
}
