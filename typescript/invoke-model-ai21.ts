import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { invokeModel, InvokeModelCommandInput } from './utils/client-bedrock-runtime';

const MODEL_ID = process.env.MODEL_ID || 'ai21.j2-mid';
/*
* AI21 models id:
* 'ai21.j2-mid-v1',
* 'ai21.j2-ultra-v1',
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
      maxTokens: 200,
      temperature: 0.7,
      topP: 1,
      stopSequences: [],
      countPenalty: { scale: 0 },
      presencePenalty: { scale: 0 },
      frequencyPenalty: { scale: 0 },
    }),
  };

  try {
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);

    const bodyRes = {
      prompt: PROMPT,
      completion: modelRes.completions[0].data.text,
    };
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
