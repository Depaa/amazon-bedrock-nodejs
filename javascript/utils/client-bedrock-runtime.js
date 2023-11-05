const {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
  InvokeModelCommandOutput,
  InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStreamCommandInput,
  InvokeModelWithResponseStreamCommandOutput,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: process.env.REGION || 'us-east-1' });

const logger = console; // import your own logger

/*
* Invoke Model
* @param {InvokeModelCommandInput} params
* @returns {Promise<InvokeModelCommandOutput>}
* @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/BedrockRuntime.html#invokeModel-property
*/
const invokeModel = async (params) => {
  logger.debug(params);
  const command = new InvokeModelCommand(params);
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
const invokeModelWithResponseStream = async (params) => {
  logger.debug(params);
  const command = new InvokeModelWithResponseStreamCommand(params);
  const res = await client.send(command);
  logger.debug('Successfully invoke model with response stream');
  logger.debug(res);
  return res;
}

module.exports = {
  invokeModel,
  invokeModelWithResponseStream
}