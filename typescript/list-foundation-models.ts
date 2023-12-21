import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { ListFoundationModelsCommandInput, listFoundationModels } from "./utils/client-bedrock";

export const handler: APIGatewayProxyHandler = async (_event): Promise<APIGatewayProxyResult> => {
  const params: ListFoundationModelsCommandInput = {}
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
