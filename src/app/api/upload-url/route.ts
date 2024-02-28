import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@clerk/nextjs';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();
    const user = auth();
    const fileKey = `uploads/${user.userId}/${fileName}`;

    const putParams = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, putParams);

    return Response.json(
      { uploadUrl, fileKey },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return Response.json(
      { error: 'Error generating upload URL' },
      { status: 500 }
    );
  }
}
