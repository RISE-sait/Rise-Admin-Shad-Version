"use client";
import { useState } from "react";
import Link from "next/link";

type PortfolioItem = {
  id: number;
  name: string;
  description: string;
  image: string;
};

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { id: 1, name: "Fade Cut", description: "A clean fade haircut.", image: "/Alen Reni Thomas.png" },
    { id: 2, name: "Buzz Cut", description: "A short, all-around buzz cut.", image: "/Alen Reni Thomas.png" },
    { id: 3, name: "Pompadour", description: "A stylish pompadour haircut.", image: "/Alen Reni Thomas.png" },
  ]);

  const [modalOpen, setModalOpen] = useState<"edit" | "create" | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });

  const handleSubmit = () => {
    if (modalOpen === "create") {
      setPortfolio([...portfolio, { 
        id: portfolio.length + 1, 
        ...formData,
        image: formData.image || "/Alen Reni Thomas.png"
      }]);
    } else if (selectedItem) {
      setPortfolio(portfolio.map(item => 
        item.id === selectedItem.id ? { ...item, ...formData } : item
      ));
    }
    setModalOpen(null);
    setFormData({ name: "", description: "", image: "" });
  };

  const handleDelete = () => {
    if (selectedItem) {
      setPortfolio(portfolio.filter(item => item.id !== selectedItem.id));
      setModalOpen(null);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-black text-white">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/manage/barbershop">
          <Button className="bg-black border border-gray-800">← Back to Barbershop</Button>
        </Link>
        <h1 className="text-3xl font-bold">Manage Portfolio</h1>
        <p className="text-gray-400">Showcase your barbering work</p>
      </div>

      {/* Add New Button */}
      <Button className="w-full bg-green-500 hover:bg-green-400" onClick={() => setModalOpen("create")}>
        + Add New Item
      </Button>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {portfolio.map(item => (
          <Card key={item.id}>
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-400">{item.description}</p>
              <Button 
                className="w-full mt-4 bg-black hover:bg-yellow-500" 
                onClick={() => {
                  setSelectedItem(item);
                  setFormData(item);
                  setModalOpen("edit");
                }}
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Combined Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-xl border border-gray-800 w-96 space-y-4">
            <h2 className="text-2xl font-bold">
              {modalOpen === "create" ? "Create New Item" : `Edit ${selectedItem?.name}`}
            </h2>

            <input
              placeholder="Name"
              className="w-full p-2 bg-gray-900 rounded border border-gray-800"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />

            <textarea
              placeholder="Description"
              className="w-full p-2 bg-gray-900 rounded border border-gray-800"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />

            <input
              type="file"
              onChange={e => setFormData({...formData, image: URL.createObjectURL(e.target.files![0])})}
              className="w-full p-2 bg-gray-900 rounded border border-gray-800"
            />

            <div className="flex gap-4">
              <Button className="flex-1 bg-green-500 hover:bg-green-400" onClick={handleSubmit}>
                {modalOpen === "create" ? "Create" : "Save"}
              </Button>
              {modalOpen === "edit" && (
                <Button className="flex-1 bg-red-500 hover:bg-red-400" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button className="flex-1 bg-gray-800 hover:bg-gray-700" onClick={() => setModalOpen(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Components
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-black rounded-xl border border-gray-800 overflow-hidden">
    {children}
  </div>
);

const Button = ({ 
  children, 
  className = "", 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string 
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`px-4 py-2 rounded-md transition-all ${className}`}
    {...props}
  >
    {children}
  </button>
);