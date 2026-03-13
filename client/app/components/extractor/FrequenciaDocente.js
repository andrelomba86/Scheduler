import React, { useState } from 'react'
import axios from 'axios'
import { getParticipantsState, updateDBCollection } from '../redux/participantsSlice'
import { useSelector, useDispatch } from 'react-redux'

axios.defaults.baseURL = 'http://localhost:5000'

function parseDocentes(text) {
  const lines = text.split('\n')
  let currentDocente = null
  const docentes = {}

  for (const line of lines) {
    // Detecta nome do docente
    const nomeMatch = line.match(/^([A-Za-zÀ-ÿ .'-]+) \[ \+ \]$/)
    if (nomeMatch) {
      currentDocente = nomeMatch[1].trim()
      docentes[currentDocente] = []
      continue
    }
    // Detecta períodos de férias/afastamento
    const periodoMatch = line.match(/\((\d{2}\/\d{2}\/\d{4}) a (\d{2}\/\d{2}\/\d{4})\)/)
    if (currentDocente && periodoMatch) {
      const inicio = periodoMatch[1].split('/').reverse().join('-')
      const fim = periodoMatch[2].split('/').reverse().join('-')
      docentes[currentDocente].push({
        start: new Date(inicio + 'T00:00:00').toISOString(),
        end: new Date(fim + 'T00:00:00').toISOString(),
      })
    }
  }
  return docentes
}

export default function FrequenciaDocente() {
  const [input, setInput] = useState('')
  const [extractResult, setExtractResult] = useState(null)
  const [status, setStatus] = useState({ message: '', type: 'info' })

  const { dbCollection } = useSelector(getParticipantsState)
  const dispatch = useDispatch()

  const handleExtract = () => {
    const parsed = parseDocentes(input)
    setExtractResult(parsed)
    setStatus({ message: '' })
  }

  const handleSave = async () => {
    if (!extractResult) return
    setStatus({ message: 'Salvando...', type: 'info' })
    try {
      let ignoredParticipants = Object.keys(extractResult)
      for (let participant of dbCollection) {
        const foundParticipant = dbCollection.find(item => item.name === participant.name)

        if (foundParticipant) {
          const participantId = foundParticipant._id
          const values = {
            name: participant.name,
            dates: [...(participant.data ?? []), ...(extractResult[participant.name] ?? [])],
          }
          // console.log('Atualizando participante', values)
          const response = await axios.post('/update', { id: participantId, values })

          ignoredParticipants = ignoredParticipants.filter(name => name !== participant.name)

          // console.log('Resposta update', response.data)
        }
      }
      console.log('Ignorados: \n\t', ignoredParticipants.join('\n\t'))
      dispatch(updateDBCollection())

      // const promises = Object.entries(result).map(([nome, dates]) =>
      //   axios.post('http://localhost:5000/docente', { nome, dates }),
      // )
      // await Promise.all(promises)
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
        placeholder="Cole o texto do atestado de frequência aqui"
      />
      <br />
      <button onClick={handleExtract} style={{ marginTop: 12 }}>
        Extrair
      </button>
      {extractResult && (
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
            {Object.entries(extractResult).map(([nome, dates]) => (
              <div key={nome} style={{ marginBottom: 16 }}>
                <strong>{nome}</strong>
                <ul>
                  {dates.map((period, idx) => (
                    <li key={idx}>
                      Início: {new Date(period.start).toLocaleDateString()} | Fim:{' '}
                      {new Date(period.end).toLocaleDateString()}
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
