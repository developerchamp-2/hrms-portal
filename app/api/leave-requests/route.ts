import {
  createLeaveRequest,
  getLeaveRequests,
} from "@/lib/actions/leave-requests";

export async function GET() {
  try {
    const data = await getLeaveRequests();

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unable to fetch leave requests",
      },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await createLeaveRequest(payload);

  return Response.json(result, {
    status: result.success ? 200 : 400,
  });
}
