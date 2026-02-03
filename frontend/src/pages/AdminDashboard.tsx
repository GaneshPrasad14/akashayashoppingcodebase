import { API_BASE_URL } from "@/config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  MessageSquare,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Star,
  Truck,
  Clock,
  RefreshCw,
  Package as PackageIcon,
  Trophy
} from "lucide-react";

interface AdminData {
  username: string;
  email: string;
  role: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
  createdAt: string;
}

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  product: { name: string };
  createdAt: string;
}



interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  isPublished: boolean;
  author: { username: string };
  createdAt: string;
}

interface GoldWinner {
  _id: string;
  name: string;
  district: string;
  prize: string;
  prizeType: string;
  date: string;
  isActive: boolean;
}

const AdminDashboard = () => {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [goldWinners, setGoldWinners] = useState<GoldWinner[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", originalPrice: "", category: "", stock: "", isFeatured: false
  });
  const [blogForm, setBlogForm] = useState({
    title: "", excerpt: "", content: "", tags: ""
  });
  const [goldWinnerForm, setGoldWinnerForm] = useState({
    name: "", district: "", prize: "5 Gram Gold Coin", prizeType: "first"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [goldWinnerDialogOpen, setGoldWinnerDialogOpen] = useState(false);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingGoldWinner, setEditingGoldWinner] = useState<GoldWinner | null>(null);

  // File states
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<FileList | null>(null);
  const [blogImage, setBlogImage] = useState<File | null>(null);

  useEffect(() => {
    checkAuth();
  }, [page]); // Reload data when page changes

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5035/api";

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.data);
        loadData();
      } else {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } catch (error) {
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  };

  const loadData = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const limit = 10;
      const [categoriesRes, productsRes, reviewsRes, blogsRes, ordersRes, goldWinnersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/categories?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reviews?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/blogs?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/orders?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/gold-winners?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const [categoriesData, productsData, reviewsData, blogsData, ordersData, goldWinnersData] = await Promise.all([
        categoriesRes.json(),
        productsRes.json(),
        reviewsRes.json(),
        blogsRes.json(),
        ordersRes.json(),
        goldWinnersRes.json()
      ]);

      setCategories(categoriesData.data || []);
      setProducts(productsData.data || []);
      setReviews(reviewsData.data || []);
      setBlogs(blogsData.data || []);
      setOrders(ordersData.data || []);
      setGoldWinners(goldWinnersData.data || []);

      // Calculate total pages based on the maximum count from any resource (simplified for dashboard view)
      // Ideally, each tab should have its own pagination, but for now we'll check the max pages
      const maxPages = Math.max(
        categoriesData.pagination?.pages || 1,
        productsData.pagination?.pages || 1,
        reviewsData.pagination?.pages || 1,
        blogsData.pagination?.pages || 1,
        ordersData.pagination?.pages || 1,
        goldWinnersData.pagination?.pages || 1
      );
      setTotalPages(maxPages);
    } catch (error) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Helper functions for order status display
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      case 'Shipped': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <RefreshCw className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <PackageIcon className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Form handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      // Add form fields
      Object.entries(categoryForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add image file
      if (categoryImage) {
        formData.append('image', categoryImage);
      }

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setCategoryForm({ name: "", description: "" });
        setCategoryImage(null);
        setCategoryDialogOpen(false);
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to create category");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.category) {
      setError("Please select a category");
      return;
    }

    setFormLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      // Add form fields
      Object.entries(productForm).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Add images
      if (productImages) {
        for (let i = 0; i < productImages.length; i++) {
          formData.append('images', productImages[i]);
        }
      }

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setProductForm({
          name: "", description: "", price: "", originalPrice: "", category: "", stock: "", isFeatured: false
        });
        setProductImages(null);
        setProductDialogOpen(false);
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to create product");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to approve review");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to delete category");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to delete product");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };



  const handleToggleProductFeatured = async (product: Product) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/products/${product._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isFeatured: !product.isFeatured })
      });

      if (response.ok) {
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to update product");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to delete review");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  // Blog handlers
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      // Add form fields
      Object.entries(blogForm).forEach(([key, value]) => {
        if (key === 'tags' && value) {
          formData.append(key, JSON.stringify(value.split(',').map(tag => tag.trim())));
        } else {
          formData.append(key, value);
        }
      });

      // Add image file
      if (blogImage) {
        formData.append('image', blogImage);
      }

      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setBlogForm({
          title: "", excerpt: "", content: "", tags: ""
        });
        setBlogImage(null);
        setBlogDialogOpen(false);
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to create blog");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleTogglePublishBlog = async (blogId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/publish`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to toggle blog publish status");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to delete blog");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  // Gold Winner handlers
  const handleSaveGoldWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingGoldWinner
        ? `${API_BASE_URL}/gold-winners/${editingGoldWinner._id}`
        : `${API_BASE_URL}/gold-winners`;

      const method = editingGoldWinner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(goldWinnerForm)
      });

      if (response.ok) {
        setGoldWinnerForm({
          name: "", district: "", prize: "5 Gram Gold Coin", prizeType: "first"
        });
        setGoldWinnerDialogOpen(false);
        setEditingGoldWinner(null);
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to save gold winner");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditGoldWinner = (winner: GoldWinner) => {
    setEditingGoldWinner(winner);
    setGoldWinnerForm({
      name: winner.name,
      district: winner.district,
      prize: winner.prize,
      prizeType: winner.prizeType
    });
    setGoldWinnerDialogOpen(true);
  };

  const handleDeleteGoldWinner = async (winnerId: string) => {
    if (!confirm("Are you sure you want to delete this winner?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/gold-winners/${winnerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadData(); // Refresh data
      } else {
        const error = await response.json();
        setError(error.message || "Failed to delete winner");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Akshaya Shopping" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {admin?.username}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter(r => !r.isApproved).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blogs</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="gold-winners">Gold Winners</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Manage product categories</CardDescription>
                  </div>
                  <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                          Create a new product category for your store.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateCategory} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category-name">Category Name *</Label>
                          <Input
                            id="category-name"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                            placeholder="Enter category name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-description">Description</Label>
                          <Textarea
                            id="category-description"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                            placeholder="Enter category description"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-image">Category Image</Label>
                          <Input
                            id="category-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCategoryDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={formLoading}>
                            {formLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Category"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {category.productCount} products
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your product inventory</CardDescription>
                  </div>
                  <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Add a new product to your inventory.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateProduct} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="product-name">Product Name *</Label>
                            <Input
                              id="product-name"
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              placeholder="Enter product name"
                              required
                              maxLength={100}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              {productForm.name.length}/100 characters
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="product-original-price">Market Price</Label>
                              <Input
                                id="product-original-price"
                                type="number"
                                step="0.01"
                                value={productForm.originalPrice}
                                onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="product-price">Offer Price *</Label>
                              <Input
                                id="product-price"
                                type="number"
                                step="0.01"
                                value={productForm.price}
                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                placeholder="0.00"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="product-category">Category *</Label>
                            <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-stock">Stock Quantity *</Label>
                            <Input
                              id="product-stock"
                              type="number"
                              value={productForm.stock}
                              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                              placeholder="0"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="product-featured"
                            checked={productForm.isFeatured}
                            onCheckedChange={(checked) =>
                              setProductForm({ ...productForm, isFeatured: checked as boolean })
                            }
                          />
                          <Label htmlFor="product-featured">Featured Product</Label>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="product-description">Description *</Label>
                          <Textarea
                            id="product-description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Enter product description"
                            rows={3}
                            required
                            maxLength={2000}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            {productForm.description.length}/2000 characters
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="product-images">Product Images *</Label>
                          <Input
                            id="product-images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setProductImages(e.target.files)}
                            required
                          />
                          <p className="text-sm text-gray-500">
                            Select multiple images (max 10). First image will be used as main image.
                          </p>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setProductDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={formLoading}>
                            {formLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Product"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category?.name || 'Unknown Category'}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-semibold">₹{product.price}</span>
                          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </Badge>
                          {product.isFeatured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={product.isFeatured ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleProductFeatured(product)}
                          title={product.isFeatured ? "Remove from Featured" : "Add to Featured"}
                        >
                          <Star className={`h-4 w-4 ${product.isFeatured ? "fill-current" : ""}`} />
                        </Button>

                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>Manage customer orders and track their status</CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate('/admin/orders')}
                    className="btn-primary"
                  >
                    View All Orders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-col items-center space-y-2">
                      <Package className="w-8 h-8 text-blue-600" />
                      <CardTitle className="text-lg">Total Orders</CardTitle>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-col items-center space-y-2">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <CardTitle className="text-lg">Delivered</CardTitle>
                      <p className="text-2xl font-bold text-green-600">
                        {orders.filter(o => o.orderStatus === 'Delivered').length}
                      </p>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-col items-center space-y-2">
                      <Truck className="w-8 h-8 text-orange-600" />
                      <CardTitle className="text-lg">In Transit</CardTitle>
                      <p className="text-2xl font-bold text-orange-600">
                        {orders.filter(o => o.orderStatus === 'Shipped').length}
                      </p>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-col items-center space-y-2">
                      <XCircle className="w-8 h-8 text-red-600" />
                      <CardTitle className="text-lg">Cancelled</CardTitle>
                      <p className="text-2xl font-bold text-red-600">
                        {orders.filter(o => o.orderStatus === 'Cancelled').length}
                      </p>
                    </CardHeader>
                  </Card>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold">Recent Orders</h3>
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <p className="font-medium">{order.orderId}</p>
                          <p className="text-gray-500">{order.customerName}</p>
                        </div>
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="ml-1">{order.orderStatus}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>Manage customer reviews and feedback</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{review.customerName}</h3>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            {review.isApproved ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <h4 className="font-medium mb-1">{review.title}</h4>
                          <p className="text-sm text-gray-700 mb-2 italic">"{review.comment}"</p>
                          <p className="text-sm text-gray-600 mb-2">{review.product?.name || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!review.isApproved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReview(review._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Blogs</CardTitle>
                    <CardDescription>Manage your blog posts</CardDescription>
                  </div>
                  <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Blog
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Blog</DialogTitle>
                        <DialogDescription>
                          Create a new blog post for your website.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateBlog} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="blog-title">Title *</Label>
                          <Input
                            id="blog-title"
                            value={blogForm.title}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            placeholder="Enter blog title"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blog-excerpt">Excerpt *</Label>
                          <Textarea
                            id="blog-excerpt"
                            value={blogForm.excerpt}
                            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            placeholder="Brief summary of the blog post"
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blog-content">Content *</Label>
                          <Textarea
                            id="blog-content"
                            value={blogForm.content}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            placeholder="Full blog content"
                            rows={10}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blog-tags">Tags (comma separated)</Label>
                          <Input
                            id="blog-tags"
                            value={blogForm.tags}
                            onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                            placeholder="kitchen, recipes, tips"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="blog-image">Blog Image *</Label>
                          <Input
                            id="blog-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBlogImage(e.target.files?.[0] || null)}
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setBlogDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={formLoading}>
                            {formLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Blog"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{blog.title}</h3>
                        <p className="text-sm text-gray-500">{blog.excerpt}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={blog.isPublished ? "default" : "secondary"}>
                            {blog.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            By {blog.author?.username || 'Unknown Author'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublishBlog(blog._id)}
                        >
                          {blog.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBlog(blog._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gold Winners Tab */}
          <TabsContent value="gold-winners">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gold Winners</CardTitle>
                    <CardDescription>Manage gold coin competition winners</CardDescription>
                  </div>
                  <Dialog open={goldWinnerDialogOpen} onOpenChange={setGoldWinnerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingGoldWinner(null);
                        setGoldWinnerForm({ name: "", district: "", prize: "5 Gram Gold Coin", prizeType: "first" });
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Winner
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingGoldWinner ? "Edit Winner" : "Add New Gold Winner"}</DialogTitle>
                        <DialogDescription>
                          {editingGoldWinner ? "Update winner details" : "Add a new gold coin competition winner."}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveGoldWinner} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="winner-name">Winner Name *</Label>
                          <Input
                            id="winner-name"
                            value={goldWinnerForm.name}
                            onChange={(e) => setGoldWinnerForm({ ...goldWinnerForm, name: e.target.value })}
                            placeholder="Enter winner name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="winner-district">District *</Label>
                          <Input
                            id="winner-district"
                            value={goldWinnerForm.district}
                            onChange={(e) => setGoldWinnerForm({ ...goldWinnerForm, district: e.target.value })}
                            placeholder="Enter district (e.g., Coimbatore)"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="winner-prizeType">Prize Category *</Label>
                          <Select
                            value={goldWinnerForm.prizeType}
                            onValueChange={(value) => {
                              const isFirst = value === "first";
                              setGoldWinnerForm({
                                ...goldWinnerForm,
                                prizeType: value,
                                prize: isFirst ? "5 Gram Gold Coin" : "1 Gram Gold Coin"
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select prize type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="first">
                                <span className="font-bold text-amber-600">First Prize</span> - 5 Gram Gold Coin
                              </SelectItem>
                              <SelectItem value="second">
                                <span className="font-bold text-gray-600">Second Prize</span> - 1 Gram Gold Coin
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setGoldWinnerDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={formLoading}>
                            {formLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              editingGoldWinner ? "Update Winner" : "Add Winner"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goldWinners.map((winner) => (
                    <div key={winner._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{winner.name}</h3>
                          <p className="text-sm text-gray-500">{winner.district}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={winner.prizeType === 'first' ? "default" : "secondary"}>
                              {winner.prize}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(winner.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditGoldWinner(winner)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGoldWinner(winner._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {goldWinners.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No gold winners added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-8 pb-8">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div >
  );
};

export default AdminDashboard;