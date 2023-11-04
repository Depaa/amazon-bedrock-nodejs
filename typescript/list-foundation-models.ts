import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { ListFoundationModelsCommandInput, listFoundationModels } from "./utils/client-bedrock";

export const handler: APIGatewayProxyHandler = async (_event): Promise<APIGatewayProxyResult> => {
  /*
  * byInferenceType is "required" because currently a bug in the SDK prevents the request
  * from being sent. The indicted parameters is byProvider.
  * see bug report: https://github.com/aws/aws-sdk-js/issues/4519
  */
  const params: ListFoundationModelsCommandInput = {
    byInferenceType: "ON_DEMAND", // or "PROVISIONED"
  }
  try {
    const res = await listFoundationModels(params);
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
