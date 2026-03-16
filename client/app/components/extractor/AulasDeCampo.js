import React, { useState } from 'react'
import axios from 'axios'
import { dbCollection, getParticipantsState, updateDBCollection } from '../redux/participantsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Papa from 'papaparse'
// import { getSemesterDates } from '../MenuBar'
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

function extrairDadosDoCSV(csvRows, dadosDosParticipantes) {
  const dadosDeSaida = {} // formato: { [participante]: { _id, datas: [{ start, end, daysOfWeekAndPeriod }, ...] }

  function obterData(data) {
    const ano = new Date().getFullYear()
    const [mes, dia] = data.split('/').reverse()
    return new Date(`${ano}-${mes}-${dia}T00:00:00`).toISOString()
  }

  csvRows.forEach(row => {
    const dataInicio = obterData(row['DATA DE SAÍDA DA SEDE'])
    const dataFim = obterData(row['DATA DE CHEGADA NA SEDE'])

    const disciplina = row['DISCIPLINA']
    const responsaveis = row['DOCENTE(S) RESPONSÁVEL(IS)'].split(',').map(s => s.trim())

    if (!dataInicio || !dataFim) {
      console.log('Dados não encontrados na linha', row)
      return
    }
    // ({ name: participante, _id, dates: agendaOriginal })
    responsaveis.forEach(responsavel => {
      const dadosDoResponsavel = dadosDosParticipantes.find(p => p.name === responsavel)

      if (!dadosDoResponsavel) {
        console.warn(`Responsavel ${responsavel} ignorado na linha: ${row}`)
        return
      }
      const { _id, dates: agendaOriginal } = dadosDoResponsavel

      if (!dadosDeSaida[responsavel]) {
        dadosDeSaida[responsavel] = { _id, agenda: structuredClone(agendaOriginal) }
      }

      let jaRegistrado = dadosDeSaida[responsavel].agenda.find(
        periodo => periodo.start === dataInicio && periodo.end === dataFim,
      )
      if (jaRegistrado) {
        console.info(`Datas ${dataInicio} - ${dataFim} já registradas para ${responsavel}`)
        return
      }

      let entrada = {
        start: dataInicio,
        end: dataFim,
      }
      dadosDeSaida[responsavel].agenda.push(entrada)
    })
  })

  return dadosDeSaida
}

export default function AulasDeCampo() {
  const [input, setInput] = useState('')
  const [dadosExtraidos, setDadosExtraidos] = useState(null)
  const [status, setStatus] = useState({ message: '', type: 'info' })

  const { dbCollection } = useSelector(getParticipantsState)
  const dispatch = useDispatch()

  const handleExtrairDados = () => {
    const csvData = Papa.parse(input, { header: true }).data
    const parsed = extrairDadosDoCSV(csvData, dbCollection)
    setDadosExtraidos(parsed)
    setStatus({ message: '' })
  }

  const handleSalvarDados = async () => {
    if (!dadosExtraidos) return
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
    }
  }

  return (
    <div>
      <textarea
        rows={7}
        cols={60}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Cole o CSV das aulas de campo aqui"
      />
      <br />
      <button onClick={handleExtrairDados} style={{ marginTop: 12 }}>
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
                              ) : (
                                ''
                              ),
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
          <button onClick={handleSalvarDados} style={{ marginTop: 16 }}>
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
