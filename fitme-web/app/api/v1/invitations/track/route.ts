import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { inviteCode, action } = await req.json(); // action: 'clicked' or 'downloaded'

        if (!inviteCode || !action) {
            return NextResponse.json({ error: "Invite code and action are required" }, { status: 400 });
        }

        const [invitation] = await db.select().from(invitations).where(eq(invitations.inviteCode, inviteCode));

        if (!invitation) {
            return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
        }

        // Only update if the status is "higher" in the conversion funnel
        const statusMap: Record<string, number> = {
            'pending': 0,
            'clicked': 1,
            'downloaded': 2
        };

        if (statusMap[action] > statusMap[invitation.status || 'pending']) {
            await db.update(invitations)
                .set({
                    status: action,
                    updatedAt: new Date()
                })
                .where(eq(invitations.inviteCode, inviteCode));
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error tracking invitation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
