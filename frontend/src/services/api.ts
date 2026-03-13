import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: number;
  brand: string;
  type: string;
  stock: number;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
}

export const getProducts = async (brand?: string): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>('/products', {
    params: brand ? { brand } : {},
  });
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const response = await api.post<Product>('/products', product);
  return response.data;
};

export const updateProduct = async (id: number, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};
