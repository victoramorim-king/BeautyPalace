const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  },
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
        console.log(`error detected: ${JSON.stringify(element)}`)
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

      let chatId = "55" + "11981451586" + "@c.us";
      client.sendMessage(chatId, text);
      console.log('lembretes enviados para:' + chatId + '|' + element.clientName)
    });

    chatId = "55" + '11981451586' + "@c.us";
    client.sendMessage(chatId, "Esses agendamentos não puderam ser enviados por conter algum erro em seus dados: \n" + JSON.stringify(remindersWithErrors)).finally()

    chatId = "55" + '11981451586' + "@c.us";
    client.sendMessage(chatId, "Esses agendamentos não puderam ser enviados por conter algum erro em seus dados: \n" + JSON.stringify(remindersWithErrors)).finally()

    console.log("Aguardando 2 minutos para garantir que todas as mensagens foram enviadas!")
    setTimeout(function() {
      client.destroy()
    }, 120000);
  })
  client.initialize()
}




