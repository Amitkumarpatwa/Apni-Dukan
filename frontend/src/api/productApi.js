import { http } from "./http";

export const productApi = {
  getProducts: (params) => http.get("/products", { params }),
  getProductById: (id) => http.get(`/products/${id}`),
  createProduct: (formData) =>
    http.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateProduct: (id, formData) =>
    http.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProduct: (id) => http.delete(`/products/${id}`),
  
  // Review API placeholders
  getProductReviews: (id) => http.get(`/products/${id}/reviews`).catch(() => ({ data: { data: [] } })),
  submitReview: (id, reviewData) => http.post(`/products/${id}/reviews`, reviewData),
};
