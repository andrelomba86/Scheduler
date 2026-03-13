import {
  // MONTHS,
  // DAY_OF_WEEK,
  // DAY_OF_WEEK_NUM,
  // PERIOD_OF_THE_DAY,
  PERIODO_DO_DIA_MANHA,
  PERIODO_DO_DIA_NOITE,
} from './Consts.js'

export function DatesChecker() {
  var collection = {}

  function setCollection(mongoCollection) {
    collection = mongoCollection
  }

  // Pontua a disponilibdade de pessoas no dia. Retorna array: [manhã, tarde]
  function DateAvailabilityPoints(dateToCheck) {
    var points = {
      0: 0,
      [PERIODO_DO_DIA_MANHA]: [0, []],
      [PERIODO_DO_DIA_NOITE]: [0, []],
    }
    const pointsIndex = 0
    const namesIndex = 1

    // Loop para cada chave (pessoa)
    // Formato do objeto Data = { chave: [ [data1, data2] , [ [data1], [data2] ] }
    Object.entries(collection).forEach(([_key, doc]) => {
      points[0] = dateToCheck.getDate() // define chave 0 do objeto com o dia
      doc?.dates?.forEach((date, _index) => {
        if (IsBetweenDatesCheck(dateToCheck, new Date(date.start), new Date(date.end))) {
          var week = date.daysOfWeekAndPeriod
          // Confere se foi indicado dia da semana (caso a Array esteja com 0's então não foi indicado)
          if (!week || week.every(item => item === 0)) {
            if (!findInArray(doc.name, points[PERIODO_DO_DIA_MANHA][namesIndex])) {
              points[PERIODO_DO_DIA_MANHA][pointsIndex]++
              points[PERIODO_DO_DIA_MANHA][namesIndex].push(doc.name)
            }
            if (!findInArray(doc.name, points[PERIODO_DO_DIA_NOITE][namesIndex])) {
              points[PERIODO_DO_DIA_NOITE][pointsIndex]++
              points[PERIODO_DO_DIA_NOITE][namesIndex].push(doc.name)
            }
          } else {
            var dayOfWeekValue = week[dateToCheck.getDay()]

            if (dayOfWeekValue > 0) {
              if (
                dayOfWeekValue & PERIODO_DO_DIA_MANHA &&
                !findInArray(doc.name, points[PERIODO_DO_DIA_MANHA][namesIndex])
              ) {
                points[PERIODO_DO_DIA_MANHA][pointsIndex]++
                points[PERIODO_DO_DIA_MANHA][namesIndex].push(doc.name)
              }
              if (
                dayOfWeekValue & PERIODO_DO_DIA_NOITE &&
                !findInArray(doc.name, points[PERIODO_DO_DIA_NOITE][namesIndex])
              ) {
                points[PERIODO_DO_DIA_NOITE][pointsIndex]++
                points[PERIODO_DO_DIA_NOITE][namesIndex].push(doc.name)
              }
            }
          }
        }
      })
    })
    return points
  }

  function findInArray(name, array) {
    if (array.find(p => p === name) === undefined) return false
    return true
  }

  function Calendar(month, year) {
    var firstDayOfWeek = new Date(year, month, 1).getDay()
    const totalMonthDays = new Date(year, month + 1, 0).getDate()

    var calendar = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]

    const freeRow = firstDayOfWeek + totalMonthDays < 36 ? 1 : 0

    for (var i = 0; i < totalMonthDays; i++) {
      var week = Math.floor(firstDayOfWeek / 7) + freeRow
      var dayOfWeek = firstDayOfWeek % 7
      const day = i + 1
      calendar[week][dayOfWeek] = DateAvailabilityPoints(new Date(year, month, day))
      // calendar[week].push(day)

      firstDayOfWeek++
    }
    // console.log(calendar)
    return calendar
  }

  function IsBetweenDatesCheck(DateToCheck, FirstDate, LastDate) {
    return DateToCheck >= FirstDate && DateToCheck <= LastDate
  }
  return {
    setCollection,
    Calendar,
  }
}
