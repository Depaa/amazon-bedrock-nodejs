import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { InvokeModelCommandInput, invokeModel } from './utils/client-bedrock-runtime';
import fs from 'fs';
import path from 'path';

const MODEL_ID = process.env.MODEL_ID || 'stability.stable-diffusion-xl-v0';
/*
* Stability AI models id:
* 'stability.stable-diffusion-xl-v0',
* @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-arns.html
*/

const PROMPT = process.env.PROMPT || 'Hi, who are you?';

const saveImageLocally = (base64Image: string) => {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  const filename = `${new Date().getTime()}.png`;
  const directoryPath = path.join(__dirname, 'images');
  const filePath = path.join(directoryPath, filename);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  fs.writeFileSync(filePath, imageBuffer);
}

export const handler: APIGatewayProxyHandler = async (_event): Promise<APIGatewayProxyResult> => {
  const params: InvokeModelCommandInput = {
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      text_prompts: [{ text: PROMPT }],
      cfg_scale: 10,
      seed: 0,
      steps: 50,
    }),
  };

  try {
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);
    console.debug(modelRes);
    const base64Image = modelRes.artifacts[0].base64;

    const bodyRes = {
      prompt: PROMPT,
      image: base64Image,
    };
    console.debug(bodyRes);
    saveImageLocally(base64Image);

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
