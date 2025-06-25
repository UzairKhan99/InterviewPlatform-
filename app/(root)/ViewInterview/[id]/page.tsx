import { getAllInterviews } from "@/lib/actions/auth.action";

export default async function ViewInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const interviews = await getAllInterviews();
  const interview = interviews?.find((i: any) => String(i.id) === id);

  if (!interview) {
    return <div className="text-white p-8">Interview not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">
        {interview.role || "Interview"}
      </h1>
      <div className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-800">
        <div className="p-6 text-white">
          <h2 className="text-2xl font-semibold mb-2">{interview.role}</h2>
          <div className="mb-4 text-sm text-zinc-300">
            {interview.type && (
              <p>
                <strong>Type:</strong> {interview.type}
              </p>
            )}
            {interview.level && (
              <p>
                <strong>Level:</strong> {interview.level}
              </p>
            )}
            {interview.createdAt && (
              <p>
                <strong>Created:</strong>{" "}
                {new Date(interview.createdAt).toLocaleDateString()}
              </p>
            )}
            {interview.userId && (
              <p>
                <strong>User ID:</strong> {interview.userId}
              </p>
            )}
          </div>
          {interview.questions && Array.isArray(interview.questions) && (
            <>
              <p className="mt-2 font-semibold">Questions:</p>
              <ul className="list-disc pl-5 text-zinc-400">
                {interview.questions.map((q: string, idx: number) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
