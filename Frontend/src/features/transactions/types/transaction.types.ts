export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  widgetId: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  paymentDay?: number;
  createdAt: string;
}

export interface CreateTransactionRequest {
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  paymentDay?: number;
}