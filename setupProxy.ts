import { createProxyMiddleware } from 'http-proxy-middleware';

export default function setupProxy(app: any) {
  app.use(
    'api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    })
  );
}