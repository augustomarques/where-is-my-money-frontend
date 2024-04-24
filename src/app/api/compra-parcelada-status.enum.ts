export enum CompraParceladaStatus {
  OPEN = "Aberto",
  PAID = "Pago",
}

export function getKeyByValue(value: string): string | undefined {
  // Aqui 'CompraParceladaStatus' é usado para percorrer todas as chaves do enum
  for (const key in CompraParceladaStatus) {
    if (CompraParceladaStatus[key as keyof typeof CompraParceladaStatus] === value) {
      return key;  // Retorna a chave correspondente ao valor
    }
  }
  return undefined; // Retorna undefined se o valor não for encontrado
}