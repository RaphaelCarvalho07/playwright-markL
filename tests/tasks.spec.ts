import { test, expect } from '@playwright/test'

import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks/index'
import data from './fixtures/tasks.json'

test.describe('cadastro', () => {

    test('deve cadastrar uma nova tarefa', async ({ page, request }) => {

        const task = data.sucess as TaskModel

        await deleteTaskByHelper(request, task.name)

        const tasksPage = new TasksPage(page)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('não deve permitir cadastrar tarefa duplicada', async ({ page, request }) => {

        const task = data.duplicated as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        const tasksPage = new TasksPage(page)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('campo obrigatório', async ({ page }) => {

        const task = data.required as TaskModel

        const tasksPage = new TasksPage(page)

        await tasksPage.go()
        await tasksPage.create(task)

        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('atualização', () => {

    test('deve concluir uma tarefa', async ({ page, request }) => {

        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        const tasksPage = new TasksPage(page)

        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('exclusão', () => {
    
    test('deve excluir uma tarefa', async ({ page, request }) => {

        const task = data.delete as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        const tasksPage = new TasksPage(page)

        await tasksPage.go()
        await tasksPage.remove(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})

