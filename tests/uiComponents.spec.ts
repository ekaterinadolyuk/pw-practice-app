import {test, expect} from '@playwright/test'

//test.describe.configure({mode: 'parallel'}) // this will run all tests in this file in parallel, if you have a lot of tests and they are not dependent on each other, you can use this to speed up your test execution

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test.describe.parallel('Form layouts page @block', () => {
    //test.describe.configure({retries:2}) <- overwrite default retries for this describe block, if needed
    //test.describe.configure({mode: 'serial'}) <- execute test in this describe 1 by 1, but if 1st fails, second will not be executed, so use it only if you have dependent tests
    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })
    test('Input fields', async ({page}) => {
    // test.only('Input fields', async ({page}, testInfo) => {
        // if (testInfo.retry) { do smth } <- can be used i.e., to clean database before next retry
        const usingTheGridEmailInput = page
        .locator('nb-card', {hasText: "Using the Grid"})
        .getByRole('textbox', {name: "Email"})
            
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com') //simulates slow typing

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue() //.inputValue method will extract the value from locator and put into the variable
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test.only('Radio buttons', async({page}) => {
        const usingTheGridForm = page
        .locator('nb-card', {hasText: "Using the Grid"})

        //method .check() is used to select radio buttons. By providing {force:true} we disabling visually-hidden class
        //await usingTheGridForm.getByLabel('Option 1').check({force:true}) 
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
    
        //generic assertion
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot()
        //expect(radioStatus).toBeTruthy()

        //comment: locator assertion
        //await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()
    
        // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        // await expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // await expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})


test('checkboxes', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    //trying to check ALL checkboxes
    const allBoxes = page.getByRole('checkbox')

    //.all() creates array out of the list of this allBoxes element
    for(let box of await allBoxes.all()) {
        await box.uncheck({force: true})
        expect (await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdowns', async ({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has a LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
        
    await dropDownMenu.click()
    for(let color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate")
            await dropDownMenu.click()
    }
})

test('tooltips', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    //page.getByRole('tooltip') // if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()

    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //listener that listen for dialog event to click Accept, instead of default Cancel
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual("Are you sure you want to delete?")
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //get row by any text in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //get row based on the value in the specific column (example with ID)
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //test filter of the table
    const ages = ["20", "30", "40", "200"]

    for(let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            
            if(age == "200"){
                expect (await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    // let date = new Date()
    // date.setDate(date.getDate() + 1)
    // const expectedDate = date.getDate().toString()

    //variant #1
    // let date = new Date()
    // date.setDate(15)

    // const expectedDate = date.getDate().toString()
    // await page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()

    // let formatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
    // const expectedDayString = formatter.format(date)
    // await expect(calendarInputField).toHaveValue(expectedDayString)
    
    //variant #2
    let date2 = new Date()
    date2.setDate(date2.getDate() + 100)
    const expectedDate2 = date2.getDate().toString()
    const expectedMonthShort2 = date2.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date2.toLocaleString('En-US', {month: 'long'})
    
    
    const expectedYear2 = date2.getFullYear()
    const dateToAssert2 = `${expectedMonthShort2} ${expectedDate2}, ${expectedYear2}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear2}`
    while(!calendarMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('.day-cell.ng-star-inserted').getByText(expectedDate2, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert2)
}) 

test('slider', async({page}) => {
    //update slider's attribute with click
    /*const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })

    await tempGauge.click()*/

    //update slider's attribute with mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox() // get orientation of locator
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x,y)
    await page.mouse.down()
    await page.mouse.move(x+100, y)
    await page.mouse.move(x+100, y+100)
    // await page.mouse.move(box.x, y)
    // await page.mouse.move(box.x, box.y + box.height)
    // await page.mouse.move(x, box.y + box.height)
    await page.mouse.up()

    await expect(tempBox).toContainText('30')
})

