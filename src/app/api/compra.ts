import { Categoria } from "./categoria";
import { CompraParceladaView } from "./compra-parcelada";
import { CompraRecorrenteView } from "./compra-recorrente";
import { PaymentMethod } from "./payment-method.enum";
import { PeriodoView } from "./periodo";
import { StoreType } from "./store-type.enum";
import { TipoCompra } from "./tipo-compra.enum";

export interface Compra {
  id: number,
  description: string,
  amount: number,
  boughtAt: Date,
  storeType: StoreType,
  paymentMethod: PaymentMethod,
  categoryId: number,
  periodId: number,
}

export interface CompraView {
  id: number,
  description: string,
  amount: number,
  currentInstallment: number,
  boughtAt: Date,
  storeType: StoreType,
  paymentMethod: PaymentMethod,
  type: TipoCompra,
  category: Categoria,
  period: PeriodoView,
  subscription: CompraRecorrenteView,
  installment: CompraParceladaView
}