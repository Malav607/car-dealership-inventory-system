import React, { useState } from "react";
import Modal from "./Modal";
import { CAR_BRAND_CATALOG, getBrandPresetImages } from "../utils/carImageCatalog";
import { Image, CheckCircle, Search } from "lucide-react";

const BrandImagePickerModal = ({ isOpen, onClose, selectedBrand, onSelectImage }) => {
  const [activeBrand, setActiveBrand] = useState(selectedBrand || "Porsche");
  const brandsList = Object.keys(CAR_BRAND_CATALOG);
  const images = getBrandPresetImages(activeBrand);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Brand Image Asset Library" maxWidth="max-w-4xl">
      <div className="space-y-6">
        <p className="text-xs text-slate-400">Select a high-resolution preset image from our curated 15-brand asset collection.</p>

        {/* Brand Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {brandsList.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeBrand === brand
                  ? "bg-cyan-accent text-obsidian-950 shadow-glow"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Image Thumbnails Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imgItem, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectImage(imgItem.url);
                onClose();
              }}
              className="glass-panel p-2 rounded-2xl border border-slate-800 hover:border-cyan-accent cursor-pointer group transition-all"
            >
              <div className="relative h-36 rounded-xl overflow-hidden mb-2">
                <img src={imgItem.url} alt={imgItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-obsidian-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-cyan-accent text-obsidian-950 font-bold rounded-lg text-xs shadow-glow">
                    Select Image
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-200 block truncate">{imgItem.title}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default BrandImagePickerModal;
