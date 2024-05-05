export interface TotalPorPeriodo {
  month: number,
  year: number,
  amount: number
}

export interface TotalPorCategoria {
  category: string,
  amount: number
}

export interface TotalPorCategoriaPorPeriodo {
  category: string,
  amounts: TotalPorPeriodo[]
}