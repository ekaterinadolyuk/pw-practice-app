import {test} from '../test-options'
import {faker} from '@faker-js/faker'

// test.beforeEach(async ({page}) => {
//     await page.goto('/') //navigate to the base url, which is set in the config file, and add '/' to navigate to the homepage
// })

test('parametrized method', async ({pageManager}) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pageManager.getFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USER_NAME!, process.env.PASSWORD!, 'Option 2')
    await pageManager.getFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})
