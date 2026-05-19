import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async ({page}) => {
    await page.goto('/') //navigate to the base url, which is set in the config file, and add '/' to navigate to the homepage
})

test('navigate to form page @smoke', async ({page}) => {
    //creating an instance of the class and passing page as parameter
    const pm = new PageManager(page) 
    
    //calling the method from the class
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastPage()
    await pm.navigateTo().tooltipPage()
})


test('parametrized method @smoke @regression', async ({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()  
    await pm.getFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USER_NAME!, process.env.PASSWORD!, 'Option 2')
    await page.screenshot({path: 'screenshots/formsLayoutsPage.png'}) //screenshot for sull browser window
    const buffer = await page.screenshot() //save screenshot as a binary
    //console.log(buffer.toString('base64')) //log the binary data to the console

    await pm.getFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'}) //screenshot for specific element
    // await pm.navigateTo().datePickerPage()
    // await pm.getDatePickerPage().selectCommonDatepickerDateFromToday(5)
    // await pm.getDatePickerPage().selectDatePickerWithRangeFromToday(6, 15)
})

test.only('testing with argos ci', async ({page}) => {
    //creating an instance of the class and passing page as parameter
    const pm = new PageManager(page) 
    
    //calling the method from the class
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().smartTablePage()
})
