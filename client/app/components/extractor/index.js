import React, { useState } from 'react'
import FrequenciaDocente from './FrequenciaDocente'
import HorariosGraduacao from './HorariosGraduacao'
import AulasDeCampo from './AulasDeCampo'

const extratores = [
  { label: 'Frequência docente [SISRH]', value: 'frequencia', component: FrequenciaDocente },
  { label: 'Horários de disciplinas da graduação', value: 'graduacao', component: HorariosGraduacao },
  {
    label: 'Aulas de campo',
    value: 'aulasdecampo',
    component: AulasDeCampo,
  },
]

export default function ExtratoresPage() {
  const [selected, setSelected] = useState('frequencia')
  const SelectedComponent = extratores.find(e => e.value === selected)?.component

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Extratores de Dados</h1>
      <select className="border p-2 mb-4" value={selected} onChange={e => setSelected(e.target.value)}>
        {extratores.map(e => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>
      <div className="mt-4">{SelectedComponent && <SelectedComponent />}</div>
    </div>
  )
}
