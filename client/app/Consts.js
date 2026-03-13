export const MOSTRAR_NOMES = 1
export const MOSTRAR_DATAS = 2
export const MOSTRAR_CALENDARIO = 4
export const MOSTRAR_ADICIONAR_PARTICIPANTE = 8
export const MOSTRAR_REMOVER_PARTICIPANTE = 16
export const MOSTRAR_ADICIONAR_DATAS = 32
export const MOSTRAR_EDITAR_DATAS = 64
export const MOSTRAR_REMOVER_DATAS = 128

export const MOSTRAR_NOMES_DATAS_E_CALENDARIO = MOSTRAR_NOMES | MOSTRAR_DATAS | MOSTRAR_CALENDARIO
export const MOSTRAR_NOMES_E_DATAS = MOSTRAR_NOMES | MOSTRAR_ADICIONAR_DATAS | MOSTRAR_CALENDARIO
export const MOSTRAR_NOMES_E_EDITAR_DATAS = MOSTRAR_NOMES | MOSTRAR_EDITAR_DATAS | MOSTRAR_CALENDARIO
export const MOSTRAR_NOMES_E_REMOVER_DATAS =
  MOSTRAR_NOMES | MOSTRAR_DATAS | MOSTRAR_REMOVER_DATAS | MOSTRAR_CALENDARIO
export const MOSTRAR_ADICIONAR_PARTICIPANTE_E_CALENDARIO = MOSTRAR_ADICIONAR_PARTICIPANTE | MOSTRAR_CALENDARIO
export const MOSTRAR_REMOVER_PARTICIPANTE_E_CALENDARIO = MOSTRAR_REMOVER_PARTICIPANTE | MOSTRAR_CALENDARIO

export const PERIODO_DO_DIA_MANHA = 1
export const PERIODO_DO_DIA_NOITE = 2
export const PERIODO_DO_DIA_AMBOS = PERIODO_DO_DIA_MANHA | PERIODO_DO_DIA_NOITE

export const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]
export const DIA_DA_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const DIA_DA_SEMANA_NUMERICO = {
  Domingo: 0,
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
}
export const PERIODO_DO_DIA = {
  [PERIODO_DO_DIA_MANHA]: 'manhã',
  [PERIODO_DO_DIA_NOITE]: 'tarde',
  [PERIODO_DO_DIA_AMBOS]: 'manhã e tarde',
}

/**
 * Modifica o valor de um índice de um array adicionando ou removendo um BIT com base no parâumetro 'add'.
 * @param {Array<number>} array - O array original.
 * @param {number} index - O índice do valor a ser modificado.
 * @param {number} value - O valor a ser adicionado ou removido.
 * @param {boolean} add - Se true, adiciona o valor; se false, remove o valor.
 * @returns {Array<number>} O array modificado.
 */
export function changeBitValueInArrayIndex(array, index, value, add) {
  var newArray = Array.from(array)
  if (add) newArray[index] = array[index] | value
  else newArray[index] = array[index] & ~value
  return newArray
}
