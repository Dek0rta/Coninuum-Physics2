import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { z } from "zod";

const schema = z.object({
  slug: z.string(),
  quizScore: z.number().min(0).max(100),
  completed: z.boolean(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { slug, quizScore, completed } = parsed.data;

  // Upsert topic
  let topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic) {
    topic = await prisma.topic.create({
      data: {
        slug,
        category: "mechanics",
        order: 0,
        titleRu: slug,
        titleEn: slug,
        descRu: "",
        descEn: "",
      },
    });
  }

  const progress = await prisma.userProgress.upsert({
    where: { userId_topicId: { userId: session.user.id, topicId: topic.id } },
    create: {
      userId: session.user.id,
      topicId: topic.id,
      quizScore,
      completed,
      completedAt: completed ? new Date() : null,
    },
    update: {
      quizScore,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, progress });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    include: { topic: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ progress });
}
