const { invokeModel } = require('./utils/client-bedrock-runtime');

const MODEL_ID = process.env.MODEL_ID || 'anthropic.claude-instant-v1';
/*
* Anthropic models id:
* "anthropic.claude-v1"
* "anthropic.claude-instant-v1"
* "anthropic.claude-v2"
* @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-arns.html
*/

const PROMPT = process.env.PROMPT || 'Hi, who are you?';

exports.handler = async (event) => {
  const params = {
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
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);

    const bodyRes = {
      prompt: PROMPT,
      completion: modelRes.completion,
    }
    console.debug(bodyRes);

    return {
      statusCode: 200,
      body: JSON.stringify(bodyRes),
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};
