const { handler: twikooHandler } = require('twikoo-netlify');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const response = await twikooHandler(event, context);

  return {
    ...response,
    headers: {
      ... (response.headers || {}),
      ...corsHeaders,
    },
  };
};
