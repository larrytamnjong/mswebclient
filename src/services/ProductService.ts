import http from "./http-common";
import { Product, PriorityLevel, FavoriteType, ProductCategory, ProductType } from "../types/Product";

class ProductService {
  getAllProducts() {
    return http.get<Product[]>("/products/");
  }

  getProduct(id: number) {
    return http.get<Product>(`/products/${id}/`);
  }

  createProduct(data: Product) {
    return http.post<Product>("/products/", data);
  }

  updateProduct(id: number, data: Product) {
    return http.put<Product>(`/products/${id}/`, data);
  }

  deleteProduct(id: number) {
    return http.delete(`/products/${id}/`);
  }
  getAllPriorityLevels() {
    return http.get<PriorityLevel[]>("/priority-levels/");
  }

  getPriorityLevel(id: number) {
    return http.get<PriorityLevel>(`/priority-levels/${id}/`);
  }

  getAllFavoriteTypes() {
    return http.get<FavoriteType[]>("/favorite-types/");
  }

  getFavoriteType(id: number) {
    return http.get<FavoriteType>(`/favorite-types/${id}/`);
  }

  getAllProductCategories() {
    return http.get<ProductCategory[]>("/product-categories/");
  }

  getProductCategory(id: number) {
    return http.get<ProductCategory>(`/product-categories/${id}/`);
  }

  createProductCategory(data: ProductCategory) {
    return http.post<ProductCategory>("/product-categories/", data);
  }

  updateProductCategory(id: number, data: ProductCategory) {
    return http.put<ProductCategory>(`/product-categories/${id}/`, data);
  }

  deleteProductCategory(id: number) {
    return http.delete(`/product-categories/${id}/`);
  }
  getAllProductTypes() {
    return http.get<ProductType[]>("/product-types/");
  }

  getProductType(id: number) {
    return http.get<ProductType>(`/product-types/${id}/`);
  }
}

export default new ProductService();