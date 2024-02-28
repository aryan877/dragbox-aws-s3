import { FileItem } from '@/types/FileItem';
import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@clerk/nextjs';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  try {
    const user = auth();
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: `uploads/${user.userId}/`,
    };

    const listObjectsCommand = new ListObjectsCommand(params);
    const s3Response = await s3Client.send(listObjectsCommand);

    const files = await Promise.all(
      (s3Response.Contents || []).map(async (content) => {
        const getObjectParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: content.Key,
        };

        const getObjectCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3Client, getObjectCommand, {
          expiresIn: 3600,
        });

        const file: FileItem = {
          fileName: content.Key?.split('/').pop() as string,
          fileSize: `${((content.Size as number) / 1024).toFixed(2)} KB`,
          url,
          fileKey: content.Key as string,
          createdAt: content.LastModified as Date,
          isSelected: false,
        };

        return file;
      })
    );

    files.sort((a, b) => (b.createdAt as any) - (a.createdAt as any));

    return Response.json(
      { files },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error listing files:', error);
    return Response.json(
      { error: 'Error listing files' },
      {
        status: 500,
      }
    );
  }
}
