import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { CreateModelCustomizationJobCommandInput, createModelCustomizationJob } from "./utils/client-bedrock";

const BUCKET_URI = process.env.BUCKET_URI || 's3://S3_BUCKET_NAME';
const ROLE_ARN = process.env.ROLE_ARN || 'arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME';
const BASE_MODEL_IDENTIFIER = process.env.BASE_MODEL_IDENTIFIER || 'arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-express-v1';

export const handler: APIGatewayProxyHandler = async (_event): Promise<APIGatewayProxyResult> => {
  const now = new Date();

  const params: CreateModelCustomizationJobCommandInput = {
    jobName: `job-${now.getTime()}`, // required
    customModelName: `titan-text-express-v1-${now.getTime()}`, // required
    roleArn: ROLE_ARN, // required
    baseModelIdentifier: BASE_MODEL_IDENTIFIER, // required
    jobTags: [ // TagList
      { // Tag
        key: 'bedrock', // required
        value: 'true', // required
      },
    ],
    customModelTags: [
      {
        key: 'custom-bedrock', // required
        value: 'true', // required
      },
    ],
    trainingDataConfig: { // TrainingDataConfig
      s3Uri: `${BUCKET_URI}/training/dataset2.jsonl`, // required
    },
    outputDataConfig: { // OutputDataConfig
      s3Uri: `${BUCKET_URI}/output`, // required
    },
    hyperParameters: { // ModelCustomizationHyperParameters // required
      'epochCount': '1',
      'batchSize': '4',
      'learningRate': '0.02',
      'learningRateWarmupSteps': '0',
    },
    // customModelKmsKeyId: 'STRING_VALUE',
    // clientRequestToken: 'STRING_VALUE',
    // validationDataConfig: { // ValidationDataConfig
    //   validators: [ // Validators // required
    //     { // Validator
    //       s3Uri: 'STRING_VALUE', // required
    //     },
    //   ],
    // },
    // vpcConfig: { // VpcConfig
    //   subnetIds: [ // SubnetIds // required
    //     'STRING_VALUE',
    //   ],
    //   securityGroupIds: [ // SecurityGroupIds // required
    //     'STRING_VALUE',
    //   ],
    // },
  };
  try {
    const res = await createModelCustomizationJob(params);
    return {
      statusCode: 201,
      body: JSON.stringify(res)
    }
  } catch (err: any) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message
      })
    };
  }
};
