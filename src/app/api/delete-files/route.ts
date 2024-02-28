import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(request: Request) {
  const { fileKeys } = await request.json();

  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Delete: {
      Objects: fileKeys.map((key: string) => ({ Key: key })),
    },
  };

  try {
    await s3Client.send(new DeleteObjectsCommand(deleteParams));
    return Response.json(
      { message: 'Files deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting files:', error);
    return Response.json({ error: 'Error deleting files' }, { status: 500 });
  }
}
