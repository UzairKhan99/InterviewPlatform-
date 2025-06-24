import Agent from "@/Components/Agent";
import React from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
const InterviewPage = async () => {
  const user = await getCurrentUser();

  return (
    <div>
      Interview Generation
      <Agent
        userName={(user as any)?.name}
        userId={(user as any)?.id}
        type="generated"
      />
    </div>
  );
};

export default InterviewPage;
