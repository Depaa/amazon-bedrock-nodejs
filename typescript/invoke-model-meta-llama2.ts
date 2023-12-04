import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { invokeModel, InvokeModelCommandInput } from './utils/client-bedrock-runtime';

const MODEL_ID = process.env.MODEL_ID || 'meta.llama2-70b-chat-v1';
/*
* Meta Llama 2 models id:
* 'meta.llama2-70b-chat-v1',
* 'meta.llama2-13b-chat-v1',
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
      temperature: 0.5,
      top_p: 0.9,
      max_gen_len: 512
    }),
  };

  try {
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);

    const bodyRes = {
      prompt: PROMPT,
      completion: modelRes.generation,
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
