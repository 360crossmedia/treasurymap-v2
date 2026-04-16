const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://treasurymapbackend-production.up.railway.app/api/v1";

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Types
export interface Company {
  id: number;
  name: string;
  description: string;
  creationDate: string;
  turnover: string;
  employees: string;
  location: string;
  userId: number;
  companyWebsite: string;
  companyOffices: number[];
  companyCategories: number[];
  companySubcategories: number[];
  productName: string;
  productVersion: string;
  logo: string;
  keywords: string[];
  live: boolean;
  maincategory: number[];
  showTurnover: boolean;
  multiplayerMap: boolean;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  sub_options: SubOption[];
}

export interface SubOption {
  id: number;
  name: string;
  categoryId: number;
}

export interface SubCategory {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface MapCategory {
  id: number;
  categoryName: string;
  categoryKey: string;
  categoryImage: string;
  logos: MapLogo[];
}

export interface MapLogo {
  image: string;
  url: string;
  keywords: string[];
  subcategories: number[];
  headequarterLocation: string;
  activeIn: number[];
  live: boolean;
}

export interface Article {
  id: number;
  title: string;
  body: string;
  introduction: string | null;
  coverImage: string | null;
  live: boolean;
  companyId: number;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

// API functions
export const getCompanies = () => fetchAPI<Company[]>("/companies");
export const getCompany = (id: number) => fetchAPI<Company>(`/companies/${id}`);
export const getCategories = () => fetchAPI<Category[]>("/categories");
export const getSubCategories = () => fetchAPI<SubCategory[]>("/subCategories");
export const getCountries = () => fetchAPI<Country[]>("/countries");
export const getMapData = () => fetchAPI<MapCategory[]>("/mapdata");
export const getArticlesByCompany = (companyId: number) => fetchAPI<Article[]>(`/articles/all/${companyId}`);
export const getArticle = (id: number) => fetchAPI<Article>(`/articles/${id}`);
