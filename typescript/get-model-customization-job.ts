import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getModelCustomizationJob, GetModelCustomizationJobCommandInput } from "./utils/client-bedrock";

const JOB_ARN = process.env.JOB_NAME || 'JOB_NAME';

export const handler: APIGatewayProxyHandler = async (_event): Promise<APIGatewayProxyResult> => {
  const params: GetModelCustomizationJobCommandInput = {
    jobIdentifier: JOB_ARN,
  };
  try {
    const res = await getModelCustomizationJob(params);
    return {
      statusCode: 200,
      body: JSON.stringify(res),
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
