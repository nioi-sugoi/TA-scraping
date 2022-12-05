const webdriver = require('selenium-webdriver');

const selenium = async () => {
  const { Builder, By, until, Key } = webdriver;

  const capabilities = webdriver.Capabilities.chrome();
  capabilities.set('chromeOptions', {
    args: [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      `--window-size=1980,1200`
    ]
  });

  const driver = await new Builder().withCapabilities(capabilities).build();

  try {
    await driver.get('https://daidata.goraggio.com/100928');

    await driver.findElement(By.xpath("//*[text()=\"利用規約に同意する\"]")).click()

    await driver.findElement(By.name('machine_name')).sendKeys('ツインエンジェルPARTY', Key.ENTER)

    await driver.findElement(By.className('Slot')).click()

    await driver.findElement(By.xpath("//*[text()=\"グラフ表示\"]")).click()

    const items = await driver.findElement(By.className('col2List')).findElements(By.tagName('li'))

    const asyncFunctions = items.map((item) => (async () => {
      const machineNum = await item.findElement(By.className('Radius-Slot')).getText()

      const scriptWebElement = await item.findElement(By.tagName('script'))

      const scriptHTMLElement = await scriptWebElement.getAttribute('innerHTML')

      const allDayData = JSON.parse(scriptHTMLElement.split('var data = ')[1].split(';')[0])[0]

      const latestDiff = Math.round(allDayData[allDayData.length - 1][1])

      console.log(machineNum, latestDiff)
    })())

    await Promise.all(asyncFunctions)
  } catch (e) {
    console.error(e)
  } finally {
    driver.quit()
  }
}

selenium()