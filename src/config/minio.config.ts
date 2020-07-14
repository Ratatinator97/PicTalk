export const minioClientConfig = {
  endPoint: 'minio.apps.asidiras.dev',
  port: 9000,
  useSSL: true,
  accessKey: process.env.MINIO_AK,
  secretKey: process.env.MINIO_SK,
};
