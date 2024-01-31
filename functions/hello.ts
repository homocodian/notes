import { type Handler } from "@netlify/functions";

type Success = {
  success: true;
  data: object;
};

type Error = {
  success: false;
  error: string;
};

type ResponseBody = Success | Error;

export const handler: Handler = async (event) => {
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          message: "Hello!",
        },
      } satisfies ResponseBody),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Content-Type": "application/json",
      },
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: "Please provide valid field",
      } satisfies ResponseBody),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Content-Type": "application/json",
      },
    };
  }

  const data = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      data,
    } satisfies ResponseBody),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Content-Type": "application/json",
    },
  };
};
