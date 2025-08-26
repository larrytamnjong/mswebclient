import http from "./http-common";
import { Company } from "../types/Company";

class CompanyService {
  getAllCompanies() {
    return http.get<Company[]>("/companies/");
  }

  getCompany(id: number) {
    return http.get<Company>(`/companies/${id}/`);
  }

  createCompany(data: Company) {
    return http.post<Company>("/companies/", data);
  }

  updateCompany(id: number, data: Company) {
    return http.put<Company>(`/companies/${id}/`, data);
  }

  deleteCompany(id: number) {
    return http.delete(`/companies/${id}/`);
  }
}

export default new CompanyService();