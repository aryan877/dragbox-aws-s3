import React from 'react';

type AlertProps = {
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
};

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  if (!message) return null;

  const alertTypes = {
    info: (
      <div className="alert mt-4 alert-info">
        <div className="flex-1">
          <label>{message}</label>
        </div>
      </div>
    ),
    error: (
      <div className="alert mt-4 alert-error">
        <div className="flex-1">
          <label>{message}</label>
        </div>
      </div>
    ),
    success: (
      <div className="alert mt-4 alert-success">
        <div className="flex-1">
          <label>{message}</label>
        </div>
      </div>
    ),
    warning: (
      <div className="alert mt-4 alert-warning">
        <div className="flex-1">
          <label>{message}</label>
        </div>
      </div>
    ),
  };

  return alertTypes[type];
};

export default Alert;
