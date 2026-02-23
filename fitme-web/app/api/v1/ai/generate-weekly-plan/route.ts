import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';
import { users, workoutPlans } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';
import { GEMINI_MODEL } from '@/lib/ai-config';

export async function POST(request: Request) {
    try {
        const userId = await getUserId();

        // Fetch user data
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                profile: true,
                goals: true,
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const apiKey = user.geminiApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                message: 'No API key configured.',
                requiresApiKey: true
            }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        const { profile, goals } = user;

        const prompt = `
            Generate a comprehensive weekly workout plan (7 days, Monday to Sunday) based on the following user data:
            - Age: ${profile?.age || 'Not provided'}
            - Gender: ${profile?.gender || 'Not provided'}
            - Weight: ${profile?.weight || 'Not provided'} kg
            - Height: ${profile?.height || 'Not provided'} cm
            - Calorie Target: ${goals?.calorieTarget || 'Default'} kcal
            - Fitness Objective: ${goals?.fitnessGoal || 'Maintain/General Fitness'}

            Ensure the workout intensity, exercise selection, and volume align with the Fitness Objective (e.g., more compound lifts for "gain", higher metabolic stress or intensity for "lose").

            Return ONLY a JSON object with the following structure:
            {
                "weekPlan": {
                    "Monday": { "target": "Muscles", "exercises": [...] },
                    "Tuesday": { "target": "Muscles", "exercises": [...] },
                    ...
                    "Sunday": { "target": "Rest Day", "exercises": [] }
                }
            }
            
            Exercise structure:
            {
                "name": "Exercise Name",
                "sets": number,
                "reps": "number or range",
                "instructions": "Brief cue",
                "icon": "Ionicons name"
            }
            
            Provide 4-6 exercises for active days. If it's a rest day, leave exercises empty and target as "Rest Day".
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const weeklyPlan = jsonMatch ? JSON.parse(jsonMatch[0].replace(/```json|```/g, '')) : null;

        if (!weeklyPlan) {
            throw new Error('Failed to parse AI response');
        }

        // Save to database
        await db.insert(workoutPlans).values({
            userId: userId,
            plan: JSON.stringify(weeklyPlan),
        }).onConflictDoUpdate({
            target: workoutPlans.userId,
            set: {
                plan: JSON.stringify(weeklyPlan),
                updatedAt: new Date(),
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Weekly workout plan generated and saved',
            data: weeklyPlan
        });

    } catch (error: any) {
        console.error('Weekly Workout Generation Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to generate weekly plan',
            error: error.message
        }, { status: 500 });
    }
}
