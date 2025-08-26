<template>
  <MDBContainer>
    <div class="container-fluid py-4">
      <div class="row page-header mb-3">
        <div class="col-md-6">
          <h4><i class="bi bi-arrow-left-right me-2"></i>Stock Moves</h4>
        </div>
        <div class="col-md-6 d-flex justify-content-md-end align-items-start">
          <button v-if="!showForm && !showBatchForm" class="btn btn-primary" @click="startCreate">
            <i class="bi bi-plus-circle me-1"></i> Add New Stock Move
          </button>
          <button v-if="!showForm && !showBatchForm" class="btn btn-warning ms-2" @click="startBatchTransfer">
            <i class="bi bi-stack me-1"></i> Batch Transfer
          </button>
          <button v-if="showForm || showBatchForm" class="btn btn-secondary" @click="cancelAllForms">
            <i class="bi bi-arrow-left me-1"></i> Back
          </button>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <div v-if="loading && !batchProcessing" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-if="batchProcessing" class="mb-3">
        <div class="alert alert-info mb-2 text-center">
          Processing {{ processedCount }} / {{ totalBatchItems }} items...
        </div>
        <div class="progress" role="progressbar" :aria-valuenow="progressPct" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" :style="{ width: progressPct + '%' }"></div>
        </div>
      </div>

      <div v-if="!showForm && !showBatchForm && !loading" class="row">
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
                      <td>{{ stockMove.from_location_name }}</td>
                      <td>{{ stockMove.to_location_name }}</td>
                      <td>{{ formatDate(stockMove.timestamp) }}</td>
                      <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" @click="deleteStockMove(stockMove.id!)">
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

      <div v-else-if="showForm && !loading" class="row">
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
                      <option v-for="moveType in stockMoveTypes" :key="moveType.id" :value="moveType.id">
                        {{ moveType.name }} ({{ moveType.code }})
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Product</label>
                    <select v-model="form.product" class="form-select" required>
                      <option value="" disabled selected>Select a product</option>
                      <option v-for="product in products" :key="product.id" :value="product.id">
                        {{ product.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">Quantity</label>
                    <input v-model.number="form.quantity" type="number" min="1" class="form-control" required />
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
                      <option v-for="location in locations" :key="location.id" :value="location.id">
                        {{ location.name }} ({{ location.code }})
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-3">
                    <label class="form-label">To Location</label>
                    <select v-model="form.to_location" class="form-select" required>
                      <option value="" disabled selected>Select destination location</option>
                      <option v-for="location in locations" :key="location.id" :value="location.id">
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

      <div v-else-if="showBatchForm && !loading" class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="mb-3">Batch Stock Transfer</h5>
              <div class="row">
                <div class="col-lg-6 col-md-6 mb-3">
                  <label class="form-label">Date & Time (applies to all rows)</label>
                  <input v-model="batchForm.timestamp" type="datetime-local" class="form-control" required />
                </div>
              </div>

              <form @submit.prevent="submitBatchForm">
                <div class="table-responsive mb-3">
                  <table class="table table-bordered table-sm align-middle">
                    <thead>
                      <tr>
                        <th>Move Type</th>
                        <th>Product</th>
                        <th style="width:110px">Quantity</th>
                        <th>From Location</th>
                        <th>To Location</th>
                        <th>Description</th>
                        <th class="text-center" style="width:70px">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, idx) in transferRows" :key="idx">
                        <td>
                          <select v-model="row.move_type" class="form-select" required>
                            <option value="" disabled>Select</option>
                            <option v-for="moveType in stockMoveTypes" :key="moveType.id" :value="moveType.id">
                              {{ moveType.name }} ({{ moveType.code }})
                            </option>
                          </select>
                        </td>
                        <td>
                          <select v-model="row.product" class="form-select" required>
                            <option value="" disabled>Select</option>
                            <option v-for="product in products" :key="product.id" :value="product.id">
                              {{ product.name }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <input v-model.number="row.quantity" type="number" min="1" class="form-control" required />
                        </td>
                        <td>
                          <select v-model="row.from_location" class="form-select">
                            <option value="" disabled>Select</option>
                            <option v-for="location in locations" :key="location.id" :value="location.id">
                              {{ location.name }} ({{ location.code }})
                            </option>
                          </select>
                        </td>
                        <td>
                          <select v-model="row.to_location" class="form-select" required>
                            <option value="" disabled>Select</option>
                            <option v-for="location in locations" :key="location.id" :value="location.id">
                              {{ location.name }} ({{ location.code }})
                            </option>
                          </select>
                        </td>
                        <td>
                          <input v-model="row.description" type="text" class="form-control" />
                        </td>
                        <td class="text-center">
                          <button type="button" class="btn btn-sm btn-outline-danger" @click="removeRow(idx)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                      <tr v-if="transferRows.length === 0">
                        <td colspan="7" class="text-center text-muted">No rows yet — add at least one.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="mb-3">
                  <button type="button" class="btn btn-sm btn-primary" @click="addRow">
                    <i class="bi bi-plus-circle me-1"></i> Add Row
                  </button>
                </div>

                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-success me-2" :disabled="batchProcessing">
                    <i class="bi bi-save me-1"></i> Process Batch
                  </button>
                  <button type="button" class="btn btn-secondary" @click="cancelBatchForm" :disabled="batchProcessing">
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
import { ref, computed, onMounted } from "vue";
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
const showBatchForm = ref(false);
const isEditing = ref(false);

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const batchProcessing = ref(false);
const processedCount = ref(0);
const totalBatchItems = ref(0);
const progressPct = computed(() =>
  totalBatchItems.value === 0 ? 0 : Math.round((processedCount.value / totalBatchItems.value) * 100)
);

const ALERT_TIMEOUT = 3000;

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

const batchForm = ref({
  timestamp: new Date().toISOString().slice(0, 16) 
});
const transferRows = ref<Partial<StockMove>[]>([]);
const emptyRow: Partial<StockMove> = {
  move_type: null,
  product: null,
  quantity: 1,
  from_location: null,
  to_location: null,
  description: ""
};

const getErrorMessage = (e: any): string => {
  if (e?.response?.data) {
    const data = e.response.data;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data === "object") {
      return Object.entries(data)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
        .join(" | ");
    }
  }
  return e?.message || "An unexpected error occurred";
};
const showError = (msg: string) => {
  error.value = msg;
  setTimeout(() => (error.value = null), ALERT_TIMEOUT);
};
const showSuccess = (msg: string) => {
  success.value = msg;
  setTimeout(() => (success.value = null), ALERT_TIMEOUT);
};
const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

const fetchStockMoves = async () => {
  loading.value = true;
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

const startBatchTransfer = () => {
  batchForm.value = {
    timestamp: new Date().toISOString().slice(0, 16)
  };
  transferRows.value = [{ ...emptyRow }];
  showBatchForm.value = true;
};
const addRow = () => transferRows.value.push({ ...emptyRow });
const removeRow = (idx: number) => transferRows.value.splice(idx, 1);
const cancelBatchForm = () => {
  showBatchForm.value = false;
};
const cancelAllForms = () => {
  cancelForm();
  cancelBatchForm();
};

const validateRow = (row: Partial<StockMove>, idx: number): string | null => {
  if (!row.move_type) return `Row ${idx + 1}: Move Type is required.`;
  if (!row.product) return `Row ${idx + 1}: Product is required.`;
  if (!row.to_location) return `Row ${idx + 1}: To Location is required.`;
  if (row.quantity == null || row.quantity <= 0) return `Row ${idx + 1}: Quantity must be >= 1.`;
  if (row.from_location && row.to_location && row.from_location === row.to_location) {
    return `Row ${idx + 1}: From and To locations cannot be the same.`;
  }
  return null;
};

const submitBatchForm = async () => {
  if (transferRows.value.length === 0) {
    showError("Please add at least one transfer row.");
    return;
  }

  // quick client-side validation
  for (let i = 0; i < transferRows.value.length; i++) {
    const err = validateRow(transferRows.value[i], i);
    if (err) {
      showError(err);
      return;
    }
  }

  batchProcessing.value = true;
  processedCount.value = 0;
  totalBatchItems.value = transferRows.value.length;

  const failures: Array<{ index: number; message: string }> = [];
  try {
    for (let i = 0; i < transferRows.value.length; i++) {
      const row = transferRows.value[i];
      try {
        await InventoryService.createStockMove({
          move_type: row.move_type!,
          product: row.product!,
          quantity: row.quantity!,
          from_location: row.from_location ?? null,
          to_location: row.to_location!,
          timestamp: batchForm.value.timestamp, 
          description: row.description ?? ""
        });
      } catch (e: any) {
        failures.push({ index: i, message: getErrorMessage(e) });
      } finally {
        processedCount.value++;
      }
    }

    if (failures.length === 0) {
      showSuccess("Batch stock transfer processed successfully.");
    } else {
      const rows = failures.map(f => f.index + 1).join(", ");
      showError(`Processed with ${failures.length} failure(s). Problem row(s): ${rows}.`);
    }

    await fetchStockMoves();
    if (failures.length === 0) cancelBatchForm();
  } finally {
    batchProcessing.value = false;
  }
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
