const config = require('./config.json');
const puppeteer = require('puppeteer');
const fs = require('fs');
const querystring = require('querystring');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.setRequestInterception(true);

    let dir = 0;
  page.on('request', async request => {
    if (request.url() === 'https://admin.salaovip.com.br/admin/agenda/carregarAgenda' && dir == 0) {
      dir = 1
      const postData = request.postData().replace('2023-02-07', '2023-02-09')

      console.log(postData)
     var data = {
        'method': 'POST',
        'postData': querystring.stringify(postData),
        'headers': {
            ...request.headers(),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    };
    request.continue(data);  
    }
    else {
      request.continue();
    }
  });
  await page.goto('https://admin.salaovip.com.br/beautypalace/admin');
  await page.type('#formEmail', config.email)
  await page.type('#formSenha', config.passWord)
  await page.click('.btn-login')
  const agendamentos = await page.waitForResponse('https://admin.salaovip.com.br/admin/agenda/carregarAgenda')
        const response = await page.goto("https://admin.salaovip.com.br/admin/agenda/carregarAgenda");

      console.log({
        url: response.url(),
        statusCode: response.status(),
        body: await response.text()
      });
  await browser.close();
})();
