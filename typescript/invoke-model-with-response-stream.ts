import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { InvokeModelWithResponseStreamCommandInput, invokeModelWithResponseStream } from './utils/client-bedrock-runtime';

const MODEL_ID = process.env.MODEL_ID || 'anthropic.claude-instant-v1';
/*
* Anthropic models id:
* "anthropic.claude-v1"
* "anthropic.claude-instant-v1"
* "anthropic.claude-v2"
*/

const PROMPT = process.env.PROMPT || 'Hi, who are you?';

export const handler: APIGatewayProxyHandler = async (_event): Promise<APIGatewayProxyResult> => {
  const params: InvokeModelWithResponseStreamCommandInput = {
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: `\n\nHuman:${PROMPT}\n\nAssistant:`,
      max_tokens_to_sample: 300,
      temperature: 0.5,
      top_k: 250,
      top_p: 1,
    }),
  };

  try {
    const res = await invokeModelWithResponseStream(params);
    if (!res.body) {
      throw new Error('No response from Invoke Model');
    }

    const chunks = [];

    for await (const event of res.body) {
      if (event.chunk && event.chunk.bytes) {
        const chunk = JSON.parse(Buffer.from(event.chunk.bytes).toString("utf-8"));
        chunks.push(chunk.completion);
      } else if (
        event.internalServerException ||
        event.modelStreamErrorException ||
        event.throttlingException ||
        event.validationException
      ) {
        console.error(event);
        break;
      }
    };

    const bodyRes = {
      prompt: PROMPT,
      completion: chunks.join(''),
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
