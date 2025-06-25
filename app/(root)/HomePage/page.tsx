import { Button } from "@/Components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import InterviewCard from "@/Components/InterviewCard";
import { getAllInterviews } from "@/lib/actions/auth.action";

const mockInterviews = [
  {
    id: 1,
    userid: "system",
    type: "Frontend",
    role: "Frontend Developer",
    level: "Intermediate",
    questions: [
      "Explain how React's virtual DOM works",
      "What are React hooks?",
      "Describe CSS positioning",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userid: "system",
    type: "System Design",
    role: "System Design Engineer",
    level: "Advanced",
    questions: [
      "Design a URL shortening service",
      "Design Instagram",
      "Design a chat application",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    userid: "system",
    type: "Behavioral",
    role: "Behavioral Interview",
    level: "Beginner",
    questions: [
      "Tell me about yourself",
      "Why do you want to work here?",
      "Describe a challenging situation",
    ],
    createdAt: new Date().toISOString(),
  },
];

const HomePage = async () => {
  const interviews = await getAllInterviews();
  const hasInterviews = interviews && interviews.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-900/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-8 max-w-3xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-primary-400 leading-tight mb-6">
                Get Interview Ready with AI-Powered Practice
              </h1>
              <p className="text-lg text-primary-100/80 leading-relaxed">
                Enhance your interview skills with personalized AI feedback and
                realistic mock interviews.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/robot.png"
                alt="AI Interview Assistant"
                width={400}
                height={400}
                className="rounded-2xl shadow-2xl shadow-primary-100/10 border border-primary-100/20 transition-all duration-300 shadow-lg hover:shadow-primary-100/25 cursor-pointer"
                priority
              />
            </div>
          </div>

          <Button
            asChild
            className="w-full md:w-auto self-start bg-gradient-to-r from-primary-100 to-primary-200 hover:opacity-90 text-black font-medium px-8 py-6 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-100/25"
          >
            <Link href="/Interview">Start Interview</Link>
          </Button>
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Your Interviews</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {hasInterviews ? (
            interviews.map((interview: any) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p className="text-primary-100/80">No interviews found.</p>
          )}
        </div>
      </section>

      {/* Available Interviews Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Available Interviews
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {mockInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
