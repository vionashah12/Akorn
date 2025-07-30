// Canvas API Configuration
const config = {
  canvasDomain: process.env.CANVAS_DOMAIN || 'osu.instructure.com',
  apiToken: process.env.CANVAS_API_TOKEN || '8597~3y8YBt9WzVcrkTDaEBKJxaY4naVc6uv3DhFYU9WKmhDfQV9h6eh2zYUtZht44N2G',
  baseURL: `https://${process.env.CANVAS_DOMAIN || 'osu.instructure.com'}/api/v1`
};

module.exports = config; 