import { initDB } from "@/lib/initDB"
import { NextResponse } from "next/server";

export const GET = async () => {
    const initializing = await initDB();
    if(!initializing) return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 });
    return NextResponse.json({ initializing });
}