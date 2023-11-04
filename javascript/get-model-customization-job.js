const { getModelCustomizationJob } = require("./utils/client-bedrock");

const JOB_ARN = process.env.JOB_NAME || 'JOB_NAME';

exports.handler = async (event) => {
  const params = {
    jobIdentifier: JOB_ARN,
  };
  try {
    const res = await getModelCustomizationJob(params);
    return {
      statusCode: 200,
      body: JSON.stringify(res),
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
