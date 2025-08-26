import http from "./http-common";
import { Location, StockMoveType, StockMove, InventoryLevel } from "../types/Inventory";

class InventoryService {
  getAllLocations() {
    return http.get<Location[]>("/locations/");
  }

  getLocation(id: number) {
    return http.get<Location>(`/locations/${id}/`);
  }

  createLocation(data: Location) {
    return http.post<Location>("/locations/", data);
  }

  updateLocation(id: number, data: Location) {
    return http.put<Location>(`/locations/${id}/`, data);
  }

  deleteLocation(id: number) {
    return http.delete(`/locations/${id}/`);
  }

  getAllStockMoveTypes() {
    return http.get<StockMoveType[]>("/stock-move-types/");
  }

  getStockMoveType(id: number) {
    return http.get<StockMoveType>(`/stock-move-types/${id}/`);
  }

  getAllStockMoves() {
    return http.get<StockMove[]>("/stock-moves/");
  }

  getStockMove(id: number) {
    return http.get<StockMove>(`/stock-moves/${id}/`);
  }

  createStockMove(data: StockMove) {
    return http.post<StockMove>("/stock-moves/", data);
  }

  updateStockMove(id: number, data: StockMove) {
    return http.put<StockMove>(`/stock-moves/${id}/`, data);
  }

  deleteStockMove(id: number) {
    return http.delete(`/stock-moves/${id}/`);
  }

  getAllInventoryLevels() {
    return http.get<InventoryLevel[]>("/inventory-levels/");
  }

  getInventoryLevel(id: number) {
    return http.get<InventoryLevel>(`/inventory-levels/${id}/`);
  }

  createInventoryLevel(data: InventoryLevel) {
    return http.post<InventoryLevel>("/inventory-levels/", data);
  }

  updateInventoryLevel(id: number, data: InventoryLevel) {
    return http.put<InventoryLevel>(`/inventory-levels/${id}/`, data);
  }

  deleteInventoryLevel(id: number) {
    return http.delete(`/inventory-levels/${id}/`);
  }
}

export default new InventoryService();