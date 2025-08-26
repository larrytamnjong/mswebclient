export interface PurchaseOrderStatusType {
  id?: number;
  name: string;
  description: string;
}

export interface PurchaseOrder {
  id?: number;
  priority: number | null;
  priority_name?: string;
  order_reference: string;
  vendor: number | null;
  vendor_name?: string;
  purchase_representative: string;
  order_deadline: string;
  activities: string;
  source_document: string;
  total: number;
  status: number | null;
  status_name?: string;
}