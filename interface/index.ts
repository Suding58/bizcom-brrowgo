export type ItemTransactions = {
  id: number;
  borrowerName: string;
  borrowDate: string;
  returnDate: string | null;
  statusBorrow: string;
  statusReturn: string;
  approvedBorrow: string | null;
  approvedReturn: string | null;
  updatedAt: string;
  category: string;
};

export type Item = {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  parcelNumber: string;
  imageUrl?: string;
  detailId: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  brand: string;
  type: string;
  status: string;
  categoryId: number;
  typeId: number;
  brandId: number;
};

export type ItemWithTransaction = {
  id: number;
  uuidItem: string;
  name: string;
  description?: string;
  parcelNumber: string;
  imageUrl?: string;
  category: string;
  brand: string;
  type: string;
  status: string;
  borrowerName: string;
  borrowDate: string;
  returnDate: string | null;
  statusBorrow: string;
  statusReturn: string;
  approvedBorrow: string | null;
  approvedReturn: string | null;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  cid: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  profileUrl?: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};
