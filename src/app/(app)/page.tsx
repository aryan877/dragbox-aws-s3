'use client';

import { Upload } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-base-200">
        <section className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary py-2">
              Welcome to Dragbox
            </h1>
          </div>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            The simplest way to upload and share your files.
          </p>
          <p className="mt-3 md:mt-4 text-sm md:text-base">
            Powered by <span className="font-bold">AWS S3</span>
          </p>
        </section>

        {/* Upload section */}
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 mb-4" />
              <p className="mb-4">Drag and drop your files here</p>
              <p className="mb-4">or</p>
              <button className="btn btn-primary">Browse files</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-base-300">
        © 2023 Dragbox. All rights reserved.
      </footer>
    </>
  );
}
