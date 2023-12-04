const { invokeModel } = require('./utils/client-bedrock-runtime');
const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;

/*
* Amazon Image models id:
* 'amazon.titan-image-generator-v1',
* @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids-arns.html
*/
const MODEL_ID = process.env.MODEL_ID || 'amazon.titan-image-generator-v1';
const IMAGE_NAME = process.env.IMAGE_NAME || '1701685419932.png';
const IMAGE_PATH = `${path.join(path.join(__dirname, 'images'), IMAGE_NAME)}`;
const PROMPT = process.env.PROMPT || 'Blue eyes';

const saveImageLocally = (base64Image) => {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  const filename = `${new Date().getTime()}.png`;
  const directoryPath = path.join(__dirname, 'images');
  const imagePath = path.join(directoryPath, filename);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
  fs.writeFileSync(imagePath, imageBuffer);
}

const readImage = async () => {
  const data = await fsPromise.readFile(IMAGE_PATH);
  return data.toString('base64');
}

exports.handler = async (event) => {
  const params = {
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      // IMAGE_VARIATION
      // taskType: "IMAGE_VARIATION",
      // imageVariationParams: {
      //   text: PROMPT,
      //   negativeText: "bad quality, low resolution, cartoon",
      //   images: [
      //     await readImage()
      //   ]
      // },

      // INPAINTING
      // taskType: "INPAINTING",
      // inPaintingParams: {
      //   text: PROMPT, // Required
      //   negativeText: "bad quality, low res", // Optional
      //   image: await readImage(), // Required
      //   maskPrompt: "windows", // One of "maskImage" or "maskPrompt" is required
      //   // maskImage: await readImage(), // Input maskImage based on the values 0 or 1 only 
      // },

      // OUTPAINTING
      taskType: "OUTPAINTING",
      outPaintingParams: {
          text: PROMPT, // Required
          negativeText: "bad quality, low res", // Optional
          image: await readImage(), // Required
          maskPrompt: "windows", // One of "maskImage" or "maskPrompt" is required
          // maskImage: await readImage(), // One of "maskImage" or "maskPrompt" is required 
          outPaintingMode: "DEFAULT"
      }, 

      // TEXT_IMAGE
      // taskType: "TEXT_IMAGE",
      // textToImageParams: {
      //   text: PROMPT,
      // },
      imageGenerationConfig: {
        cfgScale: 8,
        seed: 0,
        quality: "standard", //"premium"
        width: 1024,
        height: 1024,
        numberOfImages: 1
      }
    }),
  };

  try {
    const res = await invokeModel(params);
    const jsonString = new TextDecoder().decode(res.body);
    const modelRes = JSON.parse(jsonString);
    const base64Images = modelRes.images;

    const bodyRes = {
      prompt: PROMPT,
      images: base64Images,
    }
    console.debug(bodyRes);
    for (const image of base64Images) {
      saveImageLocally(image);
    }

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
