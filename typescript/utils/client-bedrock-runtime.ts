import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelCommandInput, InvokeModelCommandOutput, InvokeModelWithResponseStreamCommand, InvokeModelWithResponseStreamCommandInput, InvokeModelWithResponseStreamCommandOutput } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.REGION || 'us-east-1' });
const logger = console; // import your own logger

/*
* Invoke Model
* @param {InvokeModelCommandInput} params
* @returns {Promise<InvokeModelCommandOutput>}
* @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/BedrockRuntime.html#invokeModel-property
*/
export const invokeModel = async (param: InvokeModelCommandInput): Promise<InvokeModelCommandOutput> => {
  logger.debug(param);
  const command = new InvokeModelCommand(param);
  const res = await client.send(command);
  logger.debug('Successfully invoke model');
  logger.debug(res);
  return res;
}

/*
* Invoke Model With Response Stream
* @param {InvokeModelWithResponseStreamCommandInput} params
* @returns {Promise<InvokeModelWithResponseStreamCommandOutput>}
* @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/BedrockRuntime.html#invokeModelWithResponseStream-property
*/
export const invokeModelWithResponseStream = async (param: InvokeModelWithResponseStreamCommandInput): Promise<InvokeModelWithResponseStreamCommandOutput> => {
  logger.debug(param);
  const command = new InvokeModelWithResponseStreamCommand(param);
  const res = await client.send(command);
  logger.debug('Successfully invoke model with response stream');
  logger.debug(res);
  return res;
}

export { InvokeModelCommandInput, InvokeModelWithResponseStreamCommandInput }