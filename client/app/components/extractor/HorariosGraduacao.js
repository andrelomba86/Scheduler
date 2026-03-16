import React, { useState, useCallback } from 'react'
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

// Configuração global do axios
axios.defaults.baseURL = 'http://localhost:5000'

//-----------------------------------------

// Mapeamento dos dias da semana para índices
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

// Função utilitária para extrair dados do CSV
function extrairDadosDoCSV(csvRows, semesters, dadosDosParticipantes) {
  const dadosDeSaida = {} // formato: { [participante]: { _id, agenda: [{ start, end, daysOfWeekAndPeriod }, ...] } }

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
      console.warn('Semestre não identificado para disciplina:', disciplina)
      return
    }
    const arrayDiasDaSemana = criarArraySemana()
    const diasEHorariosMatch = diasEHorarios
      .toLowerCase()
      .matchAll(/(domingo|segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado)\:\s(\d{2}:\d{2}-\d{2}:\d{2})/g)
    for (let [_, dia, horario] of diasEHorariosMatch) {
      if (!dia) {
        console.warn(`Dia não encontrado na string para disciplina ${disciplina}:`, diasEHorarios)
        return
      }
      const periodo = obterPeriodoDoDia(horario)
      if (!periodo) {
        console.warn(`Período não identificado para horário para disciplina ${disciplina}:`, horario)
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
      // structuredClone é necessário pois agenda pode ser aninhada
      if (!dadosDeSaida[participante]) {
        dadosDeSaida[participante] = { _id, agenda: structuredClone(agendaOriginal) }
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
  const [dadosExtraidos, setDadosExtraidos] = useState(null)
  const [status, setStatus] = useState({ message: '', type: 'info' })
  const [loading, setLoading] = useState(false)
  const semesters = getSemesterDates()
  const { dbCollection } = useSelector(getParticipantsState)
  const dispatch = useDispatch()

  // Extrai dados do CSV
  const handleExtrairDados = useCallback(() => {
    setStatus({ message: '', type: 'info' })
    try {
      const csvData = Papa.parse(input, { header: true }).data
      if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
        setStatus({ message: 'CSV inválido ou vazio.', type: 'error' })
        setDadosExtraidos(null)
        return
      }
      const parsed = extrairDadosDoCSV(csvData, semesters, dbCollection)
      setDadosExtraidos(parsed)
      setStatus({ message: 'Dados extraídos com sucesso!', type: 'info' })
    } catch (err) {
      setStatus({ message: 'Erro ao processar CSV: ' + err.message, type: 'error' })
      setDadosExtraidos(null)
    }
  }, [input, semesters, dbCollection])

  // Salva dados extraídos no banco
  const handleSalvarDados = useCallback(async () => {
    if (!dadosExtraidos) return
    setLoading(true)
    setStatus({ message: 'Salvando...', type: 'info' })
    try {
      await Promise.all(
        Object.entries(dadosExtraidos).map(async ([participante, { _id, agenda }]) => {
          const response = await axios.post('/update', { id: _id, values: { dates: agenda } })
          if (!response.data.result) {
            console.error(
              `Erro ao atualizar participante ${participante}:, id ${_id}, agenda: ${agenda}`,
              response.data.result.error,
            )
          } else {
            console.log(`Atualizado ${participante} com sucesso!`, response.data)
          }
        }),
      )
      dispatch(updateDBCollection())
      setStatus({ message: 'Dados salvos/atualizados com sucesso!', type: 'info' })
    } catch (err) {
      setStatus({ message: 'Erro ao salvar: ' + err.message, type: 'error' })
      console.error(err.stack || err)
    } finally {
      setLoading(false)
    }
  }, [dadosExtraidos, dispatch])

  return (
    <div>
      <textarea
        rows={7}
        cols={60}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Cole o CSV dos horários aqui"
        disabled={loading}
        style={{ opacity: loading ? 0.6 : 1 }}
      />
      <br />
      <button onClick={handleExtrairDados} style={{ marginTop: 12 }} disabled={loading || !input}>
        {loading ? 'Processando...' : 'Extrair'}
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
            <h4>Como ficarão os dados mesclados:</h4>
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
                          <ul>
                            {datas.daysOfWeekAndPeriod?.map((periodoEmNumero, periodoIndex) =>
                              periodoEmNumero > 0 ? (
                                <li key={periodoIndex}>
                                  {DIA_DA_SEMANA[periodoIndex]} - {PERIODO_DO_DIA[periodoEmNumero]}
                                </li>
                              ) : null,
                            )}
                          </ul>
                        </li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button onClick={handleSalvarDados} style={{ marginTop: 16 }} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar no Banco'}
          </button>
          <div style={{ marginTop: 8, color: status.type === 'error' ? 'red' : 'green' }}>
            {status.message}
          </div>
        </>
      )}
    </div>
  )
}
