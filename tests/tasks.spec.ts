import { test } from '@playwright/test'

import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks/index'

test('deve cadastrar uma nova tarefa', async ({ page, request }) => {

    const task: TaskModel = {
        name: 'Ler um livro de Typescript',
        is_done: false
    }
    await deleteTaskByHelper(request, task.name)

    const tasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)
})

test('não deve permitir cadastrar tarefa duplicada', async ({ page, request }) => {

    const task: TaskModel = {
        name: 'Comprar Lego',
        is_done: false
    }
    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    const tasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')
})