export interface Portfolio {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
}

export interface CreatePortfolioRequest {
  title: string;
  description?: string;
}

export interface UpdatePortfolioRequest {
  title: string;
  description?: string;
  status?: string;
}