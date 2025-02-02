export const SHOW_NAMES = 1
export const SHOW_DATES = 2
export const SHOW_CALENDAR = 4
export const SHOW_ADD_PARTICIPANT_PROMPT = 8
export const SHOW_REMOVE_PARTICIPANT_PROMPT = 16
export const SHOW_ADD_DATES_PROMPT = 32
export const SHOW_EDIT_DATES_PROMPT = 64
export const SHOW_REMOVE_DATES_PROMPT = 128

export const SHOW_NAMES_AND_DATES_AND_CALENDAR = SHOW_NAMES | SHOW_DATES | SHOW_CALENDAR
export const SHOW_NAMES_AND_ADD_DATES = SHOW_NAMES | SHOW_ADD_DATES_PROMPT | SHOW_CALENDAR
export const SHOW_NAMES_AND_EDIT_DATES = SHOW_NAMES | SHOW_EDIT_DATES_PROMPT | SHOW_CALENDAR
export const SHOW_NAMES_AND_REMOVE_DATES = SHOW_NAMES | SHOW_DATES | SHOW_REMOVE_DATES_PROMPT | SHOW_CALENDAR
export const SHOW_ADD_PARTICIPANT_AND_CALENDAR = SHOW_ADD_PARTICIPANT_PROMPT | SHOW_CALENDAR
export const SHOW_REMOVE_PARTICIPANT_AND_CALENDAR = SHOW_REMOVE_PARTICIPANT_PROMPT | SHOW_CALENDAR

export const PERIOD_OF_THE_DAY_MORNING = 1
export const PERIOD_OF_THE_DAY_AFTERNOON = 2
export const PERIOD_OF_THE_DAY_BOTH = PERIOD_OF_THE_DAY_MORNING | PERIOD_OF_THE_DAY_AFTERNOON

export const MONTHS = [
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
export const DAY_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const DAY_OF_WEEK_NUM = { Domingo: 0, Segunda: 1, Terça: 2, Quarta: 3, Quinta: 4, Sexta: 5, Sábado: 6 }
export const PERIOD_OF_THE_DAY = {
  [PERIOD_OF_THE_DAY_MORNING]: 'manhã',
  [PERIOD_OF_THE_DAY_AFTERNOON]: 'tarde',
  [PERIOD_OF_THE_DAY_BOTH]: 'manhã e tarde',
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
