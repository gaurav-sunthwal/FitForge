import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
    console.log("[API] Invitation request received");
    try {
        const body = await req.json();
        const { referrerId, inviteCode: providedCode } = body;
        console.log("[API] Referrer ID:", referrerId, "| Provided Code:", providedCode);

        if (!referrerId) {
            console.error("[API] Missing referrerId");
            return NextResponse.json({ error: "Referrer ID is required" }, { status: 400 });
        }

        // Use provided code or generate a random one
        const inviteCode = providedCode || Math.random().toString(36).substring(2, 10).toUpperCase();
        console.log("[API] Using Invite Code:", inviteCode);

        try {
            // Check if code already exists if it's a provided code
            if (providedCode) {
                const existing = await db.select().from(invitations).where(eq(invitations.inviteCode, inviteCode)).limit(1);
                if (existing.length > 0) {
                    // If it already exists, we don't need to create it again (e.g. user shared twice)
                    return NextResponse.json({
                        success: true,
                        inviteCode: existing[0].inviteCode,
                        inviteUrl: `https://fitme-gaurav.vercel.app/invite/${existing[0].inviteCode}`
                    });
                }
            }

            const [invitation] = await db.insert(invitations).values({
                referrerId,
                inviteCode,
                status: 'pending'
            }).returning();

            console.log("[API] Invitation saved to DB:", invitation.id);

            return NextResponse.json({
                success: true,
                inviteCode: invitation.inviteCode,
                inviteUrl: `https://fitme-gaurav.vercel.app/invite/${invitation.inviteCode}`
            });
        } catch (dbError: any) {
            console.error("[API] Database Error:", dbError.message);
            if (dbError.message.includes("invalid input syntax for type uuid")) {
                return NextResponse.json({ error: "Invalid User ID format. Must be a valid UUID." }, { status: 400 });
            }
            throw dbError;
        }

    } catch (error: any) {
        console.error("Error creating invitation:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
