import { Button } from "@/Components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/Components/InterviewCard";
import {
  getCurrentUser,
  getInterviewByUserId,
  getLatestInterview,
} from "@/lib/actions/auth.action";

const HomePage = async () => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterview] = await Promise.all([
    getInterviewByUserId(user?.data?.id!),
    getLatestInterview(user?.data?.id!, 1),
  ]);

  const hasPastInterviews = userInterviews && userInterviews.length > 0;
  const hasUpcomingInterview = latestInterview && latestInterview.length > 0;

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
            <Link href="/sign-up">Start Interview</Link>
          </Button>
        </div>
      </section>

      {/* Past Interviews Section */}
      <section className="flex flex-col gap-2">
        <h2>Your Interviews</h2>
        <div className="interview-section flex flex-row gap-2">
          {hasPastInterviews ? (
            userInterviews?.map((interview: any) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p className="text-primary-100/80">You have no interviews yet</p>
          )}
        </div>
      </section>

      {/* Available Interviews Section */}
      <section className="interview-section">
        <h2>Take an Interview</h2>
        <div className="interview-section flex flex-row gap-2">
          {hasUpcomingInterview ? (
            latestInterview?.map((interview: any) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p className="text-primary-100/80">
              There are no new Interviews Available{" "}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
