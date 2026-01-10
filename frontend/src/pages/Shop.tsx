import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL, UPLOADS_URL } from "@/config";
import { Filter, Grid3X3, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  mainImage: string;
  category: { name: string; _id: string };
  description: string;
  isFeatured: boolean;
  stock: number;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  sortOrder: number;
}

const Shop = () => {
  // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5035/api";
  // const UPLOADS_URL = API_BASE_URL.replace('/api', ''); // Remove /api for image URLs
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/public/products`),
          fetch(`${API_BASE_URL}/public/categories`)
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        if (productsData.success) {
          setProducts(productsData.data);
        }
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by Category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category._id === selectedCategory);
    }

    // Filter by Search Query
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, products, searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeader
            title="Shop All Products"
            subtitle="Browse our complete collection of premium products at the best prices"
          />
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeader
            title="Shop All Products"
            subtitle="Browse our complete collection of premium products at the best prices"
          />
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 md:py-24 bg-background">
      <div className="container">
        <SectionHeader
          title="Shop All Products"
          subtitle="Browse our complete collection of premium products at the best prices"
        />

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex items-center gap-2 border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          Showing {filteredProducts.length} products
        </p>

        {/* Products Grid */}
        <div
          className={`grid gap-6 md:gap-8 ${viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
            }`}
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard
                id={product._id}
                name={product.name}
                image={product.mainImage ? `${UPLOADS_URL}${product.mainImage}` : "/placeholder.svg"}
                originalPrice={product.price}
                offerPrice={product.price}
                rating={4.5} // Default rating since not in API
                reviewCount={0} // Default since not in API
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No products found in this category.
            </p>
            <Button
              onClick={() => setSelectedCategory("all")}
              className="mt-4 btn-primary"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;
