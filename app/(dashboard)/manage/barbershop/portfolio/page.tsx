"use client";

import { useState } from "react";
import Link from "next/link";

export default function PortfolioPage() {
  // Sample data for portfolio photos and cuts
  const [portfolio, setPortfolio] = useState([
    { id: 1, name: "Fade Cut", description: "A clean fade haircut.", image: "/Alen Reni Thomas.png" },
    { id: 2, name: "Buzz Cut", description: "A short, all-around buzz cut.", image: "/Alen Reni Thomas.png" },
    { id: 3, name: "Pompadour", description: "A stylish pompadour haircut.", image: "/Alen Reni Thomas.png" },
    { id: 4, name: "Undercut", description: "A trendy undercut with shaved sides.", image: "/Alen Reni Thomas.png" },
    { id: 5, name: "Crew Cut", description: "A sharp crew cut.", image: "/Alen Reni Thomas.png" },
    { id: 6, name: "Caesar Cut", description: "A classic Caesar cut.", image: "/Alen Reni Thomas.png" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCut, setSelectedCut] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState<any>(null);

  const handleEditClick = (cut: any) => {
    setSelectedCut(cut);
    setNewName(cut.name);
    setNewDescription(cut.description);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    if (selectedCut) {
      const updatedPortfolio = portfolio.map((cut) =>
        cut.id === selectedCut.id
          ? { ...cut, name: newName, description: newDescription, image: newImage || cut.image }
          : cut
      );
      setPortfolio(updatedPortfolio);
      setShowModal(false);
    }
  };

  const handleDelete = () => {
    const updatedPortfolio = portfolio.filter((cut) => cut.id !== selectedCut.id);
    setPortfolio(updatedPortfolio);
    setShowModal(false);
  };

  const handleAddNewCard = () => {
    const newId = portfolio.length + 1;
    const newItem = {
      id: newId,
      name: newName,
      description: newDescription,
      image: newImage || "/Alen Reni Thomas.png",
    };
    setPortfolio([...portfolio, newItem]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-6 px-6">
      <div className="w-full max-w-7xl space-y-6">
        
        {/* Back Button */}
        <div className="mb-2">
          <Link href="/manage/barbershop">
            <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md text-sm">
              ← Back to Barbershop
            </button>
          </Link>
        </div>

        {/* Title Section */}
        <div className="bg-gray-950 p-6 rounded-xl shadow-xl border border-gray-800 text-center">
          <h1 className="text-3xl font-bold text-white">💼 Manage Your Portfolio</h1>
          <p className="text-gray-400 text-lg mt-2">
            Upload and manage your photos to showcase your barbering work.
          </p>
        </div>

        {/* Add New Portfolio Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-4 bg-green-500 hover:bg-green-400 text-white rounded-md text-lg font-bold"
          >
            + Add New Portfolio Item
          </button>
        </div>

        {/* Portfolio Cards Section with scalable grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portfolio.map((cut) => (
            <div key={cut.id} className="bg-gray-950 p-4 rounded-xl shadow-md border border-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <img src={cut.image} alt={cut.name} className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold text-white">{cut.name}</h3>
              <p className="text-gray-400 mt-2">{cut.description}</p>

              {/* Edit Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleEditClick(cut)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Creating New Portfolio Item */}
      {showCreateModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-950 p-6 rounded-xl shadow-xl border border-gray-800 w-96">
            <h2 className="text-2xl font-semibold text-white mb-4">Create New Portfolio Item</h2>

            <div className="mb-4">
              <label className="text-gray-300">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-300">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="text-gray-300">Image</label>
              <input
                type="file"
                onChange={(e) => setNewImage(URL.createObjectURL(e.target.files![0]))}
                className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleAddNewCard}
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-950 p-6 rounded-xl shadow-xl border border-gray-800 w-96">
            <h2 className="text-2xl font-semibold text-white mb-4">Edit {selectedCut.name}</h2>

            <div className="mb-4">
              <label className="text-gray-300">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-300">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="text-gray-300">Change Image</label>
              <input
                type="file"
                onChange={(e) => setNewImage(URL.createObjectURL(e.target.files![0]))}
                className="w-full p-2 mt-2 bg-gray-800 text-white rounded-md"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md text-sm"
              >
                Save Changes
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm"
              >
                Delete
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
