import {expect} from '@playwright/test'
import {test} from '../test-options'

test('drag and drop with iframe', async ({page, globalsQaURL}) => {
    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/')
    //const consentsPopUp = await page.locator('div.fc-dialog-container .fc-footer-buttons-container button[class="fc-button fc-cta-consent fc-primary-button"]')
    const consentButton = page.getByRole('button', { name: 'Consent' })
    if (await consentButton.isVisible()){
        await consentButton.click()
    }
    //await consentsPopUp.click()

    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')

    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'), {force: true}) //force - for drag and drop, because it is not a real user action, but simulated one, and sometimes it can cause issues with the element being not interactable. Force will ignore that and perform the action anyway. It is not recommended to use force in real tests, because it can hide real issues with the application, but in this case it is necessary to make the test work.

    //more precise control
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})