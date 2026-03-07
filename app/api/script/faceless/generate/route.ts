// // app/api/projects/script/generate/route.ts
// // This is a reference implementation showing the expected server-side flow.

// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth-server";
// import { prisma } from "@/db/index";
// import { headers } from "next/headers";

// export async function POST(req: NextRequest) {
//   // 1. Auth check
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session?.user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const body = await req.json();
//   const { projectId, title, language, prompt, duration } = body;

//   if (!title || !prompt || !language) {
//     return NextResponse.json(
//       { error: "Missing required fields" },
//       { status: 400 },
//     );
//   }

//   // 2. Check user's generation limit (if applicable)
//   // const user = await prisma.user.findUnique({ where: { id: session.user.id } });
//   // if (user.scriptGenerations >= LIMIT) return 429...

//   let project;
//   let version = 1;

//   if (projectId) {
//     // Existing project — increment version
//     project = await prisma.project.findFirst({
//       where: { id: projectId, userId: session.user.id },
//     });

//     if (!project) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 });
//     }

//     version = (project.scriptVersion ?? 0) + 1;
//   } else {
//     // New project — create it
//     project = await prisma.project.create({
//       data: {
//         title,
//         language,
//         prompt,
//         duration,
//         userId: session.user.id,
//         scriptVersion: 1,
//         status: "draft",
//       },
//     });
//   }

//   // 3. Generate script via your AI provider (OpenAI, Anthropic, etc.)
//   // const script = await generateScriptWithAI({ prompt, language, duration });
//   // --- MOCK for reference ---
//   const script = `[Generated script for "${title}" in ${language}]\n\nThis is a sample script about: ${prompt}.\n\nVersion ${version} — Duration: ${duration}`;

//   // 4. Save script version to DB
//   await prisma.scriptVersion.create({
//     data: {
//       projectId: project.id,
//       version,
//       content: script,
//     },
//   });

//   // 5. Update project's latest script
//   await prisma.project.update({
//     where: { id: project.id },
//     data: {
//       script,
//       scriptVersion: version,
//       prompt,
//     },
//   });

//   return NextResponse.json({
//     projectId: project.id,
//     script,
//     version,
//   });
// }
