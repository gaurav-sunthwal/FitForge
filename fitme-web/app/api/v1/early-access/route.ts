import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { earlyAccessUsers } from '@/lib/db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, name } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const origin = req.headers.get('origin') || 'https://fitme.com';

        // Store in DB and get ID (using onConflictDoUpdate to get the existing record if it exists)
        const [user] = await db.insert(earlyAccessUsers).values({
            email,
            name,
            updatedAt: new Date(),
        })
            .onConflictDoUpdate({
                target: earlyAccessUsers.email,
                set: { updatedAt: new Date() }
            })
            .returning();

        const downloadUrl = `${origin}/download/${user.id}`;

        // Send email via Resend
        await resend.emails.send({
            from: 'FitMe <onboarding@resend.dev>',
            to: email,
            subject: 'Your FitMe Early Access Download Link',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #000; font-size: 24px; font-weight: 800; text-transform: uppercase;">Welcome to the Evolution.</h1>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Thank you for joining FitMe Early Access! We've prepared a special build for you to test.
                    </p>
                    <div style="margin: 40px 0;">
                        <a href="${downloadUrl}" style="background-color: #2563eb; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
                            Download FitMe App
                        </a>
                    </div>
                    <p style="color: #999; font-size: 14px; line-height: 1.6;">
                        This link is unique to you. If the link doesn't work, copy and paste this into your browser:<br/>
                        ${downloadUrl}
                    </p>
                    <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                        <p style="color: #999; font-size: 12px;">
                            © ${new Date().getFullYear()} FitMe. All rights reserved.
                        </p>
                    </div>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Early access error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}
