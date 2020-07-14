export const minioClientConfig = {
  endPoint: 'srv-captain--minio',
  port: 9000,
  useSSL: true,
  accessKey: process.env.MINIO_AK,
  secretKey: process.env.MINIO_SK,
};
