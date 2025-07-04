"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId?: string;
  type: string;
  questions?: string[];
  // Interview data props
  role?: string;
  level?: string;
  amount?: string;
  techstack?: string[];
}

const Agent = ({
  userName,
  userId,
  interviewId,
  type,
  questions,
  role,
  level,
  amount,
  techstack,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Function to save interview data after call ends
  const saveInterviewToDatabase = async () => {
    if (!role || !type || !level || !userId) {
      console.log("Missing interview data, skipping save");
      return;
    }

    try {
      const response = await fetch("/api/save-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          type: type,
          level,
          amount,
          userId,
          techstack,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Interview data saved successfully:", result.data);
      } else {
        console.error("Failed to save interview data:", result.error);
      }
    } catch (error) {
      console.error("Error saving interview data:", error);
    }
  };

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = async () => {
      setCallStatus(CallStatus.FINISHED);
      // Save interview data when call ends
      await saveInterviewToDatabase();
    };
    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error("VAPI Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [role, type, level, amount, userId, techstack]); // Add dependencies

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
    if (callStatus === CallStatus.FINISHED) {
      // Add a small delay before redirecting to ensure data is saved
      setTimeout(() => {
        router.push("/HomePage");
      }, 2000);
    }
  }, [messages, callStatus, router]);

  // Clear error when call status changes
  useEffect(() => {
    if (callStatus !== CallStatus.INACTIVE) {
      setError(null);
    }
  }, [callStatus]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        throw new Error("This feature is only available in the browser");
      }

      // Check if we're on HTTPS (required for media devices)
      if (
        window.location.protocol !== "https:" &&
        window.location.hostname !== "localhost"
      ) {
        throw new Error(
          "Microphone access requires HTTPS. Please use a secure connection."
        );
      }

      // Check if navigator.mediaDevices is available
      if (!navigator.mediaDevices) {
        // Check if it's an older browser that uses the deprecated API
        if (
          (navigator as any).getUserMedia ||
          (navigator as any).webkitGetUserMedia ||
          (navigator as any).mozGetUserMedia ||
          (navigator as any).msGetUserMedia
        ) {
          throw new Error(
            "Your browser uses an older version of the Media API. Please update your browser or use a modern browser like Chrome, Firefox, or Safari."
          );
        }
        throw new Error(
          "Media devices are not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari."
        );
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Microphone access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari."
        );
      }

      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (permissionError: any) {
        if (permissionError.name === "NotAllowedError") {
          throw new Error(
            "Microphone permission denied. Please allow microphone access in your browser settings and try again."
          );
        } else if (permissionError.name === "NotFoundError") {
          throw new Error(
            "No microphone found. Please connect a microphone and try again."
          );
        } else if (permissionError.name === "NotReadableError") {
          throw new Error(
            "Microphone is already in use by another application. Please close other applications using the microphone and try again."
          );
        } else {
          throw new Error(
            `Microphone access failed: ${permissionError.message}`
          );
        }
      }

      // Check if VAPI token is available
      if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
        throw new Error(
          "VAPI configuration is missing. Please check your environment variables."
        );
      }

      if (type === "generate") {
        if (!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID) {
          throw new Error(
            "VAPI workflow ID is missing. Please check your environment variables."
          );
        }
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
          variableValues: { username: userName, userid: userId },
        });
      } else {
        const formattedQuestions =
          questions?.map((q) => `- ${q}`).join("\n") || "";
        await vapi.start(interviewer, {
          variableValues: { questions: formattedQuestions },
        });
      }
      setCallStatus(CallStatus.ACTIVE);
    } catch (err) {
      console.error("Call failed:", err);
      setCallStatus(CallStatus.INACTIVE);
      // Show user-friendly error message
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start call. Please try again."
      );
    }
  };

  const handleDisconnect = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);
    router.push("/HomePage");
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto p-8">
      {/* Call Controls */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          {type === "generate"
            ? "AI Interview Generation"
            : "Interview Session"}
        </h2>

        {/* Call Status */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-3 h-3 rounded-full ${
              callStatus === CallStatus.INACTIVE
                ? "bg-gray-500"
                : callStatus === CallStatus.CONNECTING
                ? "bg-yellow-500 animate-pulse"
                : callStatus === CallStatus.ACTIVE
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span className="text-white/80 text-sm">
            {callStatus === CallStatus.INACTIVE && "Ready to start"}
            {callStatus === CallStatus.CONNECTING && "Connecting..."}
            {callStatus === CallStatus.ACTIVE && "Call in progress"}
            {callStatus === CallStatus.FINISHED && "Call ended"}
          </span>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-400 font-medium">Error</span>
            </div>
            <p className="text-red-300 text-sm mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 text-xs mt-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Call Buttons */}
        <div className="flex gap-4">
          {callStatus === CallStatus.INACTIVE && (
            <button
              onClick={handleCall}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Start Interview
            </button>
          )}

          {callStatus === CallStatus.CONNECTING && (
            <button
              disabled
              className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 animate-spin"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Connecting...
            </button>
          )}

          {callStatus === CallStatus.ACTIVE && (
            <button
              onClick={handleDisconnect}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              End Call
            </button>
          )}
        </div>
      </div>

      {/* Participants */}
      <div className="flex flex-row gap-8 w-full justify-center">
        {/* AI Interviewer */}
        <div
          className={`flex items-center gap-6 p-6 rounded-2xl bg-black/90 backdrop-blur-lg border-2 ${
            isSpeaking
              ? "border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.3)]"
              : "border-gray-600"
          } transition-all duration-500 w-[350px] h-[220px] hover:scale-105`}
        >
          <div className="relative">
            <Image
              src="/interview_robot.png"
              alt="AI Interviewer"
              width={80}
              height={80}
              className={`rounded-full object-cover border-2 ${
                isSpeaking
                  ? "border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                  : "border-gray-600"
              } transition-all duration-500`}
            />
            {isSpeaking && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3
              className={`text-xl font-bold ${
                isSpeaking ? "text-green-400" : "text-white/70"
              } transition-colors duration-500`}
            >
              AI Interviewer
            </h3>
            <p className="text-sm text-white/60 max-w-[200px] truncate">
              {lastMessage || "Ready to start the interview"}
            </p>
            {isSpeaking && (
              <span className="text-sm text-green-400 animate-pulse">
                Speaking...
              </span>
            )}
          </div>
        </div>

        {/* User */}
        <div
          className={`flex items-center gap-6 p-6 rounded-2xl bg-black/90 backdrop-blur-lg border-2 ${
            !isSpeaking && callStatus === CallStatus.ACTIVE
              ? "border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.3)]"
              : "border-gray-600"
          } transition-all duration-500 w-[350px] h-[220px] hover:scale-105`}
        >
          <div className="relative">
            <Image
              src="/user-avatar.png"
              alt="User"
              width={80}
              height={80}
              className={`rounded-full object-cover border-2 ${
                !isSpeaking && callStatus === CallStatus.ACTIVE
                  ? "border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                  : "border-gray-600"
              } transition-all duration-500`}
            />
            {!isSpeaking && callStatus === CallStatus.ACTIVE && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3
              className={`text-xl font-bold ${
                !isSpeaking && callStatus === CallStatus.ACTIVE
                  ? "text-blue-400"
                  : "text-white/70"
              } transition-colors duration-500`}
            >
              {userName || "User"}
            </h3>
            <p className="text-sm text-white/60 max-w-[200px] truncate">
              {callStatus === CallStatus.ACTIVE
                ? "Listening..."
                : "Waiting to start"}
            </p>
            {!isSpeaking && callStatus === CallStatus.ACTIVE && (
              <span className="text-sm text-blue-400 animate-pulse">
                Ready to speak
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Display */}
      {messages.length > 0 && (
        <div className="w-full max-w-4xl bg-black/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Conversation</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="flex gap-2">
                <span
                  className={`text-sm font-medium ${
                    message.role === "assistant"
                      ? "text-green-400"
                      : "text-blue-400"
                  }`}
                >
                  {message.role === "assistant" ? "AI" : "You"}:
                </span>
                <span className="text-sm text-white/80">{message.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Agent;
