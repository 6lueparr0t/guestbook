import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  function sendEvent(writer: WritableStreamDefaultWriter, encoder: TextEncoder, data: any) {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  }

  try {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    const encoder = new TextEncoder();

    // 서버에서 일정 주기로 데이터 전송
    const intervalId = setInterval(() => {
      sendEvent(writer, encoder, {
        message: "Server Sent Event Test",
        time: new Date().toISOString(),
      });
    }, 5000);

    // 클라이언트가 연결을 끊었을 때 인터벌 정리
    request.signal.addEventListener("abort", () => {
      clearInterval(intervalId);
      writer.close();
    });

    // 헤더 설정
    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    return new NextResponse(readable, { headers });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
