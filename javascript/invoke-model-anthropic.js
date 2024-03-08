const { invokeModel } = require('./utils/client-bedrock-runtime');

const MODEL_ID = process.env.MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';
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
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      temperature: 0.5,
      top_k: 250,
      top_p: 1,
      messages: [
        {
          role: "user",
          content: [
            // {
            //   type: "image",
            //   source: {
            //     type: "base64",
            //     media_type: "image/png",
            //     data: 'YOUR_BASE_64_IMAGE',
            //   },
            // },
            {
              type: "text",
              text: PROMPT
            },
          ],
        }
      ],
    }),
  };

  try {
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);

    const bodyRes = {
      prompt: PROMPT,
      completion: modelRes.content[0].text,
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
