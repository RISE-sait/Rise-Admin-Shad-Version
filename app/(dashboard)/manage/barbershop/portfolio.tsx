"use client"; // Required for React hooks

import { useState } from "react";

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setPhotos(fileArray);
    }
  };

  const handleFileUpload = () => {
    // Logic to upload files to the server can be added here
    alert("Portfolio photos uploaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex justify-center py-12 px-6">
      <div className="w-full max-w-7xl space-y-10">
        {/* Title Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-xl border border-gray-800 text-center">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-3">
            💼 <span className="text-white">Manage Portfolio</span>
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            Upload and manage photos to showcase your barbering work.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-950 p-8 rounded-xl shadow-md border border-gray-800">
          <h2 className="text-2xl font-semibold mb-3">Upload Portfolio Photos</h2>
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mb-4 p-2 text-gray-900"
            />
            <button
              onClick={handleFileUpload}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-md shadow-md"
            >
              Upload Photos
            </button>
          </div>

          {/* Display Uploaded Images */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-300">Uploaded Photos:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Uploaded photo ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <span className="absolute top-2 right-2 text-white bg-black rounded-full text-sm p-1">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
