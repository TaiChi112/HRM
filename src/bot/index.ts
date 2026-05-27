import { GoogleGenAI } from "@google/genai";
import {
  FunctionCallingConfigMode,
  createPartFromFunctionResponse,
  type Content,
  type FunctionCall,
  type FunctionDeclaration,
} from "@google/genai";
import { prisma } from "../lib/prisma";
import {
  Client,
  GatewayIntentBits,
  Partials,
  type Message,
} from "discord.js";

const discordToken = process.env.DISCORD_BOT_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!discordToken) {
  throw new Error("DISCORD_BOT_TOKEN is required.");
}

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is required.");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const modelName = "gemini-2.5-flash";

type EmployeeInfo = {
  position: string;
  department: string;
  salary: number;
  status: string;
};

type LeaveRequestInput = {
  discordId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
};

type LeaveStatusResult =
  | {
      found: true;
      leaveRequest: {
        type: string;
        startDate: string;
        endDate: string;
        status: string;
        reason: string;
      };
    }
  | {
      found: false;
      message: string;
    };

type EmployeeInfoResult =
  | {
      found: true;
      employee: EmployeeInfo;
    }
  | {
      found: false;
      message: string;
    };

const getEmployeeInfoDeclaration = {
  name: "get_employee_info",
  description:
    "Fetches employment details for an employee from the HR database using a Discord user ID.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      discordId: {
        type: "string",
        description: "The Discord user ID to look up in the Employee table.",
      },
    },
    required: ["discordId"],
    additionalProperties: false,
  },
} satisfies FunctionDeclaration;

const requestLeaveDeclaration = {
  name: "request_leave",
  description:
    "Creates a pending leave request in the HR database after extracting the leave type, ISO start date, ISO end date, and reason from the user's message.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      discordId: {
        type: "string",
        description: "The Discord user ID to look up in the Employee table.",
      },
      type: {
        type: "string",
        description: "The leave category, such as Sick or Vacation.",
      },
      startDate: {
        type: "string",
        description: "The leave start date as an ISO-8601 string.",
      },
      endDate: {
        type: "string",
        description: "The leave end date as an ISO-8601 string.",
      },
      reason: {
        type: "string",
        description: "A short reason for the leave request.",
      },
    },
    required: ["discordId", "type", "startDate", "endDate", "reason"],
    additionalProperties: false,
  },
} satisfies FunctionDeclaration;

const checkLeaveStatusDeclaration = {
  name: "check_leave_status",
  description:
    "Checks the status of the employee's most recent leave request using their Discord ID.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      discordId: {
        type: "string",
        description: "The Discord user ID to look up in the Employee table.",
      },
    },
    required: ["discordId"],
    additionalProperties: false,
  },
} satisfies FunctionDeclaration;

async function getEmployeeInfo(discordId: string): Promise<EmployeeInfoResult> {
  const employee = await prisma.employee.findUnique({
    where: { discordId },
  });

  if (!employee) {
    return {
      found: false,
      message:
        "No linked employee record was found for this Discord account.",
    };
  }

  return {
    found: true,
    employee: {
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      status: employee.status,
    },
  };
}

async function requestLeave({
  discordId,
  type,
  startDate,
  endDate,
  reason,
}: LeaveRequestInput): Promise<Record<string, unknown>> {
  const employee = await prisma.employee.findUnique({
    where: { discordId },
    select: { id: true, name: true },
  });

  if (!employee) {
    return {
      success: false,
      message:
        "No linked employee record was found for this Discord account.",
    };
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (Number.isNaN(parsedStartDate.getTime()) || Number.isNaN(parsedEndDate.getTime())) {
    return {
      success: false,
      message: "The provided dates must be valid ISO-8601 strings.",
    };
  }

  if (parsedEndDate.getTime() < parsedStartDate.getTime()) {
    return {
      success: false,
      message: "The end date must be the same as or after the start date.",
    };
  }

  const leaveRequest = await prisma.leaveRequest.create({
    data: {
      employeeId: employee.id,
      type,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      reason,
      status: "Pending",
    },
    select: {
      id: true,
      type: true,
      startDate: true,
      endDate: true,
      reason: true,
      status: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    employee: {
      id: employee.id,
      name: employee.name,
    },
    leaveRequest,
  };
}

async function checkLeaveStatus(discordId: string): Promise<LeaveStatusResult> {
  const leaveRequest = await prisma.leaveRequest.findFirst({
    where: {
      employee: {
        discordId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      type: true,
      startDate: true,
      endDate: true,
      status: true,
      reason: true,
    },
  });

  if (!leaveRequest) {
    return {
      found: false,
      message: "No leave requests were found for this Discord account.",
    };
  }

  return {
    found: true,
    leaveRequest: {
      type: leaveRequest.type,
      startDate: leaveRequest.startDate.toISOString(),
      endDate: leaveRequest.endDate.toISOString(),
      status: leaveRequest.status,
      reason: leaveRequest.reason,
    },
  };
}

function getDiscordIdFromArgs(args: Record<string, unknown> | undefined): string | null {
  const discordId = args?.discordId;

  return typeof discordId === "string" && discordId.length > 0 ? discordId : null;
}

function getStringArg(
  args: Record<string, unknown> | undefined,
  key: "type" | "startDate" | "endDate" | "reason",
): string | null {
  const value = args?.[key];

  return typeof value === "string" && value.length > 0 ? value : null;
}

function shouldHandleMessage(message: Message<true>): boolean {
  if (message.author.bot) {
    return false;
  }

  if (message.channel.isDMBased()) {
    return true;
  }

  const botUserId = client.user?.id;

  return botUserId ? message.mentions.has(botUserId) : false;
}

function buildPrompt(message: Message<true>): string {
  const cleanedContent = message.content
    .replace(/<@!?\d+>/g, "")
    .trim();

  const userName = message.author.globalName ?? message.author.username;
  const bangkokNow = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
  });

  return [
    "You are an expert, concise HR assistant for an enterprise SaaS Discord bot.",
    `System Context: You are talking to Discord user ${message.author.id}. If the user asks about their employment details, call get_employee_info with discordId set to ${message.author.id}. If the user asks to request leave, call request_leave with discordId set to ${message.author.id} and extract the leave type, ISO startDate, ISO endDate, and reason from the message. If the user asks about the status of their most recent leave request, call check_leave_status with discordId set to ${message.author.id}. If there is no linked employee record, politely inform them to contact the HR Admin to link their Discord account before you can assist with HR tasks.`,
    `CRITICAL: Today's exact date and time is ${bangkokNow}. You MUST calculate ALL relative dates (like 'พรุ่งนี้'/tomorrow, 'มะรืน'/day after tomorrow) strictly based on this exact date. NEVER use default or past years like 2024 or 2025. ALWAYS output the calculated date in valid ISO-8601 format.`,
    `User: ${userName}`,
    `Message: ${cleanedContent || message.content}`,
    "Reply clearly, helpfully, and briefly when possible.",
  ].join("\n");
}

function buildGeminiConfig() {
  return {
    tools: [{ functionDeclarations: [getEmployeeInfoDeclaration, requestLeaveDeclaration, checkLeaveStatusDeclaration] }],
    toolConfig: {
      functionCallingConfig: {
        mode: FunctionCallingConfigMode.AUTO,
      },
    },
  };
}

async function executeFunctionCall(functionCall: FunctionCall): Promise<ReturnType<typeof createPartFromFunctionResponse>> {
  const functionName = functionCall.name ?? "";
  const args = functionCall.args ?? {};

  if (functionName === getEmployeeInfoDeclaration.name) {
    const discordId = getDiscordIdFromArgs(args);

    if (!discordId) {
      return createPartFromFunctionResponse(
        functionCall.id ?? getEmployeeInfoDeclaration.name ?? "get_employee_info",
        getEmployeeInfoDeclaration.name ?? "get_employee_info",
        {
          found: false,
          message: "Gemini did not provide a valid discordId argument.",
        },
      );
    }

    const employeeInfo = await getEmployeeInfo(discordId);

    return createPartFromFunctionResponse(
      functionCall.id ?? getEmployeeInfoDeclaration.name ?? "get_employee_info",
      getEmployeeInfoDeclaration.name ?? "get_employee_info",
      employeeInfo,
    );
  }

  if (functionName === requestLeaveDeclaration.name) {
    const discordId = getDiscordIdFromArgs(args);
    const leaveType = getStringArg(args, "type");
    const startDate = getStringArg(args, "startDate");
    const endDate = getStringArg(args, "endDate");
    const reason = getStringArg(args, "reason");

    if (!discordId || !leaveType || !startDate || !endDate || !reason) {
      return createPartFromFunctionResponse(
        functionCall.id ?? requestLeaveDeclaration.name ?? "request_leave",
        requestLeaveDeclaration.name ?? "request_leave",
        {
          success: false,
          message:
            "Gemini did not provide all required arguments: discordId, type, startDate, endDate, and reason.",
        },
      );
    }

    const result = await requestLeave({
      discordId,
      type: leaveType,
      startDate,
      endDate,
      reason,
    });

    return createPartFromFunctionResponse(
      functionCall.id ?? requestLeaveDeclaration.name ?? "request_leave",
      requestLeaveDeclaration.name ?? "request_leave",
      result,
    );
  }

  if (functionName === checkLeaveStatusDeclaration.name) {
    const discordId = getDiscordIdFromArgs(args);

    if (!discordId) {
      return createPartFromFunctionResponse(
        functionCall.id ?? checkLeaveStatusDeclaration.name ?? "check_leave_status",
        checkLeaveStatusDeclaration.name ?? "check_leave_status",
        {
          found: false,
          message: "Gemini did not provide a valid discordId argument.",
        },
      );
    }

    const result = await checkLeaveStatus(discordId);

    return createPartFromFunctionResponse(
      functionCall.id ?? checkLeaveStatusDeclaration.name ?? "check_leave_status",
      checkLeaveStatusDeclaration.name ?? "check_leave_status",
      result,
    );
  }

  return createPartFromFunctionResponse(
    functionCall.id ?? functionName,
    functionName,
    {
      success: false,
      message: `Unsupported function call: ${functionName}`,
    },
  );
}

async function generateResponse(
  prompt: string,
): Promise<string> {
  const initialResponse = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: buildGeminiConfig(),
  });

  let response = initialResponse;
  let safetyCounter = 0;

  while (response.functionCalls?.length && safetyCounter < 3) {
    safetyCounter += 1;

    const functionCallParts = response.functionCalls.map((functionCall: FunctionCall) => ({
      functionCall,
    }));

    const functionResponseParts = await Promise.all(
      response.functionCalls.map(async (functionCall: FunctionCall) => executeFunctionCall(functionCall)),
    );

    const continuationContents: Content[] = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
      {
        role: "model",
        parts: functionCallParts,
      },
      {
        role: "user",
        parts: functionResponseParts,
      },
    ];

    response = await ai.models.generateContent({
      model: modelName,
      contents: continuationContents,
      config: buildGeminiConfig(),
    });
  }

  const text = response.text?.trim();

  return text && text.length > 0 ? text : "I could not generate a response right now.";
}

function splitMessage(content: string): string[] {
  if (content.length <= 2000) {
    return [content];
  }

  const chunks: string[] = [];
  let remaining = content;

  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, 2000));
    remaining = remaining.slice(2000);
  }

  return chunks;
}

client.once("clientReady", () => {
  console.log(`Discord bot online as ${client.user?.tag ?? "unknown user"}`);
});

client.on("messageCreate", async (message) => {
  const typedMessage = message as Message<true>;

  if (!shouldHandleMessage(typedMessage)) {
    return;
  }

  try {
    const prompt = buildPrompt(typedMessage);
    const replyText = await generateResponse(prompt);

    for (const chunk of splitMessage(replyText)) {
      await typedMessage.reply(chunk);
    }
  } catch (error) {
    console.error("Failed to process Discord message", error);

    const fallbackMessage = "I could not process that request right now.";
    await typedMessage.reply(fallbackMessage);
  }
});

await client.login(discordToken);