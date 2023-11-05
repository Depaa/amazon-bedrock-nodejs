import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { invokeModel, InvokeModelCommandInput } from './utils/client-bedrock-runtime';

const MODEL_ID = process.env.MODEL_ID || 'cohere.command-text-v14';
/*
* Cohere models id:
* "cohere.command-text-v14"
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
      p: 0.01,
      k: 0,
      stop_sequences: [],
      return_likelihoods: "NONE",
    }),
  };

  try {
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);

    const bodyRes = {
      prompt: PROMPT,
      completion: modelRes.generations[0].text,
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
