const getTomorrowAppointmentsResponseOnAvecWebsite = require('./getTomorrowAppointmentsResponseOnAvecWebsite');
const handleAppointmentsResponse = require('./handleAppointmentsResponse')
const sendRemindersViaWhatsapp = require('./sendRemindersViaWhatsapp')

async function main(){
  const appointmentsResponse = await getTomorrowAppointmentsResponseOnAvecWebsite()
  const reminders = handleAppointmentsResponse(appointmentsResponse)
  sendRemindersViaWhatsapp(reminders)

}

main()


