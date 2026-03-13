import Papa from 'papaparse'
import fs from 'fs'
const docentesDepto = [
  'Antonio Misson Godoy',
  'Cesar Augusto Moreira',
  'Chang Hung Kiang',
  'Daniel Marcos Bonotto',
  'Dionisio Uendro Carlos',
  'George Luiz Luvizotto',
  'Giancarlo Scardia',
  'Guillermo Rafael Beltran Navarro',
  'José Eduardo Zaine',
  'José Alexandre de Jesus Perinotto',
  'Lucas Moreira Furlan',
  'Lucas Veríssimo Warren',
  'Matheus Lisboa Nobre da Silva',
  'Regiane Andrade Fumes',
  'Reinaldo Jose Bertini',
  'Rodrigo Irineu Cerri',
  'Rodrigo Prudente de Melo',
  'Rosemarie Rohn',
  'Sergio Caetano Filho',
  'Washington Barbosa Leite Junior',
]
const diasMap = {
  domingo: 0,
  segunda: 1,
  terça: 2,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sábado: 6,
  sabado: 6,
}

function gerarObjetoDocentes(rows, semesters) {
  const resultado = {}

  function criarArraySemana() {
    return [0, 0, 0, 0, 0, 0, 0]
  }

  function obterPeriodo(horario) {
    const match = horario.match(/(\d{2}):\d{2}-(\d{2}):\d{2}/)

    if (!match) return null

    const inicio = parseInt(match[1])

    if (inicio >= 8 && inicio < 12) return 1
    if (inicio >= 14 && inicio < 18) return 2

    return null
  }

  rows.forEach(row => {
    const diasEHorarios = row['Horário']
    const cursoSem = row['Cursos - Ano/Sem. - Prioridade']
    const disciplina = row['Disciplina']

    if (!diasEHorarios || !cursoSem) return

    let semestre

    //TODO: informar que linha foi ignorada por não conter indicação de semestre
    if (cursoSem.includes('/1')) semestre = 'firstSemester'
    else if (cursoSem.includes('/2')) semestre = 'secondSemester'
    else return

    const diasSemanaArray = criarArraySemana()

    // const linhasHorario = horario.split(/\n|;/)
    // console.log(horarios, semestre)

    // linhasHorario.forEach(l => {
    const diasEHorariosMatch = diasEHorarios
      .toLowerCase()
      .matchAll(/(domingo|segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado)\:\s(\d{2}:\d{2}-\d{2}:\d{2})/g)

    for (let [_, dia, horario] of diasEHorariosMatch) {
      if (!dia) {
        console.log(`Dia não encontrado na string para disciplina ${disciplina}:`, diasEHorarios)
        return
      }

      const periodo = obterPeriodo(horario)
      if (!periodo) {
        console.log(`Período não identificado para horário para disciplina ${disciplina}:`, horario)
        return
      }

      const diaIndex = diasMap[dia]
      //TODO: o script deve percorrer todo o documento e ir alterando o valor para cada docente
      if (diasSemanaArray[diaIndex] === 0) diasSemanaArray[diaIndex] = periodo
      else if (diasSemanaArray[diaIndex] !== periodo) diasSemanaArray[diaIndex] = 3
    }

    docentesDepto.forEach(docente => {
      if (!row['Docente(s)'].includes(docente)) return

      if (!resultado[docente]) resultado[docente] = []

      console.log(row, '\n', docente, '\n', resultado[docente], '\n\n\n', resultado.length)
      if (resultado.length > 0) exit(0)
      let entrada = resultado[docente].find(e => e.start.getTime() === semesters[semestre].inicio.getTime())

      if (!entrada) {
        entrada = {
          start: semesters[semestre].inicio,
          end: semesters[semestre].fim,
          daysOfWeekAndPeriod: criarArraySemana(),
        }

        resultado[docente].push(entrada)
      }

      diasSemanaArray.forEach((v, i) => {
        if (v === 0) return

        if (entrada.daysOfWeekAndPeriod[i] === 0) entrada.daysOfWeekAndPeriod[i] = v
        else if (entrada.daysOfWeekAndPeriod[i] !== v) entrada.daysOfWeekAndPeriod[i] = 3
      })
    })
  })

  return resultado
}

const csv = fs.readFileSync('table.csv', 'utf8')
const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
})
const semesters = {
  firstSemester: {
    inicio: new Date('2026-02-01'),
    fim: new Date('2026-06-30'),
  },
  secondSemester: {
    inicio: new Date('2026-08-01'),
    fim: new Date('2026-12-15'),
  },
}

const rows = parsed.data

let result = gerarObjetoDocentes(rows, semesters)
// console.log(JSON.stringify(result, null, 2))
