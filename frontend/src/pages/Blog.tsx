import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  author: { username: string };
  createdAt: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
        const response = await fetch(`${API_BASE_URL}/public/blogs`);
        const data = await response.json();
        if (data.success) {
          setBlogs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen py-16 md:py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blogs...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 md:py-24 bg-background">
      <div className="container">
        <SectionHeader
          title="Our Blog"
          subtitle="Tips, guides, and insights to help you make the best shopping decisions"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <article
              key={post._id}
              className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300 animate-fade-in-up group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                <img
                  src={post.image ? `${import.meta.env.VITE_API_BASE_URL || "/api"}${post.image}` : "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </Link>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author.username}
                  </span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;
