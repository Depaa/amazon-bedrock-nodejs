import { BedrockClient, CreateModelCustomizationJobCommand, GetModelCustomizationJobCommand, ListFoundationModelsCommand, CreateModelCustomizationJobCommandInput, CreateModelCustomizationJobCommandOutput, GetModelCustomizationJobCommandInput, GetModelCustomizationJobCommandOutput, ListFoundationModelsCommandInput, ListFoundationModelsCommandOutput } from '@aws-sdk/client-bedrock';

const client = new BedrockClient({ region: process.env.REGION || 'us-east-1' });
const logger = console; // import your own logger

/*
* Create Model Customization Job
* @param {CreateModelCustomizationJobCommandInput} params
* @returns {Promise<CreateModelCustomizationJobCommandOutput>}
* @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Bedrock.html#CreateModelCustomizationJob-property
*/
export const createModelCustomizationJob = async (param: CreateModelCustomizationJobCommandInput): Promise<CreateModelCustomizationJobCommandOutput> => {
  logger.debug(param);
  const command = new CreateModelCustomizationJobCommand(param);
  const res = await client.send(command);
  logger.debug('Successfully create model customization job');
  logger.debug(res);
  return res;
}

/*
* Get Model Customization Job
* @param {GetModelCustomizationJobCommandInput} params
* @returns {Promise<GetModelCustomizationJobCommandOutput>}
* @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Bedrock.html#getModelCustomizationJob-property
*/
export const getModelCustomizationJob = async (params: GetModelCustomizationJobCommandInput): Promise<GetModelCustomizationJobCommandOutput> => {
  logger.debug(params);
  const command = new GetModelCustomizationJobCommand(params);
  const res = await client.send(command);
  logger.debug('Successfully get model customization job');
  logger.debug(res);
  return res;
}

/*
* List Foundation Models
* @param {ListFoundationModelsCommandInput} params
* @returns {Promise<ListFoundationModelsCommandOutput>}
* @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Bedrock.html#listFoundationModels-property
*/
export const listFoundationModels = async (params: ListFoundationModelsCommandInput): Promise<ListFoundationModelsCommandOutput> => {
  logger.debug(params);
  const command = new ListFoundationModelsCommand(params);
  const res = await client.send(command);
  logger.debug('Successfully list foundation models');
  logger.debug(res);
  return res;
}

export { CreateModelCustomizationJobCommandInput, GetModelCustomizationJobCommandInput, ListFoundationModelsCommandInput, }