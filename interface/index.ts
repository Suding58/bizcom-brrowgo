export type BorrowReturnRequest = {
  uuid: string;
  itemName: string;
  itemDetail: string;
  borrowerName: string;
  borrowerPhone: string;
};

export type TransactionsApprove = {
  type: string;
  uuid: string;
  approveName: string;
  itemName: string;
  itemDetail: string;
  borrowerName: string;
  borrowerPhone: string;
};

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
  hwid: string | null;
  isOnline: boolean;
  status: string;
  categoryId: number;
  typeId: number;
  brandId: number;
  borrowerName: string | null;
  borrowerPhone: string | null;
  borrowDate: string | null;
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
  hwid: string | null;
  isOnline: boolean;
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

export type NotificationsTransaction = {
  borrowCount: number;
  returnCount: number;
};

export type MenuItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  srLabel: string;
  notifications: number;
};
