import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Trophy, ArrowLeft, Loader2 } from "lucide-react";

interface GoldWinner {
  _id: string;
  name: string;
  orderId: string;
  prize: string;
  prizeType: string;
  date: string;
  image: string;
  testimonial: string;
  isActive: boolean;
}

const GoldWinnersAdmin = () => {
  const navigate = useNavigate();
  const [winners, setWinners] = useState<GoldWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWinner, setEditingWinner] = useState<GoldWinner | null>(null);
  const [form, setForm] = useState({
    name: "",
    orderId: "",
    prize: "5 Gram Gold Coin",
    prizeType: "first",
    testimonial: "",
    image: ""
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/gold-winners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setWinners(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch winners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const token = localStorage.getItem("adminToken");

    try {
      const url = editingWinner
        ? `${API_BASE_URL}/gold-winners/${editingWinner._id}`
        : `${API_BASE_URL}/gold-winners`;
      
      const response = await fetch(url, {
        method: editingWinner ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setDialogOpen(false);
        setForm({ name: "", orderId: "", prize: "5 Gram Gold Coin", prizeType: "first", testimonial: "", image: "" });
        setEditingWinner(null);
        fetchWinners();
      }
    } catch (error) {
      console.error("Failed to save winner:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this winner?")) return;
    
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API_BASE_URL}/gold-winners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchWinners();
      }
    } catch (error) {
      console.error("Failed to delete winner:", error);
    }
  };

  const handleEdit = (winner: GoldWinner) => {
    setEditingWinner(winner);
    setForm({
      name: winner.name,
      orderId: winner.orderId,
      prize: winner.prize,
      prizeType: winner.prizeType,
      testimonial: winner.testimonial,
      image: winner.image
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Trophy className="h-8 w-8 text-amber-500" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Gold Winners Management</h1>
                <p className="text-sm text-gray-500">Manage gold coin competition winners</p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingWinner(null); setForm({ name: "", orderId: "", prize: "5 Gram Gold Coin", prizeType: "first", testimonial: "", image: "" }); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Winner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingWinner ? "Edit Winner" : "Add New Winner"}</DialogTitle>
                  <DialogDescription>
                    {editingWinner ? "Update winner details" : "Add a new gold coin competition winner"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Winner Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter winner name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Order ID *</Label>
                    <Input
                      id="orderId"
                      value={form.orderId}
                      onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                      placeholder="Enter order ID"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prize">Prize *</Label>
                    <Select value={form.prize} onValueChange={(value) => setForm({ ...form, prize: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prize" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5 Gram Gold Coin">5 Gram Gold Coin (First Prize)</SelectItem>
                        <SelectItem value="1 Gram Gold Coin">1 Gram Gold Coin (Second Prize)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prizeType">Prize Type *</Label>
                    <Select value={form.prizeType} onValueChange={(value) => setForm({ ...form, prizeType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prize type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first">First Prize</SelectItem>
                        <SelectItem value="second">Second Prize</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Enter image URL (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial">Testimonial</Label>
                    <Textarea
                      id="testimonial"
                      value={form.testimonial}
                      onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                      placeholder="Winner testimonial (optional)"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={formLoading}>
                      {formLoading ? "Saving..." : editingWinner ? "Update Winner" : "Add Winner"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Winners</CardTitle>
              <Trophy className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winners.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">First Prize</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {winners.filter(w => w.prizeType === "first").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Second Prize</CardTitle>
              <Trophy className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {winners.filter(w => w.prizeType === "second").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Winners</CardTitle>
            <CardDescription>List of all gold coin competition winners</CardDescription>
          </CardHeader>
          <CardContent>
            {winners.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No winners added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {winners.map((winner) => (
                  <div key={winner._id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          winner.prizeType === "first" 
                            ? "bg-gradient-to-r from-amber-400 to-yellow-500" 
                            : "bg-gray-200"
                        }`}>
                          <Trophy className={`w-6 h-6 ${winner.prizeType === "first" ? "text-white" : "text-gray-600"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{winner.name}</h3>
                          <p className="text-sm text-gray-500">{winner.orderId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        winner.prizeType === "first" 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {winner.prize}
                      </span>
                    </div>
                    {winner.testimonial && (
                      <p className="text-sm text-gray-600 italic mb-3 line-clamp-2">"{winner.testimonial}"</p>
                    )}
                    <p className="text-xs text-gray-400 mb-3">
                      {new Date(winner.date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(winner)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(winner._id)} className="flex-1 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GoldWinnersAdmin;
