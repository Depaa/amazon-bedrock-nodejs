const { listFoundationModels } = require("./utils/client-bedrock");

exports.handler = async (event) => {
  const params = {}
  try {
    const res = await listFoundationModels(params);
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
