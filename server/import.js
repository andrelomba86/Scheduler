import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import {
  SHOW_NAMES_AND_DATES_AND_CALENDAR,
  SHOW_EDIT_DATES_PROMPT,
  DAY_OF_WEEK,
  PERIOD_OF_THE_DAY_MORNING,
  PERIOD_OF_THE_DAY_AFTERNOON,
  PERIOD_OF_THE_DAY_BOTH,
  DAY_OF_WEEK_NUM,
  changeBitValueInArrayIndex,
} from '../client/app/Consts.js'
import { titulares, suplentes } from './representantesConselho.js'

const year = new Date().getFullYear()
function strToDate(day, month) {
  return new Date(year, month - 1, day)
}
const dates = {
  firstSemester: { start: strToDate(6, 3), end: strToDate(14, 7) },
  secondSemester: { start: strToDate(4, 8), end: strToDate(6, 12) },
}

async function getProfessorSchedule() {
  const representantes = [...titulares, ...suplentes]
  const csvFilePath = path.join('./dados/disciplinas.csv')
  const professorSchedule = {}

  try {
    const dataStream = fs.createReadStream(csvFilePath).pipe(csv())

    for await (const row of dataStream) {
      const professors = row['Docente(s)']
      const schedule = row['Horário']
      const semesterNum = row['Cursos - Ano/Sem. - Prioridade'].split(' - ')[1].split('/')[1]
      console.log(professors, semesterNum, schedule)
      let representante
      for (representante of representantes) {
        if (professors.includes(representante)) {
          if (!semesterNum) console.log('ERRO: sem número de semestre\n\n', row)

          const semester = semesterNum === '1' ? 'firstSemester' : 'secondSemester'

          let daysOfWeekAndPeriod = professorSchedule[representante]?.semester || Array(7).fill(0)

          //!-- Adiciona os periodos de aula de cada dia da semana
          const regex = /([\wç]+): (\d{2}):(\d{2})-(\d{2}):(\d{2})/g
          let match

          while ((match = regex.exec(schedule)) !== null) {
            const [_, day, startTime, __, endTime, ___] = match

            const period = endTime <= 13 ? PERIOD_OF_THE_DAY_MORNING : PERIOD_OF_THE_DAY_AFTERNOON
            const dayIndex = DAY_OF_WEEK_NUM[day]
            daysOfWeekAndPeriod = changeBitValueInArrayIndex(daysOfWeekAndPeriod, dayIndex, period, true)
          }

          const scheduleObject = { ...dates[semester], daysOfWeekAndPeriod }

          if (!professorSchedule[representante]) {
            professorSchedule[representante] = {}
          }
          professorSchedule[representante][semester] = scheduleObject
        }
      }
    }
  } catch (error) {
    console.error('Error reading or parsing the CSV file:', error)
  }

  return professorSchedule
}

// Função para exibir os semestres e perguntar ao usuário se quer continuar
async function displaySemestersAndContinue() {
  console.log('Semestres disponíveis:')
  console.log(
    `1º Semestre: ${dates.firstSemester.start.toLocaleDateString()} - ${dates.firstSemester.end.toLocaleDateString()}`
  )
  console.log(
    `2º Semestre: ${dates.secondSemester.start.toLocaleDateString()} - ${dates.secondSemester.end.toLocaleDateString()}\n`
  )
  console.log('Deseja continuar? (s/N)')

  process.stdin.resume()
  process.stdin.once('data', data => {
    const answer = data.toString().trim().toLowerCase()
    if (answer === 's') {
      getProfessorSchedule().then(async result => {
        console.log(JSON.stringify(result, null, 2))
        process.exit()
      })
    } else {
      console.log('Programa encerrado.')
      process.exit()
    }
  })
}

// Usage example:
displaySemestersAndContinue()
