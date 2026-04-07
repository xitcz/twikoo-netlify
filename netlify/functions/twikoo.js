const twikoo = require('twikoo-netlify');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',           // 测试时用 *，成功后再改成 https://blog.wxiao2.com
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

exports.handler = async (event, context) => {
  // 1. 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // 2. 调用 Twikoo 原生 handler
  let response;
  try {
    response = await twikoo.handler(event, context);
  } catch (error) {
    console.error('Twikoo handler error:', error);
    response = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }

  // 3. 关键：强制合并 CORS 头到返回的响应中（无论成功或失败）
  const newHeaders = {
    ... (response.headers || {}),
    ...corsHeaders,
  };

  // 如果是对象形式，就直接修改
  if (response && typeof response === 'object') {
    response.headers = newHeaders;
  } else {
    // 极少数情况返回字符串时，转为对象
    response = {
      statusCode: 200,
      headers: newHeaders,
      body: response || '',
    };
  }

  return response;
};
