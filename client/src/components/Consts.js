export const SHOW_NAMES = 1
export const SHOW_DATES = 2
export const SHOW_CALENDAR = 4
export const SHOW_ADD_PARTICIPANT_PROMPT = 8
export const SHOW_REMOVE_PARTICIPANT_PROMPT = 16
export const SHOW_ADD_DATES_PROMPT = 32
export const SHOW_REMOVE_DATES_PROMPT = 64

export const SHOW_NAMES_AND_DATES_AND_CALENDAR = SHOW_NAMES | SHOW_DATES | SHOW_CALENDAR
export const SHOW_NAMES_AND_ADD_DATES_PROMPT = SHOW_NAMES | SHOW_ADD_DATES_PROMPT
export const SHOW_NAMES_AND_REMOVE_DATES_PROMPT = SHOW_NAMES | SHOW_DATES | SHOW_REMOVE_DATES_PROMPT

export const PERIOD_OF_THE_DAY_MORNING = 1
export const PERIOD_OF_THE_DAY_AFTERNOON = 2
export const PERIOD_OF_THE_DAY_BOTH = PERIOD_OF_THE_DAY_MORNING | PERIOD_OF_THE_DAY_AFTERNOON

export const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
export const DAY_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const DAY_OF_WEEK_NUM = { 'Domingo': 0, 'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sábado': 6 }
export const PERIOD_OF_THE_DAY = {
  [PERIOD_OF_THE_DAY_MORNING]: "manhã",
  [PERIOD_OF_THE_DAY_AFTERNOON]: "tarde",
  [PERIOD_OF_THE_DAY_BOTH]: "manhã e tarde"
 }



