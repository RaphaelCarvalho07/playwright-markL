import { test, expect } from '@playwright/test'
import exp from 'constants'

test('deve cadastrar uma nova tarefa', async ({ page, request }) => {

    // Dado que tenho uma nova tarefa
    const taskName = 'Ler um livro de Typescript'
    await (request.delete(`http://localhost:3333/helper/tasks/${taskName}`))

    // E que estou na página de cadastro
    await page.goto('http://localhost:8080')

    // Quando cadastro a nova tarefa
    const InputTaskname = page.locator('input[class*="InputNewTask"]')
    await InputTaskname.fill(taskName)

    await page.click('css=button >> text=Create')

    //Então essa tarea deve ser exibida na lista de tarefas
    const target = page.locator(`css=.task-item p >> text=${taskName}`)
    await expect(target).toBeVisible()
})

test.only('não deve permitir cadastrar tarefa duplicada', async ({ page, request }) => {

    const task = {
        name: 'Comprar Lego',
        is_done: false
    }
    await (request.delete(`http://localhost:3333/helper/tasks/${task.name}`))
    const newTask =await request.post('http://localhost:3333/tasks', { data: task })
    expect(newTask.ok()).toBeTruthy()

    await page.goto('http://localhost:8080')
    const InputTaskName = page.locator('input[class*="InputNewTask"]')
    await InputTaskName.fill(task.name)
    await page.click('css=button >> text=Create')

    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')
})