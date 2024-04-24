import { Categoria } from "./categoria";
import { CompraParceladaStatus } from "./compra-parcelada-status.enum";
import { PaymentMethod } from "./payment-method.enum";
import { StoreType } from "./store-type.enum";

export interface CompraParcelada {
  id: number,
  description: string,
  amount: number,
  installments: number,
  boughtAt: Date,
  storeType: StoreType,
  paymentMethod: PaymentMethod,
  categoryId: number
}

export interface CompraParceladaView {
  id: number,
  description: string,
  amount: number,
  installments: number,
  boughtAt: Date,
  storeType: StoreType,
  paymentMethod: PaymentMethod,
  status: CompraParceladaStatus,
  category: Categoria
}