"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  highlightFilter: string;
  setHighlightFilter: (value: string) => void;
}

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  highlightFilter,
  setHighlightFilter,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari produk..."
          className="pl-8 w-full sm:w-[250px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Select value={highlightFilter} onValueChange={setHighlightFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter highlight" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Produk</SelectItem>
          <SelectItem value="highlighted">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Produk Highlight
            </div>
          </SelectItem>
          <SelectItem value="not-highlighted">Produk Biasa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
