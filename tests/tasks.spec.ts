import { test, expect } from '@playwright/test'

test('deve cadastrar uma nova tarefa', async ({ page, request }) => {

    const taskName = 'Ler um livro de Typescript'

    await(request.delete(`http://localhost:3333/helper/tasks/${taskName}`))

    await page.goto('http://localhost:8080')

    const InputTaskname = page.locator('input[class*="InputNewTask"]')
    await InputTaskname.fill(taskName)

    await page.click('css=button >> text=Create')
})