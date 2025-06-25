"use client";

import Agent from "@/Components/Agent";
import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/Components/ui/button";

const InterviewPage = () => {
  const [user, setUser] = useState<any>(null);
  const [showAgent, setShowAgent] = useState(false);
  const [interviewData, setInterviewData] = useState({
    role: "",
    type: "",
    level: "",
    amount: "",
    techstack: [] as string[],
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (userData.success) {
        setUser(userData.data);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setInterviewData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTechstackChange = (value: string) => {
    const techArray = value
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech);
    setInterviewData((prev) => ({
      ...prev,
      techstack: techArray,
    }));
  };

  const handleStartInterview = () => {
    if (!interviewData.role || !interviewData.type || !interviewData.level) {
      alert("Please fill in all required fields");
      return;
    }
    setShowAgent(true);
  };

  if (showAgent) {
    return (
      <div>
        <Agent
          userName={user?.profile?.name || user?.email || "User"}
          userId={user?.id || ""}
          type="generated"
          role={interviewData.role}
          level={interviewData.level}
          amount={interviewData.amount}
          techstack={interviewData.techstack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-900/10 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Setup Your Interview
        </h1>

        <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-primary-100/20">
          <div className="space-y-6">
            {/* Role */}
            <div>
              <label className="block text-white font-medium mb-2">
                Role * <span className="text-red-400">Required</span>
              </label>
              <input
                type="text"
                value={interviewData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="e.g., Frontend Developer, Backend Engineer"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-primary-100 focus:outline-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-white font-medium mb-2">
                Type * <span className="text-red-400">Required</span>
              </label>
              <select
                value={interviewData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-primary-100 focus:outline-none"
              >
                <option value="">Select Interview Type</option>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="System Design">System Design</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Full Stack">Full Stack</option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-white font-medium mb-2">
                Level * <span className="text-red-400">Required</span>
              </label>
              <select
                value={interviewData.level}
                onChange={(e) => handleInputChange("level", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-primary-100 focus:outline-none"
              >
                <option value="">Select Experience Level</option>
                <option value="Beginner">Beginner (0-2 years)</option>
                <option value="Intermediate">Intermediate (2-5 years)</option>
                <option value="Advanced">Advanced (5+ years)</option>
                <option value="Senior">Senior (8+ years)</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-white font-medium mb-2">
                Duration (optional)
              </label>
              <select
                value={interviewData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-primary-100 focus:outline-none"
              >
                <option value="">Select Duration</option>
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="45 minutes">45 minutes</option>
                <option value="60 minutes">60 minutes</option>
              </select>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-white font-medium mb-2">
                Tech Stack (optional)
              </label>
              <input
                type="text"
                onChange={(e) => handleTechstackChange(e.target.value)}
                placeholder="e.g., React, Node.js, Python, MongoDB (comma separated)"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-primary-100 focus:outline-none"
              />
              <p className="text-gray-400 text-sm mt-1">
                Enter technologies separated by commas
              </p>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartInterview}
              className="w-full bg-gradient-to-r from-primary-100 to-primary-200 hover:opacity-90 text-black font-medium px-8 py-6 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-100/25"
            >
              Start Interview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
