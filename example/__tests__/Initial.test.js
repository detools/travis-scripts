import helper from 'tipsi-appium-helper'
import test from './utils/tape'

const { driver, idFromAccessId } = helper

test('Test if user can use App Container', async (t) => {
  await driver.waitForVisible(idFromAccessId('title'), 30000)
  t.pass('App Container is visible')
})
