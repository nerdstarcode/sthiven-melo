/** Situação da carga frente ao Previsto, ao Máximo e à extensão acima do Máximo. */
export type LoadStatus = 'below' | 'within' | 'above' | 'extension' | 'overload'

export const LOAD_STATUSES: LoadStatus[] = ['below', 'within', 'above', 'extension', 'overload']

/** Dias úteis de extensão permitidos acima do Máximo (a "gordurinha" da sprint). */
export const SPRINT_EXTENSION_DAYS = 3

/** Folga em torno do previsto que ainda conta como "dentro do previsto" (±10%). */
const WITHIN_TOLERANCE = 0.1

/**
 * Abaixo: menos de 90% do previsto. Dentro: até 10% em volta do previsto. Acima: além disso,
 * até o Máximo. Na extensão: passou do Máximo, mas cabe nos dias de extensão. Sobrecarga:
 * passou até da extensão.
 */
export function loadStatusOf(
  delivered: number,
  capacity: number,
  max: number,
  maxExtended: number,
): LoadStatus {
  if (delivered > maxExtended) return 'overload'
  if (delivered < capacity * (1 - WITHIN_TOLERANCE)) return 'below'
  if (delivered <= capacity * (1 + WITHIN_TOLERANCE)) return 'within'
  if (delivered <= max) return 'above'
  return 'extension'
}
