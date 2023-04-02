import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const openaiPath = req.headers.get("path");

  console.log("[Proxy] ", openaiPath);
  let bodyText = "";
  if (openaiPath == "v1/chat/completions") {
    // control the body params

    const bodyData = JSON.parse(await req.text());
    if (bodyData.max_tokens > 2000) {
      throw Error("[Illegal] max_tokens must be less than 2000");
    }
    if (bodyData.model != "gpt-3.5-turbo") {
      throw Error("[Illegal] model must be gpt-3.5-turbo");
    }
    if (bodyData.messages.length > 24) {
      throw Error("[Illegal] messages length must be less than 24");
    }

    bodyText = JSON.stringify(bodyData);
  }

  return fetch(`${PROTOCOL}://${BASE_URL}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: req.method,
    body: bodyText ? bodyText : req.body,
  });
}
