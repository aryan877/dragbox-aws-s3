'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import FileList from '@/components/FileList';
import { FileItem } from '@/types/FileItem';
import Alert from '@/components/Alert';

function Page() {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<
    'info' | 'error' | 'success' | 'warning' | ''
  >('');

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ files: FileItem[] }>(
          '/api/get-files'
        );
        setUploadedFiles(response.data.files);
      } catch (error) {
        console.error('Failed to fetch files:', error);
        showAlert('Failed to fetch files.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setIsUploading(true);
      let fileKey = '';
      try {
        const response = await axios.post<{
          uploadUrl: string;
          fileKey: string;
        }>('/api/upload-url', {
          fileName: file.name,
          fileType: file.type,
        });
        const { uploadUrl, fileKey: key } = response.data;
        fileKey = key;
        showAlert('Upload has begun.', 'info');
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / (progressEvent.total || 1)) * 100
            );
            setUploadProgress(progress);
          },
        });
      } catch (error) {
        console.error('Failed to upload file:', error);
        showAlert('Failed to upload file.', 'error');
        setIsUploading(false);
        return;
      }

      try {
        const { data: uploadedFile } = await axios.get<FileItem>(
          `/api/get-file?fileKey=${fileKey}`
        );
        setUploadedFiles((prevFiles) => [uploadedFile, ...prevFiles]);
        showAlert('File uploaded successfully!', 'success');
      } catch (error) {
        console.error('Failed to get file URL:', error);
        showAlert('Failed to get file URL.', 'error');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showAlert('URL copied to clipboard!', 'success');
  };

  const toggleSelection = (index: number) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((file, i) =>
        i === index ? { ...file, isSelected: !file.isSelected } : file
      )
    );
  };

  const selectAllFiles = (isSelected: boolean) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((file) => ({ ...file, isSelected }))
    );
  };

  const deleteSelectedFiles = async () => {
    const selectedFileKeys = uploadedFiles
      .filter((file) => file.isSelected)
      .map((file) => file.fileKey);

    if (selectedFileKeys.length === 0) {
      showAlert('No files selected for deletion.', 'warning');
      return;
    }

    try {
      setLoading(true);
      await axios.delete('/api/delete-files', {
        data: {
          fileKeys: selectedFileKeys,
        },
      });
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => !selectedFileKeys.includes(file.fileKey))
      );
      showAlert('Selected files deleted successfully.', 'success');
    } catch (error) {
      console.error('Failed to delete files:', error);
      showAlert('Failed to delete selected files.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isAnyFileSelected = uploadedFiles.some((file) => file.isSelected);

  const showAlert = (
    message: string,
    type: 'info' | 'error' | 'success' | 'warning' | ''
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4 pb-16 mt-16 relative">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Dragbox S3 File Upload</h1>
        <p className="text-lg font-semibold text-gray-600"></p>
      </div>

      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed ${
          isDragActive ? 'border-primary' : 'border-base-content'
        } rounded-lg text-center`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary">Drop the file here ...</p>
        ) : (
          <p>Drag and drop a file here, or click to select a file</p>
        )}
      </div>
      {alertMessage && alertType && (
        <Alert message={alertMessage} type={alertType} />
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Uploaded Files</h2>
        {isUploading && (
          <div className="flex justify-center items-center mb-4">
            <div
              className="radial-progress"
              //@ts-ignore
              style={{ '--value': uploadProgress }}
              role="progressbar"
            >
              {Math.floor(uploadProgress)}%
            </div>
          </div>
        )}
        {isAnyFileSelected && (
          <div className="flex mb-2">
            <button
              className="btn btn-warning mr-2"
              onClick={() =>
                setUploadedFiles((prevFiles) =>
                  prevFiles.map((file) => ({ ...file, isSelected: false }))
                )
              }
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={deleteSelectedFiles}>
              Delete Selected Files
            </button>
          </div>
        )}

        <FileList
          loading={loading}
          selectAllFiles={selectAllFiles}
          files={uploadedFiles}
          toggleSelection={toggleSelection}
          copyToClipboard={copyToClipboard}
        />
      </div>
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div
            className="radial-progress animate-spin"
            //@ts-ignore
            style={{ '--size': '3rem' }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Page;
