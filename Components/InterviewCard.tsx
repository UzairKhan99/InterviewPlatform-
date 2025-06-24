import { getRandomInterviewCover } from "@/constants";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

// InterviewCard component displays interview details in a card format
const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: any) => {
  const feedback = null as any;
  // Normalize interview type to show "Mixed" if it contains "mix" case-insensitive
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  // Format date to readable format (e.g. "Mar 15, 2024")
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="relative flex flex-col border border-primary-100/20 p-6 rounded-xl w-[350px] h-[400px] shadow-lg hover:shadow-xl transition-all duration-300 bg-black/80 backdrop-blur-sm m-4 cursor-pointer hover:shadow-primary-100/50 hover:border-primary-100/40">
      {/* Interview type badge */}
      <div className="absolute top-0 right-0">
        <span className="bg-primary-100 text-black px-4 py-1.5 rounded-bl-xl rounded-tr-xl text-sm font-semibold">
          {normalizedType}
        </span>
      </div>

      {/* Company logo/avatar */}
      <div className="flex justify-center mt-2">
        <Image
          src={getRandomInterviewCover()}
          alt="Company logo"
          width={90}
          height={90}
          className="rounded-full border-2 border-primary-100/20 shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Interview role title */}
      <h3 className="text-center mt-5 text-xl font-bold text-primary-100">
        {role} Interview
      </h3>

      {/* Interview metadata */}
      <div className="flex justify-around mt-5 text-sm text-primary-100/70">
        <div className="flex items-center gap-1.5">
          <span>📅</span>
          {formattedDate}
        </div>
        <div className="flex items-center gap-1.5">
          <span>⭐</span>
          {feedback?.totalScore || "---"}/100
        </div>
      </div>

      {/* Interview status/feedback */}
      <p className="mt-5 text-center text-primary-100/60 text-sm leading-relaxed px-2">
        {feedback?.finalAssessment ||
          "You haven't taken this interview yet. Take it now to improve your skills."}
      </p>

      {/* Action button */}
      <div className="flex justify-center mt-6">
        <Link
          href={`${
            feedback
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}`
          }`}
        >
          {feedback ? (
            <Button className="w-full bg-gradient-to-r from-primary-100 to-primary-200 hover:opacity-90 text-black font-medium px-6 py-5 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-100/25 hover:scale-[1.02]">
              View Feedback
            </Button>
          ) : (
            <Button className="w-full bg-gradient-to-r from-primary-100 to-primary-200 hover:opacity-90 text-black font-medium px-6 py-5 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-100/25 hover:scale-[1.02]">
              View Interview
            </Button>
          )}
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
