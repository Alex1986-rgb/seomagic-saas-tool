
export interface Payment {
  id: string;
  user: { 
    name: string; 
    email: string;
  };
  amount: number;
  date: string;
  status: string;
  plan: string;
  method: string;
}

export type PaymentStatus = 'completed' | 'pending' | 'failed';
