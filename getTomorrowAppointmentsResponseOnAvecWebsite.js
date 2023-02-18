const puppeteer = require('puppeteer');
const config = require('./config.json');

function getTomorrowAgendaButtonXpath(){
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = String(tomorrow.getDate());
  tomorrow = "14"
  return `xpath///html/body/div[10]/div[2]/div[3]/div[2]/div[1]/div/div[1]/table/tbody/*/td[contains(text(), "${tomorrow}") and not(contains(@class, "old"))]`;
}

const emailInputId = '#formEmail';
const passwordInputId = '#formSenha'; 
const loginButtonClass = '.btn-login';
const avecSistemLoginUrl = 'https://admin.salaovip.com.br/beautypalace/admin'; 
const appointmentsApiEndpointUrl = 'https://admin.salaovip.com.br/admin/agenda/carregarAgenda'; 
const tomorrowAgendaButtonXpath = getTomorrowAgendaButtonXpath();
const loadAllProfessionalsButtonXpath = 'xpath//html/body/div[10]/div[2]/div[4]/div[2]/div[1]/div[2]/div[1]/ul/li[5]';

module.exports = async function getTomorrowAppointmentsResponseOnAvecWebsite(){
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();

  await page.goto(avecSistemLoginUrl);
  await page.type(emailInputId, config.email)
  await page.type(passwordInputId, config.passWord)
  await page.click(loginButtonClass)

  await page.waitForResponse(appointmentsApiEndpointUrl)
  await page.click(tomorrowAgendaButtonXpath)
  await page.waitForResponse(appointmentsApiEndpointUrl)
  await page.click(loadAllProfessionalsButtonXpath)

  let appointments = await page.waitForResponse(appointmentsApiEndpointUrl)
  appointments = await appointments.json()

  await browser.close();

  return  appointments

}
 
