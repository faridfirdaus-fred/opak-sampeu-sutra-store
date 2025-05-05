"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
 // ShadCN UI Select

interface SearchAndFilterProps {
  categories: string[];
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  categories,
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const setSelectedCategory = useState("Semua")[1];

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilter(category);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* Filter by Category */}
      <div className="flex items-center gap-2">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Kategori:
        </label>
        <Select
          onValueChange={(value) => handleCategoryChange(value)}
          defaultValue="Semua"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua">Semua</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search by Name */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Input
          type="text"
          placeholder="Cari Produk"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-auto"
        />
        <Button
          onClick={handleSearch}
          className="bg-black text-white hover:bg-gray-800"
        >
          Cari
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilter;
