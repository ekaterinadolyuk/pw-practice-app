import { Page, expect } from '@playwright/test'
import { HelperBase } from './helperBase'

export class DatePickerPage extends HelperBase {
    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert2 = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert2)
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        const dateRangeToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateRangeToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date2 = new Date()
        date2.setDate(date2.getDate() + numberOfDaysFromToday)
        const expectedDate2 = date2.getDate().toString()
        const expectedMonthShort2 = date2.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date2.toLocaleString('En-US', {month: 'long'})
        
        const expectedYear2 = date2.getFullYear()
        const dateToAssert2 = `${expectedMonthShort2} ${expectedDate2}, ${expectedYear2}`
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear2}`
        while(!calendarMonthAndYear?.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
    
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate2, {exact: true}).click()
        return dateToAssert2
    }

}