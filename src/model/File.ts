import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  userId: string; 
  fileKey: string;
  url: string; 
  fileName: string; 
  fileSize: string; 
  createdAt: Date; 
}

const FileSchema: Schema<IFile> = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
  },
  fileKey: {
    type: String,
    required: [true, 'File key is required'],
    unique: true,
  },
  url: {
    type: String,
    required: [true, 'File URL is required'],
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
  },
  fileSize: {
    type: String,
    required: [true, 'File size is required'],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const FileModel =
  (mongoose.models.File as mongoose.Model<IFile>) ||
  mongoose.model<IFile>('File', FileSchema);

export default FileModel;
