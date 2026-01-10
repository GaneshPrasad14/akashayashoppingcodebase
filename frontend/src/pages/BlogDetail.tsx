import { API_BASE_URL } from "@/config";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  author: { username: string };
  createdAt: string;
  tags: string[];
}

const BlogDetail = () => {
  const { id } = useParams(); // App.tsx defines route as /blog/:id
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
  const UPLOADS_URL = (API_BASE_URL || "").replace('/api', '');

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        const response = await fetch(`${API_BASE_URL}/public/blogs/${id}`);
        const data = await response.json();

        if (data.success) {
          setPost(data.data);
          // Fetch related blogs
          const relatedResponse = await fetch(`${API_BASE_URL}/public/blogs?page=1&limit=3`);
          const relatedData = await relatedResponse.json();
          if (relatedData.success) {
            setRelatedPosts(relatedData.data.filter((p: BlogPost) => p._id !== data.data._id).slice(0, 2));
          }
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen py-16 md:py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen py-16 md:py-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/blog">
            <Button className="btn-primary">Back to Blog</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 md:py-16 bg-background">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Hero Image */}
        <div className="aspect-video rounded-2xl overflow-hidden mb-8">
          <img
            src={post.image ? `${UPLOADS_URL}${post.image}` : "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.author.username}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-8">
          {post.title}
        </h1>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-xl leading-relaxed">{post.excerpt}</p>
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-primary-light rounded-2xl text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Ready to Shop?
          </h3>
          <Link to="/shop">
            <Button className="btn-primary gap-2">
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">
              More Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((p) => (
                <Link
                  key={p._id}
                  to={`/blog/${p.slug || p._id}`}
                  className="flex gap-4 p-4 bg-card rounded-xl hover:shadow-elegant transition-shadow group"
                >
                  <img
                    src={p.image ? `${UPLOADS_URL}${p.image}` : "/placeholder.svg"}
                    alt={p.title}
                    className="w-24 h-24 rounded-lg object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogDetail;
