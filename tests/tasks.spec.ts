import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'

test('deve cadastrar uma nova tarefa', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Ler um livro de Typescript',
        is_done: false
    }
    // Dado que tenho uma nova tarefa
    await deleteTaskByHelper(request, task.name)

    // E que estou na página de cadastro
    await page.goto('http://localhost:8080')

    // Quando cadastro a nova tarefa
    const InputTaskname = page.locator('input[class*="InputNewTask"]')
    await InputTaskname.fill(task.name)

    await page.click('css=button >> text=Create')

    //Então essa tarea deve ser exibida na lista de tarefas
    const target = page.locator(`css=.task-item p >> text=${task.name}`)
    await expect(target).toBeVisible()
})

test('não deve permitir cadastrar tarefa duplicada', async ({ page, request }) => {

    const task: TaskModel = {
        name: 'Comprar Lego',
        is_done: false
    }
    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await page.goto('http://localhost:8080')
    const InputTaskName = page.locator('input[class*="InputNewTask"]')
    await InputTaskName.fill(task.name)
    await page.click('css=button >> text=Create')

    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')
})