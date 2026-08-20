import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { productApi } from "../api/productApi";
import { useAuth } from "../context/useAuth";
import ImageUploader from "../components/ImageUploader";

const AdminDashboardPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [products, setProducts] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingProductId, setEditingProductId] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resetUploader, setResetUploader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    const response = await productApi.getProducts({ limit: 50 });
    setProducts(response.data.data.items);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadProducts = async () => {
      const response = await productApi.getProducts({ limit: 50 });
      setProducts(response.data.data.items);
    };

    loadProducts();
  }, [isAuthenticated]);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMsg("");
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("outOfStock", values.outOfStock ? "true" : "false");

      selectedFiles.forEach((file) => formData.append("images", file));

      if (editingProductId) {
        existingImages.forEach((img) => formData.append("existingImages", img));
        await productApi.updateProduct(editingProductId, formData);
        setSuccessMsg("Product updated successfully!");
      } else {
        await productApi.createProduct(formData);
        setSuccessMsg("Product created successfully!");
      }

      reset();
      setSelectedFiles([]);
      setExistingImages([]);
      setEditingProductId("");
      setResetUploader((prev) => !prev);
      fetchProducts();
      
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (product) => {
    setEditingProductId(product._id);
    setError("");
    setSuccessMsg("");
    reset({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      outOfStock: product.outOfStock || false,
    });
    setExistingImages(product.images || []);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        setError("");
        await productApi.deleteProduct(id);
        setSuccessMsg("Product deleted successfully!");
        fetchProducts();
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  if (!isAuthenticated) {
    return <p className="text-sm text-red-600">Please login from the admin page first.</p>;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Dashboard</h1>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:border-white/40 hover:text-white"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-xl shadow-black/20 sm:p-6 relative overflow-hidden"
      >
        <h2 className="text-lg font-semibold text-white mb-4">{editingProductId ? "Edit Product" : "Add Product"}</h2>
        
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 font-medium">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 font-medium">
            {error}
          </div>
        )}
        
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            {...register("name", { required: true })}
            placeholder="Name"
            className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-500"
          />
          <input
            {...register("price", { required: true })}
            type="number"
            placeholder="Price"
            className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-500"
          />
          <input
            {...register("category", { required: "Category is required." })}
            placeholder="Category"
            className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-500 sm:col-span-2"
          />
          {errors.category && <p className="text-sm text-red-400 sm:col-span-2">{errors.category.message}</p>}
          <textarea
            {...register("description", {
              required: "Description is required.",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters.",
              },
            })}
            placeholder="Description"
            className="min-h-28 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-500 sm:col-span-2"
          />
          {errors.description && <p className="text-sm text-red-400 sm:col-span-2">{errors.description.message}</p>}
          <div className="sm:col-span-2 flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="outOfStock"
              {...register("outOfStock")}
              className="w-5 h-5 rounded border-white/10 bg-slate-950/60 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900"
            />
            <label htmlFor="outOfStock" className="text-sm font-medium text-slate-300">
              Mark as Out of Stock
            </label>
          </div>
          <div className="sm:col-span-2 mt-2">
            <ImageUploader 
              onFilesChange={setSelectedFiles} 
              onExistingImagesChange={setExistingImages}
              existingImages={existingImages}
              resetTrigger={resetUploader} 
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : editingProductId ? "Update Product" : "Create Product"}
        </button>
        {editingProductId && (
          <button
            type="button"
            onClick={() => {
              setEditingProductId("");
              reset();
              setExistingImages([]);
              setError("");
              setSuccessMsg("");
              setResetUploader((prev) => !prev);
            }}
            className="mt-6 ml-3 rounded-xl border border-white/20 bg-transparent px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-xl shadow-black/20 mt-8">
        <h2 className="mb-4 ml-2 mt-2 text-lg font-semibold text-white">Manage Products</h2>
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead>
            <tr className="border-b border-white/10 text-slate-300">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-white/5 transition hover:bg-white/5">
                <td className="px-4 py-3 text-white font-medium">{product.name}</td>
                <td className="px-4 py-3">
                  {product.outOfStock ? (
                    <span className="rounded bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400">Out of Stock</span>
                  ) : (
                    <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">In Stock</span>
                  )}
                </td>
                <td className="px-4 py-3 text-cyan-300">₹{product.price}</td>
                <td className="space-x-2 px-4 py-3">
                  <button
                    onClick={() => startEdit(product)}
                    className="rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-3 py-1 text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1 text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-slate-500">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
