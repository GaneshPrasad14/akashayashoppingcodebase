import { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryCard from "@/components/ui/CategoryCard";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  sortOrder: number;
}

const Categories = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5035/api";
  const UPLOADS_URL = API_BASE_URL.replace('/api', ''); // Remove /api for image URLs
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/categories`);
        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        } else {
          setError("Failed to load categories");
        }
      } catch (error) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeader
            title="Shop by Category"
            subtitle="Explore our wide range of product categories and find exactly what you're looking for"
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
            title="Shop by Category"
            subtitle="Explore our wide range of product categories and find exactly what you're looking for"
          />
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 md:py-24 bg-background">
      <div className="container">
        <SectionHeader
          title="Shop by Category"
          subtitle="Explore our wide range of product categories and find exactly what you're looking for"
        />

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategoryCard
                  name={category.name}
                  slug={category._id}
                  image={category.image ? `${UPLOADS_URL}${category.image}` : "/placeholder.svg"}
                  productCount={category.productCount}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Categories;
