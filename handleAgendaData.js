let jsonData = require('./agendamentos.json');
let lembretes = {}


for (let i = 0; i < jsonData['dados'].length; i++){
  for (let d = 0; d < jsonData['dados'][i]['reservas'].length; d++){
    if(jsonData['dados'][i]['reservas'][d]){
      let cliente = jsonData['dados'][i]['reservas'][d]['cliente_nome'] 
      let tel = jsonData['dados'][i]['reservas'][d]['cliente_tel']
      let servico = jsonData['dados'][i]['reservas'][d]['servico']

      if (Object.keys(lembretes).includes(cliente)){
        lembretes[cliente].servico.push(servico)
      } else {
        lembretes[cliente] = {
          "nome": cliente,
          "tel": tel,
          "servico": [servico]
        } 
      }
    }
  }
}



const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
  const number = "+5511977441628";
  const chatId = number.substring(1) + "@c.us";

Object.values(lembretes).forEach(element => {
let text = `Olá, ${element.nome},
passando para lembrar que você tem o(s) seguintes serviço(s) agendado(s) para amanhã:
${element.servico}`

  client.sendMessage(chatId, text);;
})

  // Getting chatId from the number.
  // we have to delete "+" from the beginning and add "@c.us" at the end of the number.

});

client.initialize()
