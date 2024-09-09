import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";

export async function GET() {
  const filePath = join(process.cwd(), "src", "data", "financialData.json");
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json(
      { error: `Failed to load data: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
