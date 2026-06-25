import { NextRequest } from "next/server";

// Define message structure
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CopilotPayload {
  messages: Message[];
  currentView: string;
  userRole: string;
  isOnboarding: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: CopilotPayload = await req.json();
    const { messages, currentView, userRole, isOnboarding } = body;

    // Get the user's latest query
    const userMessage = messages?.[messages.length - 1]?.content || "";
    const query = userMessage.toLowerCase();

    // Generate response text based on keywords and context
    let responseText = "";

    // 1. Keyword-based matching
    if (query.includes("onboarding") || query.includes("checklist") || query.includes("pre-joining")) {
      responseText = `As a new joiner (Sarah Jenkins, Senior Cloud Engineer), your onboarding is divided into phases. Currently, you are in the **Pre-joining** phase. You have completed tasks like signing the offer letter and hardware preference survey, but you still need to **Submit Tax & Bank Details** by June 28. On **Day 1**, IT will set up your credentials, and you'll attend an HR Briefing.`;
    } else if (query.includes("buddy") || query.includes("alex")) {
      responseText = `Your assigned onboarding buddy is **Alex Rivera (Senior Developer)**. He is here to help you get acclimated to the Platform Engineering team, configure your development environment, and introduce you to key stakeholders. You can find his contact info in the Team tab or Relocation support drawer!`;
    } else if (query.includes("manager") || query.includes("marcus")) {
      responseText = `Your reporting manager is **Marcus Aurelius (Engineering Director)**. He oversees the Platform Engineering team. In your Week 1 onboarding, you have a scheduled 1-on-1 with him to discuss team alignment, first-month objectives, and your key deliverables.`;
    } else if (query.includes("clock") || query.includes("attendance") || query.includes("selfie")) {
      responseText = `To log your working hours, navigate to the **Clock** (Attendance) tab. You can clock in by uploading a selfie verification. WorkFlow automatically verifies your geolocation coordinates and validates your IP address. Once clocked in, your active working time will track in real time, and you can clock out at the end of the day.`;
    } else if (query.includes("leave") || query.includes("offtime") || query.includes("sick") || query.includes("vacation")) {
      responseText = `You can manage your offtime in the **Leave** tab. As an employee, you have 14 casual leave days left this cycle (with 6 used and 3 pending). If you switch to the **Manager** or **HR** role using the Role Switcher at the top, you can access the leave approval queue to review and sign off on pending team requests.`;
    } else if (query.includes("payroll") || query.includes("salary") || query.includes("payslip") || query.includes("tax")) {
      responseText = `Payslips and compliance forms are managed in the **Payroll & Compliance** dashboard (under HR or Admin views). Your detailed payslips break down base salary, HRA, and special allowances, along with statutory deductions like PF/ESI for India or tax withholdings for the US. You can also download PDF versions and statutory tax sheets.`;
    } else if (query.includes("points") || query.includes("contribution") || query.includes("leaderboard")) {
      responseText = `WorkFlow features a gamified **Contributions** system. You earn points by completing self-initiated tasks, process improvements, or taking on assigned team items. You are currently ranked **#4** on the leaderboard with **340 points** accumulated. Check out the leaderboard or claim new items under the 'Points' tab!`;
    } else if (query.includes("goals") || query.includes("okr") || query.includes("performance") || query.includes("review")) {
      responseText = `Your goals (OKRs) are visible under the **Growth** (Performance) tab. You have active OKRs including 'Standardize Kubernetes meshes' (85% completed) and 'Author SOC2 compliance documentation' (70% completed). Annual and quarterly performance reviews can be executed by managers in this section as well.`;
    } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      responseText = `Hello! I am your WorkFlow Copilot, your personalized AI HR Assistant. I am context-aware and know that you are currently viewing the **${currentView}** tab as an **${userRole}** ${isOnboarding ? "new joiner in onboarding" : "employee"}. How can I assist you with your HR tasks today?`;
    } else {
      // 2. Context-aware fallback responses
      if (isOnboarding) {
        responseText = `I see you are currently in the **Onboarding** flow. You can review your onboarding checklist, read welcome messages from engineering director Marcus Aurelius, or check relocation support tickets. Let me know if you have questions about onboarding buddy Alex Rivera or pre-joining checklist tasks!`;
      } else {
        switch (currentView) {
          case "Attendance":
            responseText = `You are on the **Attendance** (Clock) page. You can clock in using selfie authentication, view today's active shift time, check overtime hours, or review shift calendar schedules. Privileged roles like Manager/HR can inspect team exceptions here.`;
            break;
          case "Performance":
            responseText = `You are on the **Performance** (Growth) tab. You can track active OKR achievements (currently averaging 78%), review peer feedback, or inspect quarterly ratings, strengths, and recommendations.`;
            break;
          case "Training":
            responseText = `You are on the **Training** (Learn) tab. There are several mandatory and optional courses assigned to you, such as SOC2 and GDPR compliance courses. Completing all modules will automatically issue your certificate of completion.`;
            break;
          case "Contributions":
            responseText = `You are on the **Contributions** (Points) page. Here you can browse and claim new organizational tasks, view the leaderboard standings (you are ranked #4 with 340 points), or submit evidence for self-initiated impact awards.`;
            break;
          case "Team":
            responseText = `You are on the **Team** tab. This view shows your team roster, organizational relationships, and reporting structure. Managers can use this workspace to coordinate direct reports' goals and leave approvals.`;
            break;
          case "Leave":
            responseText = `You are on the **Leave** tab. You can apply for time off (casual, sick, comp-off, or LWP) or track active requests. Managers can review pending team requests and approve or reject them with optional comments.`;
            break;
          case "Recruitment":
            responseText = `You are on the **Recruitment** (Hire) workspace. This workspace is tailored for HR specialists and Administrators to track the candidate hiring pipeline, schedule interviews, and manage job postings.`;
            break;
          case "Analytics":
            responseText = `You are on the **Analytics** (Stats) dashboard. privileged roles can view org-wide metrics, department distributions, and headcount trends. Employees can review their personal attendance history.`;
            break;
          case "Announcements":
            responseText = `You are on the **Announcements** page. HR/Admin can author company-wide announcements targeted by department/location, and track views, likes, and policy acknowledgements.`;
            break;
          default:
            responseText = `I am your WorkFlow Copilot, currently observing that you are on the **${currentView}** tab as a **${userRole}** user. I can guide you through task checklists, help you submit leave requests, verify clock-in methods, or navigate the dashboard. Ask me anything!`;
        }
      }
    }

    // Set up text encoder and ReadableStream for mock streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream text in words to simulate realistic AI response pacing
        const words = responseText.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          // Add a minor delay for natural streaming pacing (35ms per word)
          await new Promise((resolve) => setTimeout(resolve, 35));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Copilot API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
