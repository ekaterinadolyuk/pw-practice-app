import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class FormLayoutsPage  extends HelperBase {
    constructor(page: Page) {
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email:string, password:string, optionText:string) {
        const usingTheGridForm = this.page.locator('nb-card', {hasText: "Using the Grid"})
        await usingTheGridForm.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGridForm.getByLabel('Password').fill(password)
        await usingTheGridForm.getByRole('radio', {name: optionText}).check({force: true})
        await usingTheGridForm.getByRole('button', {name: "Sign in"}).click()
    }

    /** 
     * Submits the inline form with the provided name, email, and remember me option
     * @param name - should be first and last name, e.g. "John Doe"
     * @param email - valid email of test user, e.g. "test@test.com"
     * @param rememberMe - true if user session to be saved
     */
    async submitInlineFormWithNameEmailAndCheckbox(name:string, email:string, rememberMe:boolean) {
        const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
        await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)
        
        if (rememberMe) {
            await inlineForm.getByRole('checkbox').check({force: true})
        }
        await inlineForm.getByRole('button').click()
    }
}