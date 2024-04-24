import { Categoria } from "./categoria";
import { PaymentMethod } from "./payment-method.enum";

export interface CompraRecorrente {
  id: number,
  description: string,
  startedAt: Date,
  amount: number,
  active: boolean,
  paymentMethod: PaymentMethod,
  categoryId: number
}

export interface CompraRecorrenteView {
  id: number,
  description: string,
  startedAt: Date,
  amount: number,
  active: boolean,
  paymentMethod: PaymentMethod,
  category: Categoria
}