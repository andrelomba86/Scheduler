import {
  // MONTHS,
  // DAY_OF_WEEK,
  // DAY_OF_WEEK_NUM,
  // PERIOD_OF_THE_DAY,
  PERIOD_OF_THE_DAY_MORNING,
  PERIOD_OF_THE_DAY_AFTERNOON
} from './Consts.js'

export function DatesChecker() {
  var collection = {};

  function setCollection(mongoCollection) {
    collection = mongoCollection
  }

  // Pontua a disponilibdade de pessoas no dia. Retorna array: [manhã, tarde]
  function DateAvailabilityPoints(dateToCheck) {
    var points = {
      [PERIOD_OF_THE_DAY_MORNING]: [0, []],
      [PERIOD_OF_THE_DAY_AFTERNOON]: [0, []]
    }
    const pointsIndex = 0
    const namesIndex = 1

    // Loop para cada chave (pessoa)
    // Formato do objeto Data = { chave: [ [data1, data2] , [ [data1], [data2] ] }
    Object.entries(collection).forEach(([_key, doc]) => {

      doc.dates.forEach((date, _index) => {

        if (IsBetweenDatesCheck(dateToCheck, new Date(date.start), new Date(date.end))) {

          var week = date.daysOfWeekAndPeriod
          if (week.every(item => item === 0)) {
            if (!FindInArray(doc.name, points[PERIOD_OF_THE_DAY_MORNING][namesIndex])) {
              points[PERIOD_OF_THE_DAY_MORNING][pointsIndex]++
              points[PERIOD_OF_THE_DAY_MORNING][namesIndex].push(doc.name)
            }
            if (!FindInArray(doc.name, points[PERIOD_OF_THE_DAY_AFTERNOON][namesIndex])) {
              points[PERIOD_OF_THE_DAY_AFTERNOON][pointsIndex]++
              points[PERIOD_OF_THE_DAY_AFTERNOON][namesIndex].push(doc.name)
            }

          }
          else {
            var dayOfWeekValue = week[dateToCheck.getDay()]

            if (dayOfWeekValue > 0) {
              if (dayOfWeekValue & PERIOD_OF_THE_DAY_MORNING && !FindInArray(doc.name, points[PERIOD_OF_THE_DAY_MORNING][namesIndex])) {
                points[PERIOD_OF_THE_DAY_MORNING][pointsIndex]++
                points[PERIOD_OF_THE_DAY_MORNING][namesIndex].push(doc.name)
              }
              if (dayOfWeekValue & PERIOD_OF_THE_DAY_AFTERNOON && !FindInArray(doc.name, points[PERIOD_OF_THE_DAY_AFTERNOON][namesIndex])) {
                points[PERIOD_OF_THE_DAY_AFTERNOON][pointsIndex]++
                points[PERIOD_OF_THE_DAY_AFTERNOON][namesIndex].push(doc.name)
              }
            }
          }
        }
      })
    });
    return points;
  }

  function FindInArray(name, array) {
    if (array.find((p) => p === name) === undefined) return false
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
      [0, 0, 0, 0, 0, 0, 0]
    ]

    const freeRow = ( firstDayOfWeek + totalMonthDays < 36   ? 1 : 0)   
    
    for (var i = 0; i < totalMonthDays; i++) {
      var week = Math.floor(firstDayOfWeek / 7) + freeRow
      var dayOfWeek = (firstDayOfWeek % 7)
      const day = i + 1
      calendar[week][dayOfWeek] = DateAvailabilityPoints(new Date(year, month, day))

      firstDayOfWeek++
    }
    console.log(calendar)
    return calendar
  }

  function IsBetweenDatesCheck(DateToCheck, FirstDate, LastDate) {
    return (DateToCheck >= FirstDate && DateToCheck <= LastDate)
  }
  return {
    setCollection,
    Calendar
  }
}

// module.exports = createNewDateAvailability;


// function MonthCheck(month, year) {

  // var result = []
  // for (var i = 0; i < new Date(2020, month + 1, 0).getDate(); i++) {
    // const day = i + 1

    // result[day] = DateAvailabilityPoints(new Date(year, month, day))
  // }
  // return result
// }