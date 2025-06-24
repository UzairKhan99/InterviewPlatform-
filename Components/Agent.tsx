import React from "react";
import Image from "next/image";
const Agent = ({
  username,
  userId,
  type,
}: {
  username: string;
  userId: string;
  type: string;
}) => {
  const isSpeaking = true;
  const message = ["What is your name?", "What is your age?"];

  const lastMessage = message[message.length - 1];
  return (
    <div className="flex flex-row gap-12 w-full max-w-4xl mx-auto p-8">
      <div className="flex flex-row gap-12 w-full justify-center">
        <div
          className={`flex items-center gap-6 p-6 rounded-2xl bg-black/90 backdrop-blur-lg border-2 ${
            isSpeaking
              ? "border-primary-100 shadow-[0_0_30px_rgba(156,163,175,0.3)]"
              : "border-primary-100/20"
          } transition-all duration-500 w-[350px] h-[220px] hover:scale-105`}
        >
          <div className="relative">
            <Image
              src="/interview_robot.png"
              alt="avatar"
              width={80}
              height={80}
              className={`rounded-full object-cover border-2 ${
                isSpeaking
                  ? "border-primary-100 shadow-[0_0_15px_rgba(156,163,175,0.5)]"
                  : "border-primary-100/20"
              } transition-all duration-500`}
            />
            {isSpeaking && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3
              className={`text-xl font-bold ${
                isSpeaking ? "text-primary-100" : "text-primary-100/70"
              } transition-colors duration-500`}
            >
              AI Interviewer
            </h3>
            <p className="text-sm text-primary-100/60 animate-pulse">
              {lastMessage}
            </p>
            {isSpeaking && (
              <span className="text-sm text-primary-100/60 animate-pulse">
                Speaking...
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex items-center gap-6 p-6 rounded-2xl bg-black/90 backdrop-blur-lg border-2 ${
            !isSpeaking
              ? "border-primary-100 shadow-[0_0_30px_rgba(156,163,175,0.3)]"
              : "border-primary-100/20"
          } transition-all duration-500 w-[350px] h-[220px] hover:scale-105`}
        >
          <div className="relative">
            <Image
              src="/user-avatar.png"
              alt="user-avatar"
              width={80}
              height={80}
              className={`rounded-full object-cover border-2 ${
                !isSpeaking
                  ? "border-primary-100 shadow-[0_0_15px_rgba(156,163,175,0.5)]"
                  : "border-primary-100/20"
              } transition-all duration-500`}
            />
            {!isSpeaking && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3
              className={`text-xl font-bold ${
                !isSpeaking ? "text-primary-100" : "text-primary-100/70"
              } transition-colors duration-500`}
            >
              {username}
            </h3>
            <p className="text-sm text-primary-100/60 animate-pulse">
              {lastMessage}
            </p>
            {!isSpeaking && (
              <span className="text-sm text-primary-100/60 animate-pulse">
                Speaking...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agent;
