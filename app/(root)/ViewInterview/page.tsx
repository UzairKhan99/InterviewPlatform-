"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Interview {
  id: number;
  userid: string;
  type: string;
  title: string;
  description: string;
  questions: string[];
  duration: string;
  difficulty: string;
  createdAt: string;
  coverImage: string;
}

const mockData: Interview[] = [
  {
    id: 3,
    userid: "system",
    type: "Behavioral",
    title: "Behavioral Interview",
    description: "Practice answering common behavioral questions",
    questions: [
      "Tell me about yourself",
      "Why do you want to work here?",
      "Describe a challenging situation",
    ],
    duration: "30 mins",
    difficulty: "Beginner",
    createdAt: new Date().toISOString(),
    coverImage: "/images/behavioral.jpg",
  },
  // You can add more interviews here
];

export default function ViewInterview() {
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    // TODO: Replace mockData with real fetch from Supabase in future
    setInterviews(mockData);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Your Interviews</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-800 hover:scale-[1.02] transition-transform duration-200"
          >
            <Image
              src={interview.coverImage}
              alt={interview.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-white">
              <h2 className="text-xl font-semibold">{interview.title}</h2>
              <p className="text-sm text-zinc-400">{interview.description}</p>
              <div className="mt-2 text-sm text-zinc-300">
                <p>
                  <strong>Type:</strong> {interview.type}
                </p>
                <p>
                  <strong>Difficulty:</strong> {interview.difficulty}
                </p>
                <p>
                  <strong>Duration:</strong> {interview.duration}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(interview.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 font-semibold">Questions:</p>
                <ul className="list-disc pl-5 text-zinc-400">
                  {interview.questions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
