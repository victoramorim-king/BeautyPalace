const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

function getTomorrowDate(){
  let date = new Date();

  date.setDate(date.getDate() + 1);

  let year = date.getFullYear()
  let month = String(date.getMonth() + 1)
  let day = String(date.getDate())

  month = month.length == 1 ? 
    month.padStart('2', '0') : month;

  day = day.length == 1 ? 
    day.padStart('2', '0') : day;

  return `${day}/${month}/${year}`;
}

module.exports = function sendRemindersViaWhatsapp(reminders){

  client.on('ready', () => {
    console.log('Whatsapp is ready!');

    let remindersWithErrors = []

    Object.values(reminders).forEach(element => {
      if(element.tel.length != 11){
        remindersWithErrors.push(element)
        console.log(`error detected: ${element}`)
      }

      element.clientName[0] = element.clientName.charAt(0).toUpperCase() 
      let text = `Olá, ${element.clientName.split(' ')[0]}! 👑
Tudo bem, rainha?

Lembrete de agendamento no Beauty Palace
📆 Amanhã ${getTomorrowDate()} 
⏰ Ás ${element.appointmentTime} 

${element.service}


Posso confirmar o seu horário?

⚠ Caso não consiga comparecer no atendimento, peço que desmarque com no mínimo 3 horas de antecedência para podermos encaixar outra rainha no horário.

⚠ Caso haja falta sem um aviso prévio, será cobrado uma taxa com o valor de 50% referente ao/s serviço/s que seria prestado.`

      let chatId = "55" + element.tel + "@c.us";
      client.sendMessage(chatId, text);
      console.log('lembretes enviados para:' + chatId + '|' + element.clientName)
    });

    chatId = "55" + '11982153054' + "@c.us";
    client.sendMessage(chatId, JSON.stringify(remindersWithErrors)).then(
      client.destroy()
    )
  })
  client.initialize()
}




