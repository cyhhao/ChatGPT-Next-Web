import { createParser } from "eventsource-parser";
import { NextRequest } from "next/server";
import { requestOpenai } from "../common";

async function createStream(req: NextRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // control the body params
  const cloneReq = req.clone.bind(req);
  const clonedReq = cloneReq();
  const bodyData = await clonedReq.json();
  if (bodyData.max_tokens > 2000) {
    return "[Illegal] max_tokens must be less than 2000";
  }
  if (bodyData.model != "gpt-3.5-turbo") {
    return "[Illegal] model must be gpt-3.5-turbo";
  }
  if (bodyData.messages.length > 24) {
    return "[Illegal] messages length must be less than 24";
  }

  const res = await requestOpenai(req);

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: any) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });
  return stream;
}

export async function POST(req: NextRequest) {
  try {
    const stream = await createStream(req);
    return new Response(stream);
  } catch (error) {
    console.error("[Chat Stream]", error);
  }
}

export const config = {
  runtime: "edge",
};
