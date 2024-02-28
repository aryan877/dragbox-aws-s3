import React from 'react';
import dayjs from 'dayjs';
import { FileItem } from '@/types/FileItem';

type FileListProps = {
  loading: boolean;
  files: FileItem[];
  toggleSelection: (index: number) => void;
  copyToClipboard: (url: string) => void;
  selectAllFiles: (isSelected: boolean) => void;
};

const FileList: React.FC<FileListProps> = ({
  loading,
  files,
  toggleSelection,
  copyToClipboard,
  selectAllFiles,
}) => {
  const areAllFilesSelected =
    files.length > 0 && files.every((file) => file.isSelected);

  if (files.length === 0 && !loading) {
    return <div className="text-center">No files uploaded yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={areAllFilesSelected}
                  onChange={(e) => selectAllFiles(e.target.checked)}
                />
              </label>
            </th>
            <th>Name</th>
            <th>Size</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={file.isSelected}
                    onChange={() => toggleSelection(index)}
                  />
                </label>
              </th>
              <td>{file.fileName}</td>
              <td>{file.fileSize}</td>
              <td>{dayjs(file.createdAt).format('DD MMM YYYY HH:mm')}</td>
              <td>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={file.url}
                  download={file.fileName}
                  className="btn btn-xs btn-success mr-2"
                >
                  Open
                </a>

                <button
                  className="btn btn-xs btn-info mr-2"
                  onClick={() => copyToClipboard(file.url)}
                >
                  Copy URL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
