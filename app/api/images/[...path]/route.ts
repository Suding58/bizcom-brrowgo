// app/api/images/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      ...params.path
    );

    try {
      const stats = await stat(filePath);
      if (stats.isFile()) {
        const stream = createReadStream(filePath);
        return new NextResponse(stream as any, {
          headers: {
            "Content-Type": "image/*",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } else {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    } catch {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
