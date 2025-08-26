import http from "./http-common";
import { PurchaseOrderStatusType, PurchaseOrder } from "../types/PurchaseOrder";

class PurchaseService {
  getAllPurchaseOrderStatusTypes() {
    return http.get<PurchaseOrderStatusType[]>("/purchase-order-status-types/");
  }

  getPurchaseOrderStatusType(id: number) {
    return http.get<PurchaseOrderStatusType>(`/purchase-order-status-types/${id}/`);
  }
  getAllPurchaseOrders() {
    return http.get<PurchaseOrder[]>("/purchase-orders/");
  }

  getPurchaseOrder(id: number) {
    return http.get<PurchaseOrder>(`/purchase-orders/${id}/`);
  }

  createPurchaseOrder(data: PurchaseOrder) {
    return http.post<PurchaseOrder>("/purchase-orders/", data);
  }

  updatePurchaseOrder(id: number, data: PurchaseOrder) {
    return http.put<PurchaseOrder>(`/purchase-orders/${id}/`, data);
  }

  deletePurchaseOrder(id: number) {
    return http.delete(`/purchase-orders/${id}/`);
  }
}

export default new PurchaseService();