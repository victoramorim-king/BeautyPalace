function addReminder(reminder, appointmentData){
  reminder[appointmentData.clientName] = {
    "clientName": appointmentData.clientName,
    "tel": appointmentData.tel,
    "service": [appointmentData.service],
    "appointmentTime": appointmentData.appointmentTime
  } 
}

function updateReminder(reminder, appointmentData){
  reminder[appointmentData.clientName].service.push(appointmentData.service)
  if(reminder[appointmentData.clientName].appointmentTime > appointmentData.appointmentTime){
    reminder[appointmentData.clientName].appointmentTime = appointmentData.appointmentTime
  }

}

function handleResponseJson(reminders, jsonData){
  if(jsonData){
    let appointmentData = {
      'clientName': jsonData['cliente_nome'], 
      'tel': jsonData['cliente_tel'],
      'service': jsonData['servico'],
      'appointmentTime': jsonData['hora_inicio']
    }  
    if (Object.keys(reminders).includes(appointmentData.clientName)){
      updateReminder(reminders, appointmentData)
    } else {
      addReminder(reminders, appointmentData)
    }
  }
}

function renameRedundantServices(reminders){
  var remindersValues = Object.values(reminders)
  remindersValues.forEach(element => {
    if(element.service.includes('escovar e pranchar progressiva , selagem ou botox ')){
      element.service[element.servico.indexOf('escovar e pranchar progressiva , selagem ou botox ')] = ''
    }
    if(element.service.includes('escovar e pranchar progressiva , selagem ou botox' || elementservice.includes('escovar e pranchar progressiva , selagem ou botox '))){
      element.service[element.service.indexOf('escovar e pranchar progressiva , selagem ou botox')] = ''
    }
    if(element.service.includes('Aplicar progressiva ')){
      element.service[element.service.indexOf('Aplicar progressiva ')] = 'Progressiva'
    }
    if(element.service.includes('Aplicar progressiva')){
      element.service[element.service.indexOf('Aplicar progressiva')] = 'Progressiva'
    }
    if(element.service.includes('Aplicar botox capilar ')){
      element.service[element.service.indexOf('Aplicar botox capilar ')] = 'Botox'
    }
    if(element.service.includes('Aplicar botox capilar')){
      element.service[element.service.indexOf('Aplicar botox capilar')] = 'Botox'
    }
    if(element.service.includes('Aplicar selagem ')){
      element.service[element.service.indexOf('Aplicar selagem ')] = 'Selagem'
    }
    if(element.service.includes('Aplicar selagem')){
      element.service[element.service.indexOf('Aplicar selagem')] = 'Selagem'
    }
  });  

  return remindersValues

}

function stringfyServices(reminders){
  var remindersValues = Object.values(reminders)
  
  remindersValues.forEach(element => {
    let temp = ""
    if(element.service.length == 1){
      element.service = element.service[0]
    }else{
      element.service.forEach(element => {
        temp = temp + element + "\n"
      });
      element.service = temp
      
    }
  })

  return remindersValues
}

function formatAppointmentTime(reminders){
  var remindersValues = Object.values(reminders)
  remindersValues.forEach(element => {
    let minutes = element.appointmentTime;
    const hours = Math.floor(minutes / 60);
    const minutesRemaning = minutes % 60;
    element.appointmentTime = hours + ":" + (minutesRemaning < 10 ? "0" : "") + minutesRemaning;
  })
}

module.exports = function handleAppointmentsResponse(responseData){
  let reminders = {}
  for (let i = 0; i < responseData['dados'].length; i++){
    for (let d = 0; d < responseData['dados'][i]['reservas'].length; d++){
        handleResponseJson(reminders, responseData['dados'][i]['reservas'][d])
      }
  }
  renameRedundantServices(reminders)
  stringfyServices(reminders)
  formatAppointmentTime(reminders)

  

  console.log("lembretes Carregados")
  console.log(reminders)
  return reminders
}
  









