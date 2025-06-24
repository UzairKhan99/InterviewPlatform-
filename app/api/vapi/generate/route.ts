import { getRandomInterviewCover } from "@/constants";
import { google } from "@ai-sdk/google"; // Make sure this is installed
import { generateText } from "ai"; // Assuming you're using ai-sdk
import supabase from "@/config/supabaseClient";

export async function GET() {
  return Response.json({ success: true, data: "Thank You" }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { type, role, level, techstack, amount, userID } = await req.json();

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you! <3`,
    });

    // {
    //   ("For Storing in backend ");
    // }

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userid: userID,
      finalized: true,

      createdAt: new Date().toISOString(),
    };
    // Use Supabase syntax instead of Firebase
    const { data, error } = await supabase
      .from("interviews")
      .insert(interview)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return Response.json(
        { success: false, data: "Failed to save interview" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, data: "Interview created successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { success: false, data: "Internal Server Error" },
      { status: 500 }
    );
  }
}
