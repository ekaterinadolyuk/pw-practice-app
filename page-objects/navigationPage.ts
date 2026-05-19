import { Locator, Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class NavigationPage extends HelperBase {

    //initialize the field in the constructor (page as parameter is passed from our test)
    constructor(page: Page) {
        super(page)
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click()
        await this.waitForNumberOfSeconds(2) // waiting for 1 second to make sure that the page is loaded before performing next steps
    }

    async datePickerPage() {
        //calling the private method to expand the menu if it's not expanded yet
        await this.selectGroupMenuItem('Forms') 
        //wait for 1 second to make sure that the page is loaded before clicking on the next element   
        await this.page.waitForTimeout(1000) 
        await this.page.getByText('Datepicker').click()
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data') 
        await this.page.getByText('Smart Table').click()
    }

    async toastPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Tooltip').click()
    }

    // to make method invisible outside of the class we can use a word private before the method name. 
    // this method will be visible only inside of the class and cannot be called from our test file. It can be used for some additional steps that we want to perform before or after calling the main method, but we don't want to call it directly from our test.
    private async selectGroupMenuItem (groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        
        if (expandedState === 'false') {
            await groupMenuItem.click()
        }
    }
}