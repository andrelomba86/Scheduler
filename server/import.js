import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

import axios from 'axios'

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
      const semesterNum = row['Cursos - Ano/Sem. - Prioridade'].match(/\d\/(\d)/)?.[1]
      if (!semesterNum) {
        console.error(row, '\n[ERRO]: a disciplina não contém indicação de semestre.')
        process.exit()
      }

      let representante
      for (representante of representantes) {
        if (professors.includes(representante)) {
          const semester = semesterNum === '1' ? 'firstSemester' : 'secondSemester'

          let daysOfWeekAndPeriod =
            professorSchedule[representante]?.[semester]?.daysOfWeekAndPeriod || Array(7).fill(0)

          //!-- Adiciona os periodos de aula de cada dia da semana
          const regex = /([\wçá]+): (\d{2}):(\d{2})-(\d{2}):(\d{2})/g
          let match

          while ((match = regex.exec(schedule)) !== null) {
            const [_, day, startTime, __, endTime, ___] = match

            const dayIndex = DAY_OF_WEEK_NUM[day]
            let period
            if (endTime <= 12) {
              period = PERIOD_OF_THE_DAY_MORNING
            } else if (endTime <= 18) {
              period = PERIOD_OF_THE_DAY_AFTERNOON
            } else {
              continue
            }

            daysOfWeekAndPeriod = [...changeBitValueInArrayIndex(daysOfWeekAndPeriod, dayIndex, period, true)]
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
async function init() {
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
        // console.log(JSON.stringify(result, null, 2))
        await doTheUpdates(result)
        process.exit()
      })
    } else {
      console.log('Programa encerrado.')
      process.exit()
    }
  })
}

axios.defaults.baseURL = 'http://localhost:5000'

async function doTheUpdates(result) {
  // console.log(result)
  for (let professor of Object.keys(result)) {
    // console.log(professor)
    let response = await axios.post('/search', { name: professor })
    let id
    let dates = []
    if (!response.data.length) {
      try {
        const addResponse = await axios.post('/add', { name: professor })
        id = addResponse.data.doc._id
        console.log('Professor adicionado:', professor)
      } catch (err) {
        console.log(err)
      }
    } else {
      if ((response.data.length = 1)) {
        id = response.data[0]._id
        dates = response.data[0].dates || []
      } else {
        console.log(response.data, '\n[ERRO]: resultado retornou vários professores')
      }
    }

    // console.log('Atualizando professor', professor)
    try {
      if (result[professor]['firstSemester']) {
        dates.push(result[professor]['firstSemester'])
      }
      if (result[professor]['secondSemester']) {
        dates.push(result[professor]['secondSemester'])
      }
      const updateResponse = await axios.post('/update', { id, values: { dates } })
      // console.log('submitUpdate result', updateResponse.data)
      if (!updateResponse.data.result) throw Error(updateResponse.data.error.message)
    } catch (err) {
      console.log('ERRO', err)
      process.exit()
    }
  }
}

init()
