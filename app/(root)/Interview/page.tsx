import Agent from "@/Components/Agent";
import React from "react";
import { getCurrentUserServer } from "@/lib/actions/auth.action";

const InterviewPage = async () => {
  const user = await getCurrentUserServer();

  return (
    <div>
      Interview Generation
      <Agent
        userName={user?.profile?.name || user?.email || "User"}
        userId={user?.id || ""}
        type="generated"
      />
    </div>
  );
};

export default InterviewPage;
