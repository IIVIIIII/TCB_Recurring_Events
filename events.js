import { supabase } from './client'

export default function Hello() {

  // method later used to convert string to list
  const map = Array.prototype.map

  // query returns events with instances between these dates (month of march)
  var from = '2020-03-01'
  var to = '2020-03-31'



  // query data within determined time frame
  async function getEvents(start, stop) {
    const { data } = await supabase
    .rpc("get_events", { starting: start, ending: stop })
    // .rpc("new_query", { starting: start, ending: stop })

    // convert strings for end and and begining of query to date objects
    stop = new Date(stop.replace(/-/g, '\/'))
    start = new Date(start.replace(/-/g, '\/'))


    // generate dates for instances of the event passed to it within queryied time frame
    function generateDates(event) {

      // array to hold dates for event instances
      let eventDates = []

      // dates for when the event begins and ends regardless of queried time frame
      let startDate = new Date(event['start_date_'].replace(/-/g, '\/'))
      let endDate = new Date(event['end_date_'].replace(/-/g, '\/'))

      // array with event start date, query start date, and which ever of those comes later
      let begin = [startDate, start, new Date(Math.max(startDate, start))]

      // event end date or query end date depending on which comes first
      let end = new Date(Math.min(endDate, stop))

      // event's recurring type (0:daily, 1:weekly, 2:monthly, 3:yearly)
      let recur = event['recurring_type_']

      // separation between recurring events with respect to its recurring type
      let separate = event['separation_count_']+1

      // array of unix timestamps for dates which are exceptions to the events recurrance rules
      let except = event['exceptions_'].map(ex => {return new Date(ex.replace(/-/g, '\/')).valueOf()})

      // get max number of occurances
      let occurrences = event['max_num_of_occurrences_']
      if (typeof occurrences != Number) {
        occurrences = Infinity
      }

      // day of the week that event starts on
      let days = [startDate.getDay()]

      // if event repeats weekly on multiple days of the week (ex: every tuesday and thursday)
      if (event['days_of_week_'] > 0) {
        // convert integer whose digits refer to days of the week to an array with a corresponding element for each day
        let day = map.call(event['days_of_week_'].toString(), d => {return d-1})
        // combine first day with new days
        days = days.concat(day)
        //remove duplicates
        days = days.filter((d, index) => {return days.indexOf(d) === index});
      }




      // if event repeats dailey
      if (recur == 0) {

        // date of event instance
        let date = begin[2]

        // iterate through dates within selected time frame while not exceeding max number of recurrences
        while (date <= end && eventDates.length < occurrences) {

          // if date isnt an exception add it to eventDates
          if (except.includes(date.valueOf()) == 0) {
            eventDates.push(new Date(date.valueOf()))
          }

          // add one day to date and create new date object
          date = new Date(date.setDate(date.getDate() + 1))

        }
      }
    

      // if event repeats weekly
      else if (recur == 1) {

        // date of potential event instance
        let date = begin[0]

        // if event start date is less than query starting date, determine first relevant event instance starting date
        if (begin[0] < begin[1]) {
          var daysBetween = (begin[1] - begin[0])/86400000
          date = new Date(begin[1].setDate(begin[1].getDate()+(7*separate - daysBetween%(7*separate))))
        }

        // create array of instance starting dates which correspond to the days week that the event repeats on
        let dates = days.map(day => {
          let beginning = new Date(date.valueOf())
          return beginning.setDate(beginning.getDate() + (day - date.getDay()))
        }).sort().map(day => {return new Date(day)})

        // iterate through dates within selected time frame while not exceeding max number of recurrences
        while (date <= end && eventDates.length < occurrences) {

          // for each day of the weeks date
          dates.forEach(day => {

            // if day is within selected time frame and isnt an exception and doest exceed max recurrences add it to eventDates
            if (day >= begin[2] && day <= end && except.includes(day.valueOf()) == 0 && eventDates.length < occurrences) {
              eventDates.push(new Date(day.valueOf()))
            }

            // set day in dates array to next date according to recurrance pattern
            day = new Date(day.setDate(day.getDate() + 7*separate))

          })
          
          // order dates from earliest to latest
          dates = dates.map(d => {
            return d.valueOf()
          }).sort().map(d => {return new Date(d)})

          // set date to most recent day to see if loop should continue
          date = dates[0]

        }
      }


      // if event repeats monthly
      else if (recur == 2) {

        // function to calculate the number of months between 2 dates
        function monthDiff(d1, d2) {
          var months;
          months = (d2.getFullYear() - d1.getFullYear()) * 12;
          months -= d1.getMonth();
          months += d2.getMonth();
          return months <= 0 ? 0 : months;
        }

        // date of potential event instance starting with event start date
        let date = begin[0]

        // if event start date is less than query starting date, determine first relevant event instance starting date
        if (begin[0] < begin[1]) {
          let monthsBetween = monthDiff(begin[0], begin[1])
          date = new Date(date.setMonth(begin[1].getMonth() + monthsBetween%separate))
        }

        // iterate through dates within selected time frame while not exceeding max number of recurrences
        while (date <= end && eventDates.length < occurrences) {

          // if date is greater than or equal to query start and isnt an exception add it to eventDates
          if (date >= begin[1] && except.includes(date.valueOf()) == 0) {
            eventDates.push(new Date(date.valueOf()))
          }

          // new date object for the last day of the next month in the recurrance pattern
          let maxDate = new Date(date.getFullYear(), date.getMonth() + separate + 1, 0)

          // if the event start date's day of the month is greater than maxDates day of the month then set date to maxDate
          if (begin[0].getDate() > maxDate.getDate()) {
            date = maxDate
          }
          // else set date to next month with respect to separation count
          else {
            date = new Date(date.getFullYear(), date.getMonth() + separate, begin[0].getDate())
          }

        }
      }


      // if repeats yearly
      else {

        // date of potential event instance starting with event start date
        let date = begin[0]
        
        // iterate through dates within selected time frame while not exceeding max number of recurrences
        while (date <= end && eventDates.length < occurrences) {

          // if date is greater than or equal to query start and isnt an exception add it to eventDates
          if (date >= begin[1] && except.includes(date.valueOf()) == 0) {
            eventDates.push(new Date(date.valueOf()))
          }

          // else set date to next year with respect to separation count
          date = new Date(date.setYear(date.getFullYear() + separate))

        }
      }

      return eventDates

    }




    // generate event instances for each event
    data.forEach(event => {
      event['dates_'] = generateDates(event)
    })

    // log all data for all events
    console.log(data)

  }


  getEvents(from, to)

  return null

}
