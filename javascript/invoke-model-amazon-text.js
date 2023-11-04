const { invokeModel } = require('./utils/client-bedrock-runtime');

const MODEL_ID = process.env.MODEL_ID || 'amazon.titan-text-lite-v1';
/*
* Amazon Text models id:
* 'amazon.titan-text-lite-v1',
* 'amazon.titan-text-express-v1',
* 'amazon.titan-text-agile-v1',
* @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-arns.html
*/

const PROMPT = process.env.PROMPT || 'Hi, who are you?';

exports.handler = async (event) => {
  const params = {
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: PROMPT,
      textGenerationConfig: {
        maxTokenCount: 300,
        stopSequences: [],
        temperature: 0,
        topP: 0.9,
      }
    }),
  };

  try {
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);

    const bodyRes = {
      prompt: PROMPT,
      completion: modelRes.results[0].outputText,
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
