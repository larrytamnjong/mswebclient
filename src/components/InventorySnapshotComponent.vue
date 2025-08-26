<template>
  <MDBContainer>
    <div class="container-fluid py-4">
      <div class="row page-header mb-3">
        <div class="col-md-6">
          <h4><i class="bi bi-clipboard-data me-2"></i>Inventory Snapshot</h4>
        </div>
        <div class="col-md-6 d-flex justify-content-md-end align-items-start">
          <div class="btn-group">
            <button class="btn btn-outline-primary" @click="refreshData">
              <i class="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <div class="row mb-3">
        <div class="col-md-4">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h6 class="card-title">Total Products</h6>
              <h4 class="card-text">{{ inventoryLevels?.length }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h6 class="card-title">Total Quantity</h6>
              <h4 class="card-text">{{ totalQuantity }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-info text-white">
            <div class="card-body">
              <h6 class="card-title">Last Updated</h6>
              <h6 class="card-text">{{ lastUpdateTime }}</h6>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading inventory data...</p>
      </div>

      <div v-else class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <h5 class="card-title mb-0">Current Stock Levels</h5>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input 
                      v-model="searchQuery" 
                      type="text" 
                      class="form-control" 
                      placeholder="Search products or locations..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover table-sm table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Location</th>
                      <th>Quantity</th>
                      <th>Last Updated</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in filteredInventory" :key="item.id!">
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.product_name || 'N/A' }}</td>
                      <td>{{ item.location_name }} ({{ item.location_code }})</td>
                      <td>
                        <span :class="{
                          'text-success': item.quantity > 10,
                          'text-warning': item.quantity > 0 && item.quantity <= 10,
                          'text-danger': item.quantity === 0,
                          'fw-bold': true
                        }">
                          {{ item.quantity }}
                        </span>
                      </td>
                      <td>{{ formatDate(item.last_updated) }}</td>
                      <td>
                        <span :class="{
                          'badge bg-success': item.quantity > 10,
                          'badge bg-warning': item.quantity > 0 && item.quantity <= 10,
                          'badge bg-danger': item.quantity === 0
                        }">
                          {{ getStockStatus(item.quantity) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="filteredInventory?.length === 0">
                      <td colspan="7" class="text-center">
                        No inventory records found
                        <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="btn-group">
                  <button class="btn btn-outline-secondary" @click="exportToCSV">
                    <i class="bi bi-download me-1"></i> Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MDBContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { MDBContainer } from "mdb-vue-ui-kit";
import { InventoryLevel } from "../types/Inventory";
import InventoryService from "../services/InventoryService";

const inventoryLevels = ref<InventoryLevel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const searchQuery = ref("");

const ALERT_TIMEOUT = 3000;

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

const getStockStatus = (quantity: number) => {
  if (quantity > 10) return "In Stock";
  if (quantity > 0) return "Low Stock";
  return "Out of Stock";
};

const totalQuantity = computed(() => {
  return inventoryLevels.value.reduce((sum, item) => sum + item.quantity, 0);
});

const lastUpdateTime = computed(() => {
  if (inventoryLevels.value.length === 0) return "N/A";
  
  const latestUpdate = Math.max(
    ...inventoryLevels.value.map(item => new Date(item.last_updated).getTime())
  );
  
  return new Date(latestUpdate).toLocaleString();
});

const filteredInventory = computed(() => {
  if (!searchQuery.value) return inventoryLevels.value;
  
  const query = searchQuery.value.toLowerCase();
  return inventoryLevels.value.filter(item =>
    (item.product_name?.toLowerCase().includes(query)) ||
    (item.product_internal_reference?.toLowerCase().includes(query)) ||
    (item.location_name?.toLowerCase().includes(query)) ||
    (item.location_code?.toLowerCase().includes(query))
  );
});

const fetchInventoryLevels = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await InventoryService.getAllInventoryLevels();
    inventoryLevels.value = response.data;
    showSuccess("Inventory data loaded successfully");
  } catch (e: any) {
    showError(getErrorMessage(e));
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  fetchInventoryLevels();
};

const exportToCSV = () => {
  const headers = ["Product", "Internal Reference", "Location", "Quantity", "Last Updated", "Status"];
  const csvData = filteredInventory.value.map(item => [
    item.product_name || "N/A",
    item.product_internal_reference || "N/A",
    `${item.location_name} (${item.location_code})`,
    item.quantity,
    formatDate(item.last_updated),
    getStockStatus(item.quantity)
  ]);

  const csvContent = [
    headers.join(","),
    ...csvData.map(row => row.map(field => `"${field}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `inventory-snapshot-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  fetchInventoryLevels();
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

.card .card-body h6 {
  margin-bottom: 0.5rem;
}

.card .card-body h4 {
  margin-bottom: 0;
}

.input-group-text {
  background-color: #f8f9fa;
}
</style>