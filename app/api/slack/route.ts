import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{4,}\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  try {
    // 요청의 body에서 name, message, mail을 파싱
    const { name, message, mail } = await request.json();

    // 필수 필드 유효성 검사
    if (!message || !name || !mail) {
      return NextResponse.json({ error: "Message, name, and mail are required." }, { status: 400 });
    }

    // 이메일 유효성 검사
    if (!emailRegex.test(mail)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Slack으로 보낼 메시지 데이터
    const slackMessage = {
      text: `{
  name: ${name},
  message: ${message},
  mail: ${mail},
  date: ${dayjs().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ssZ")}
}`,
    };

    // Slack으로 POST 요청 보내기
    if (!slackWebhookUrl) {
      throw new Error("Slack webhook URL is not defined.");
    }

    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackMessage),
    });

    if (response.ok) {
      return NextResponse.json({ data: "Message sent to Slack!" });
    } else {
      return NextResponse.json({ error: "Failed to send message to Slack." }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
