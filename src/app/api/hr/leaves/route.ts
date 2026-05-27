import { prisma } from "@/src/lib/prisma";

type LeaveStatus = "Approved" | "Rejected";

type LeaveRequestPayload = {
  id: string;
  status: LeaveStatus;
};

const leaveStatusValues = ["Approved", "Rejected"] as const;

function isLeaveStatus(value: unknown): value is LeaveStatus {
  return typeof value === "string" && leaveStatusValues.includes(value as LeaveStatus);
}

export async function GET() {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { status: "Pending" },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ leaveRequests });
  } catch (error) {
    console.error("Failed to fetch leave requests:", error);

    return Response.json(
      { message: "Unable to load leave requests." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  let payload: Partial<LeaveRequestPayload>;

  try {
    payload = (await request.json()) as Partial<LeaveRequestPayload>;
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (!payload.id || typeof payload.id !== "string") {
    return Response.json({ message: "id is required." }, { status: 400 });
  }

  if (!isLeaveStatus(payload.status)) {
    return Response.json(
      { message: 'status must be either "Approved" or "Rejected".' },
      { status: 400 },
    );
  }

  try {
    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id: payload.id },
      data: {
        status: payload.status,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return Response.json({ leaveRequest: updatedLeaveRequest });
  } catch (error) {
    console.error("Failed to update leave request", error);

    return Response.json(
      { message: "Unable to update leave request." },
      { status: 500 },
    );
  }
}