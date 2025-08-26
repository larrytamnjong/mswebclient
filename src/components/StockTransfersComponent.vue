<template>
  <MDBContainer>
    <div class="container-fluid py-4">
      <div class="row page-header mb-3">
        <div class="col-md-6">
          <h4><i class="bi bi-arrow-left-right me-2"></i>Stock Moves</h4>
        </div>
        <div class="col-md-6 d-flex justify-content-md-end align-items-start">
          <button v-if="!showForm" class="btn btn-primary" @click="startCreate">
            <i class="bi bi-plus-circle me-1"></i> Add New Stock Move
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
                      <th>Move Type</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>From Location</th>
                      <th>To Location</th>
                      <th>Date</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(stockMove, index) in stockMoves" :key="stockMove.id!">
                      <td>{{ index + 1 }}</td>
                      <td>
                        <span class="badge bg-secondary">
                          {{ stockMove.move_type_name }} ({{ stockMove.move_type_code }})
                        </span>
                      </td>
                      <td>{{ stockMove.product_name }}</td>
                      <td>{{ stockMove.quantity }}</td>
                      <td>{{ stockMove.from_location_name }} </td>
                      <td>{{ stockMove.to_location_name }} </td>
                      <td>{{ formatDate(stockMove.timestamp) }}</td>
                      <td class="text-end">
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteStockMove(stockMove.id!)"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="stockMoves.length === 0">
                      <td colspan="8" class="text-center">No stock moves found</td>
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
                {{ isEditing ? "Edit Stock Move" : "Create New Stock Move" }}
              </h5>
              <form @submit.prevent="submitForm">
                <div class="row">
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Move Type</label>
                    <select v-model="form.move_type" class="form-select" required>
                      <option value="" disabled selected>Select a move type</option>
                      <option 
                        v-for="moveType in stockMoveTypes" 
                        :key="moveType.id" 
                        :value="moveType.id"
                      >
                        {{ moveType.name }} ({{ moveType.code }})
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Product</label>
                    <select v-model="form.product" class="form-select" required>
                      <option value="" disabled selected>Select a product</option>
                      <option 
                        v-for="product in products" 
                        :key="product.id" 
                        :value="product.id"
                      >
                        {{ product.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Quantity</label>
                    <input v-model="form.quantity" type="number" class="form-control" required />
                  </div>
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Date & Time</label>
                    <input v-model="form.timestamp" type="datetime-local" class="form-control" required />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">From Location</label>
                    <select v-model="form.from_location" class="form-select">
                      <option value="" disabled selected>Select source location</option>    
                      <option 
                        v-for="location in locations" 
                        :key="location.id" 
                        :value="location.id"
                      >
                        {{ location.name }} ({{ location.code }})
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">To Location</label>
                    <select v-model="form.to_location" class="form-select" required>
                      <option value="" disabled selected>Select destination location</option>
                      <option 
                        v-for="location in locations" 
                        :key="location.id" 
                        :value="location.id"
                      >
                        {{ location.name }} ({{ location.code }})
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 mb-3">
                    <label class="form-label">Description</label>
                    <textarea v-model="form.description" class="form-control" rows="3"></textarea>
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
import { StockMove, StockMoveType, Location } from "../types/Inventory";
import { Product } from "../types/Product";
import InventoryService from "../services/InventoryService";
import ProductService from "../services/ProductService";

const stockMoves = ref<StockMove[]>([]);
const stockMoveTypes = ref<StockMoveType[]>([]);
const locations = ref<Location[]>([]);
const products = ref<Product[]>([]);
const showForm = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const ALERT_TIMEOUT = 3000; // 3 seconds

const form = ref<StockMove>({
  move_type: null,
  product: null,
  quantity: 0,
  from_location: null,
  to_location: null,
  timestamp: new Date().toISOString().slice(0, 16),
  description: ""
});

const emptyStockMove: StockMove = {
  move_type: null,
  product: null,
  quantity: 0,
  from_location: null,
  to_location: null,
  timestamp: new Date().toISOString().slice(0, 16),
  description: ""
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const fetchStockMoves = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await InventoryService.getAllStockMoves();
    stockMoves.value = response.data;
  } catch (e: any) {
    showError(getErrorMessage(e));
  } finally {
    loading.value = false;
  }
};

const fetchStockMoveTypes = async () => {
  try {
    const response = await InventoryService.getAllStockMoveTypes();
    stockMoveTypes.value = response.data;
  } catch (e: any) {
    console.error("Error fetching stock move types:", getErrorMessage(e));
  }
};

const fetchLocations = async () => {
  try {
    const response = await InventoryService.getAllLocations();
    locations.value = response.data;
  } catch (e: any) {
    console.error("Error fetching locations:", getErrorMessage(e));
  }
};

const fetchProducts = async () => {
  try {
    const response = await ProductService.getAllProducts();
    products.value = response.data;
  } catch (e: any) {
    console.error("Error fetching products:", getErrorMessage(e));
  }
};

const submitForm = async () => {
  loading.value = true;
  error.value = null;
  success.value = null;
  try {
    if (isEditing.value && form.value.id) {
      await InventoryService.updateStockMove(form.value.id, form.value);
      showSuccess("Stock move updated successfully");
    } else {
      await InventoryService.createStockMove(form.value);
      showSuccess("Stock move created successfully");
    }
    await fetchStockMoves();
    cancelForm();
  } catch (e: any) {
    showError(getErrorMessage(e));
  } finally {
    loading.value = false;
  }
};

const deleteStockMove = async (id: number) => {
  if (!confirm("Are you sure you want to delete this stock move?")) return;
  loading.value = true;
  try {
    await InventoryService.deleteStockMove(id);
    showSuccess("Stock move deleted successfully");
    await fetchStockMoves();
  } catch (e: any) {
    showError(getErrorMessage(e));
  } finally {
    loading.value = false;
  }
};

const startEdit = (stockMove: StockMove) => {
  form.value = { 
    ...stockMove,
    timestamp: stockMove.timestamp ? stockMove.timestamp.slice(0, 16) : new Date().toISOString().slice(0, 16)
  };
  isEditing.value = true;
  showForm.value = true;
};

const startCreate = () => {
  form.value = { ...emptyStockMove };
  isEditing.value = false;
  showForm.value = true;
};

const cancelForm = () => {
  form.value = { ...emptyStockMove };
  showForm.value = false;
  isEditing.value = false;
};

onMounted(() => {
  fetchStockMoves();
  fetchStockMoveTypes();
  fetchLocations();
  fetchProducts();
});
</script>

<style scoped>
.badge {
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 700;
  color: white;
  border-radius: 0.25rem;
}
</style>