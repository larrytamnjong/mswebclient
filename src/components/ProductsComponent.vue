
<template>
  <MDBContainer>
    <div class="container-fluid py-4">
      <div class="row page-header mb-3">
        <div class="col-md-6">
          <h4><i class="bi bi-box-seam me-2"></i>Products</h4>
        </div>
        <div class="col-md-6 d-flex justify-content-md-end align-items-start">
          <button v-if="!showForm" class="btn btn-primary" @click="startCreate">
            <i class="bi bi-plus-circle me-1"></i> Add New Product
          </button>
          <button v-else class="btn btn-secondary" @click="cancelForm">
            <i class="bi bi-arrow-left me-1"></i> Back
          </button>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-if="!showForm && !loading" class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover table-sm table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Favorite</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Internal Reference</th>
                      <th>Responsible</th>
                      <th class></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, index) in products" :key="product.id!">
                      <td>{{ index + 1 }}</td>
                      <td>{{ product.favorite_name }}</td>
                      <td>{{ product.name }}</td>
                      <td>{{ product.product_category_name }}</td>
                      <td>{{ product.internal_reference }}</td>
                      <td>{{ product.responsible}}</td>
                      <td class="text-end">
                        <button
                          class="btn btn-sm btn-outline-secondary me-1"
                          @click="startEdit(product)"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteProduct(product.id!)"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="products.length === 0">
                      <td colspan="6" class="text-center">No products found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="mb-3">
                {{ isEditing ? "Edit Product" : "Create New Product" }}
              </h5>
              <form @submit.prevent="submitForm">
                <div class="row">
                   <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Favorite</label>
                    <select v-model="form.favorite" class="form-select" required>
                      <option value="" disabled selected>Select a favorite type</option>
                      <option 
                        v-for="fav in favoriteTypes" 
                        :key="fav.id" 
                        :value="fav.id"
                        :style="`color: ${fav.color}`"
                      >
                        {{ fav.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Category</label>
                    <select v-model="form.product_category" class="form-select" required>
                      <option value="" disabled selected>Select a category</option>
                      <option 
                        v-for="category in productCategories" 
                        :key="category.id" 
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Product Name</label>
                    <input v-model="form.name" type="text" class="form-control" required />
                  </div>
                   <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Responsible</label>
                    <input v-model="form.responsible" type="text" class="form-control" required />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Price</label>
                    <input v-model="form.sales_price" type="number" step="0.01" class="form-control"  required/>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Stock</label>
                    <input v-model="form.quantity_on_hand" type="number" class="form-control" />
                  </div>
                </div>
                <div class="row">
                   <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Product Type</label>
                    <select v-model="form.product_type" class="form-select" required>
                      <option value="" disabled selected>Select a product type</option>
                      <option 
                        v-for="type in productTypes" 
                        :key="type.id" 
                        :value="type.id"
                      >
                        {{ type.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Cost</label>
                    <input v-model="form.cost" type="number" class="form-control" required />
                  </div>
                </div>

                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-success me-2">
                    <i class="bi bi-save me-1"></i> Save
                  </button>
                  <button type="button" class="btn btn-secondary" @click="cancelForm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MDBContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MDBContainer } from "mdb-vue-ui-kit";
import { Product, ProductCategory, ProductType, FavoriteType } from "../types/Product";
import ProductService from "../services/ProductService";

const products = ref<Product[]>([]);
const favoriteTypes = ref<FavoriteType[]>([]);
const productCategories = ref<ProductCategory[]>([]);
const productTypes = ref<ProductType[]>([]);
const showForm = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const ALERT_TIMEOUT = 3000; 

const form = ref<Product>({
  favorite: null,
  name: "",
  internal_reference: "",
  responsible: null,
  barcode: "",
  sales_price: 0,
  cost: 0,
  product_category: null,
  product_type: null,
  quantity_on_hand: 0,
  forecasted_quantity: 0,
  activity_exception_decoration: null
});

const emptyProduct: Product = {
  favorite: null,
  name: "",
  internal_reference: "",
  responsible: null,
  barcode: null,
  sales_price: 0,
  cost: 0,
  product_category: null,
  product_type: null,
  quantity_on_hand: 0,
  forecasted_quantity: 0,
  activity_exception_decoration: null
};

const getErrorMessage = (e: any): string => {
  if (e.response?.data) {
    const data = e.response.data;

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (typeof data === "object") {
      return Object.entries(data)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
        .join(" | ");
    }
  }
  return e.message || "An unexpected error occurred";
};

const showError = (msg: string) => {
  error.value = msg;
  setTimeout(() => {
    error.value = null;
  }, ALERT_TIMEOUT);
};

const showSuccess = (msg: string) => {
  success.value = msg;
  setTimeout(() => {
    success.value = null;
  }, ALERT_TIMEOUT);
};

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await ProductService.getAllProducts();
    products.value = response.data;
  } catch (e: any) {
    showError(getErrorMessage(e));
  } finally {
    loading.value = false;
  }
};

const fetchFavoriteTypes = async () => {
  try {
    const response = await ProductService.getAllFavoriteTypes();
    favoriteTypes.value = response.data;
  } catch (e: any) {
    console.error("Error fetching favorite types:", getErrorMessage(e));
  }
};

const fetchProductCategories = async () => {
  try {
    const response = await ProductService.getAllProductCategories();
    productCategories.value = response.data;
  } catch (e: any) {
    console.error("Error fetching product categories:", getErrorMessage(e));
  }
};

const fetchProductTypes = async () => {
  try {
    const response = await ProductService.getAllProductTypes();
    productTypes.value = response.data;
  } catch (e: any) {
    console.error("Error fetching product types:", getErrorMessage(e));
  }
};

const submitForm = async () => {
  loading.value = true;
  error.value = null;
  success.value = null;
  try {
    if (isEditing.value && form.value.id) {
      await ProductService.updateProduct(form.value.id, form.value);
      showSuccess("Product updated successfully");
    } else {
      await ProductService.createProduct(form.value);
      showSuccess("Product created successfully");
    }
    await fetchProducts();
    cancelForm();
  } catch (e: any) {
    showError(getErrorMessage(e));
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (id: number) => {
  if (!confirm("Are you sure you want to delete this product?")) return;
  loading.value = true;
  try {
    await ProductService.deleteProduct(id);
    showSuccess("Product deleted successfully");
    await fetchProducts();
  } catch (e: any) {
    showError(getErrorMessage(e));
  } finally {
    loading.value = false;
  }
};

const startEdit = (product: Product) => {
  form.value = { ...product };
  isEditing.value = true;
  showForm.value = true;
};

const startCreate = () => {
  form.value = { ...emptyProduct };
  isEditing.value = false;
  showForm.value = true;
};

const cancelForm = () => {
  form.value = { ...emptyProduct };
  showForm.value = false;
  isEditing.value = false;
};

onMounted(() => {
  fetchProducts();
  fetchFavoriteTypes();
  fetchProductCategories();
  fetchProductTypes();
});
</script>
