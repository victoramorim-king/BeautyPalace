const config = require('./config.json');
const puppeteer = require('puppeteer');
const fs = require('fs');
const querystring = require('querystring');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://admin.salaovip.com.br/beautypalace/admin');
  await page.type('#formEmail', config.email)
  await page.type('#formSenha', config.passWord)
  await page.click('.btn-login')
  await page.waitForResponse('https://admin.salaovip.com.br/admin/agenda/carregarAgenda')
  await page.click('xpath//html/body/div[10]/div[2]/div[4]/div[2]/div[1]/div[2]/div[1]/ul/li[5]')
  await page.waitForResponse('https://admin.salaovip.com.br/admin/agenda/carregarAgenda')
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = String(tomorrow.getDate())
  await page.click(`xpath///html/body/div[10]/div[2]/div[3]/div[2]/div[1]/div/div[1]/table/tbody/*/td[contains(text(), "${tomorrow}") and not(contains(@class, "old"))]`)
  const agendamentos = await page.waitForResponse('https://admin.salaovip.com.br/admin/agenda/carregarAgenda')
  console.log(await agendamentos.json())
  let data = JSON.stringify(await agendamentos.json(), null, 2);
  fs.writeFile('agendamentos.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

  await browser.close();
})();
