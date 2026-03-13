import React, { useState } from 'react'
import axios from 'axios'
import { dbCollection, getParticipantsState, updateDBCollection } from '../redux/participantsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Papa from 'papaparse'
import { getSemesterDates } from '../MenuBar'
import {
  DIA_DA_SEMANA,
  PERIODO_DO_DIA,
  PERIODO_DO_DIA_NOITE,
  PERIODO_DO_DIA_MANHA,
  PERIODO_DO_DIA_AMBOS,
} from '../../Consts'

axios.defaults.baseURL = 'http://localhost:5000'

//-----------------------------------------

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

function extrairDadosDoCSV(csvRows, semesters, dadosDosParticipantes) {
  const dadosDeSaida = {} // formato: { [participante]: { _id, datas: [{ start, end, daysOfWeekAndPeriod }, ...] }

  const criarArraySemana = () => [0, 0, 0, 0, 0, 0, 0]

  function obterPeriodoDoDia(horario) {
    const match = horario.match(/(\d{2}):\d{2}-(\d{2}):\d{2}/)

    if (!match) return null

    const inicio = parseInt(match[1])

    if (inicio >= 8 && inicio < 12) return PERIODO_DO_DIA_MANHA
    if (inicio >= 14 && inicio < 18) return PERIODO_DO_DIA_NOITE

    return null
  }

  csvRows.forEach(row => {
    const diasEHorarios = row['Horário']
    const cursoSem = row['Cursos - Ano/Sem. - Prioridade']
    const disciplina = row['Disciplina']

    if (!diasEHorarios || !cursoSem) return

    let semestre

    if (cursoSem.includes('/1')) semestre = 'firstSemester'
    else if (cursoSem.includes('/2')) semestre = 'secondSemester'
    else {
      console.log('Semestre não identificado para disciplina:', disciplina)
      return
    }

    const arrayDiasDaSemana = criarArraySemana()

    const diasEHorariosMatch = diasEHorarios
      .toLowerCase()
      .matchAll(/(domingo|segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado)\:\s(\d{2}:\d{2}-\d{2}:\d{2})/g)

    for (let [_, dia, horario] of diasEHorariosMatch) {
      if (!dia) {
        console.log(`Dia não encontrado na string para disciplina ${disciplina}:`, diasEHorarios)
        return
      }

      const periodo = obterPeriodoDoDia(horario)
      if (!periodo) {
        console.log(`Período não identificado para horário para disciplina ${disciplina}:`, horario)
        return
      }

      const indiceDoDia = diasMap[dia]

      if (arrayDiasDaSemana[indiceDoDia] === 0) {
        arrayDiasDaSemana[indiceDoDia] = periodo
      } else if (arrayDiasDaSemana[indiceDoDia] !== periodo) {
        arrayDiasDaSemana[indiceDoDia] = PERIODO_DO_DIA_AMBOS
      }
    }
    //TODO: alterar a key 'dates' para português 'agenda' (corrigir em todo o código)
    dadosDosParticipantes.forEach(({ name: participante, _id, dates: agendaOriginal }) => {
      if (!row['Docente(s)'].includes(participante)) return

      // console.log('agenda', participante, _id, agendaOriginal)

      if (!dadosDeSaida[participante]) {
        dadosDeSaida[participante] = { _id, agenda: Array.from(agendaOriginal) }
      }

      let entrada = dadosDeSaida[participante].agenda.find(
        periodo => periodo.start === semesters[semestre].inicio && periodo.end === semesters[semestre].fim,
      )

      if (!entrada) {
        entrada = {
          start: semesters[semestre].inicio,
          end: semesters[semestre].fim,
          daysOfWeekAndPeriod: criarArraySemana(),
        }

        dadosDeSaida[participante].agenda.push(entrada)
      }

      arrayDiasDaSemana.forEach((periodoDoDia, nDiaSemana) => {
        if (periodoDoDia === 0) return
        console.log(entrada, nDiaSemana)

        if (entrada.daysOfWeekAndPeriod[nDiaSemana] === 0)
          entrada.daysOfWeekAndPeriod[nDiaSemana] = periodoDoDia
        else if (entrada.daysOfWeekAndPeriod[nDiaSemana] !== periodoDoDia)
          entrada.daysOfWeekAndPeriod[nDiaSemana] = PERIODO_DO_DIA_AMBOS
      })
    })
  })

  return dadosDeSaida
}

export default function FrequenciaDocente() {
  const [input, setInput] = useState('')
  const [dadosExtraidos, setExtractResult] = useState(null)
  const [status, setStatus] = useState({ message: '', type: 'info' })
  const semesters = getSemesterDates()

  const { dbCollection } = useSelector(getParticipantsState)
  const dispatch = useDispatch()
  const nomesDosParticipantes = dbCollection.reduce((acc, p) => [...acc, p.name], [])

  const handleExtract = () => {
    const csvData = Papa.parse(input, { header: true }).data
    const parsed = extrairDadosDoCSV(csvData, semesters, dbCollection)
    setExtractResult(parsed)
    setStatus({ message: '' })
  }

  const handleSave = async () => {
    if (!dadosExtraidos) return
    setStatus({ message: 'Salvando...', type: 'info' })
    try {
      console.log(dadosExtraidos)
      Object.entries(dadosExtraidos).forEach(([participante, { _id, agenda }]) => {
        console.log(participante, _id, agenda)
      })

      // let ignoredParticipants = Object.keys(extractResult)
      // for (let participant of dbCollection) {
      //   const foundParticipant = dbCollection.find(item => item.name === participant.name)

      //   if (foundParticipant) {
      //     const participantId = foundParticipant._id
      //     const values = {
      //       name: participant.name,
      //       dates: [...(participant.data ?? []), ...(extractResult[participant.name] ?? [])],
      //     }
      //     // console.log('Atualizando participante', values)
      //     const response = await axios.post('/update', { id: participantId, values })

      //     ignoredParticipants = ignoredParticipants.filter(name => name !== participant.name)

      //     // console.log('Resposta update', response.data)
      //   }
      // }
      // dispatch(updateDBCollection())

      setStatus('Dados salvos/atualizados com sucesso!')
    } catch (err) {
      setStatus({ message: 'Erro ao salvar: ' + err.message, type: 'error' })
      console.error(err.stack || err)
    }
  }

  return (
    <div>
      <textarea
        rows={7}
        cols={60}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Cole o CSV do do horários aqui"
      />
      <br />
      <button onClick={handleExtract} style={{ marginTop: 12 }}>
        Extrair
      </button>
      {dadosExtraidos && (
        <>
          <div
            style={{
              marginTop: 24,
              maxHeight: 250,
              overflowY: 'auto',
              border: '1px solid #ddd',
              padding: 12,
              background: '#fafafa',
            }}>
            <h3>Dados Extraídos:</h3>
            {Object.entries(dadosExtraidos).map(([nome, { agenda }]) => (
              <div key={nome} style={{ marginBottom: 16 }}>
                <strong>{nome}</strong>
                <ul>
                  {agenda.map((datas, idx) => (
                    <li key={idx}>
                      Início: {new Date(datas.start).toLocaleDateString()} | Fim:{' '}
                      {new Date(datas.end).toLocaleDateString()}
                      <ul>
                        <li key={idx}>
                          {datas.daysOfWeekAndPeriod.map((periodoEmNumero, periodoIndex) =>
                            periodoEmNumero > 0 ? (
                              <li key={periodoIndex}>
                                {DIA_DA_SEMANA[periodoIndex]} - {PERIODO_DO_DIA[periodoEmNumero]}
                              </li>
                            ) : (
                              ''
                            ),
                          )}
                        </li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button onClick={handleSave} style={{ marginTop: 16 }}>
            Salvar no Banco
          </button>
          <div style={{ marginTop: 8, color: status.type === 'error' ? 'red' : 'green' }}>
            {status.message}
          </div>
        </>
      )}
    </div>
  )
}
