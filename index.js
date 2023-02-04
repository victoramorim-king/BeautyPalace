const config = require('./config.json')
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://admin.salaovip.com.br/beautypalace/admin');
  await page.type('#formEmail', config.email)
  await page.type('#formSenha', config.passWord)
  await page.click('.btn-login')
  const firstResponse = await page.waitForResponse('https://admin.salaovip.com.br/admin/agenda/carregarAgenda')
  console.log( await firstResponse.json() ) 
  await page.goto('https://web.whatsapp.com/')
  await page.waitForSelector('[data-testid="search"]')

  await browser.close();
})();
