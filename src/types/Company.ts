export interface Company {
  id?: number;
  name: string;
  is_company: boolean;
  related_company: number | null;
  related_company_name?: string;
  street: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}