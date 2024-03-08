import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { invokeModel, InvokeModelCommandInput } from './utils/client-bedrock-runtime';

const MODEL_ID = process.env.MODEL_ID || 'mistral.mixtral-8x7b-instruct-v0:1';
/*
* Cohere models id:
* "mistral.mistral-7b-instruct-v0:2"
* "mistral.mixtral-8x7b-instruct-v0:1"
* @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-arns.html
*/

const PROMPT = process.env.PROMPT || 'Hi, who are you?';

export const handler: APIGatewayProxyHandler = async (_event): Promise<APIGatewayProxyResult> => {
  const params: InvokeModelCommandInput = {
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: PROMPT,
      max_tokens: 400,
      temperature: 0.75,
      top_p: 0.01,
      // top_k: 0,
      // stop: [],
    }),
  };

  try {
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);

    const bodyRes = {
      prompt: PROMPT,
      completion: modelRes.outputs[0].text,
    }
    console.debug(bodyRes);

    return {
      statusCode: 200,
      body: JSON.stringify(bodyRes),
    }
  } catch (err: any) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};
