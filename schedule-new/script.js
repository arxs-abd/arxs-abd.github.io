// Global variables to track current task/project
let currentTaskElement = null
let currentDeleteElement = null
let deleteType = ''

// Check if there are projects
function checkEmptyState() {
  const projectList = document.getElementById('projectList')
  const emptyState = document.getElementById('emptyState')
  const mainContent = document.getElementById('mainContent')

  if (projectList?.children.length === 0) {
    emptyState.style.display = 'flex'
    mainContent.style.display = 'none'
  } else {
    emptyState.style.display = 'none'
    mainContent.style.display = 'flex'
  }
}

// Add a new project
function addProject() {
  const projectName = document.getElementById('newProjectName').value.trim()
  if (projectName) {
    const projectList = document.getElementById('projectList')
    const projectId = Date.now() // Use timestamp as ID

    const projectDiv = document.createElement('div')
    projectDiv.className = 'project'
    projectDiv.setAttribute('data-project-id', projectId)
    projectDiv.onclick = function () {
      selectProject(this, projectName)
    }

    projectDiv.innerHTML = `
        <span class="project-name">${projectName}</span>
        <span class="delete-project" onclick="confirmDeleteProject(event, this)"><i class="fas fa-times"></i></span>
    `

    projectList.appendChild(projectDiv)
    document.getElementById('newProjectName').value = ''

    // Select the newly created project
    selectProject(projectDiv, projectName)
    hideModal('projectModal')

    // Update empty state
    checkEmptyState()
  }
}

// Select a project
function selectProject(projectElement, projectName) {
  // Remove active class from all projects
  const projects = document.querySelectorAll('.project')
  projects.forEach((p) => p.classList.remove('active'))

  // Add active class to selected project
  projectElement.classList.add('active')

  // Update current project name
  document.getElementById('currentProject').textContent = projectName
}

// Add a new task
function addTask() {
  const taskName = document.getElementById('newTaskName').value.trim()
  const taskDesc = document.getElementById('newTaskDesc').value.trim()

  if (taskName) {
    // Add to the "To Do" column
    const todoColumn = document.querySelector('.column:first-child')
    const taskCountElement = todoColumn.querySelector('.task-count')

    // Create new task element
    const taskDiv = document.createElement('div')
    taskDiv.className = 'task'
    taskDiv.onclick = function () {
      showTaskDetails(this)
    }

    // Set data attributes
    const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    taskDiv.setAttribute('data-task-name', taskName)
    taskDiv.setAttribute('data-task-desc', taskDesc)
    taskDiv.setAttribute('data-created-at', currentDate)
    taskDiv.setAttribute('data-in-progress-at', '')
    taskDiv.setAttribute('data-done-at', '')

    // Create task content
    taskDiv.innerHTML = `
        <div class="task-content">${taskName}</div>
        <span class="delete-task" onclick="confirmDeleteTask(event, this)"><i class="fas fa-times"></i></span>
    `

    // Insert before the count update
    todoColumn.appendChild(taskDiv)

    // Update task count
    const taskCount = todoColumn.querySelectorAll('.task').length
    taskCountElement.textContent = `(${taskCount})`

    // Reset form
    document.getElementById('newTaskName').value = ''
    document.getElementById('newTaskDesc').value = ''

    hideModal('taskModal')
  }
}

// Show task details
function showTaskDetails(taskElement) {
  // Save reference to current task
  currentTaskElement = taskElement

  // Get task details from data attributes
  const taskName = taskElement.getAttribute('data-task-name')
  const taskDesc = taskElement.getAttribute('data-task-desc')
  const createdAt = taskElement.getAttribute('data-created-at')
  const inProgressAt = taskElement.getAttribute('data-in-progress-at')
  const doneAt = taskElement.getAttribute('data-done-at')

  // Set values in the detail modal
  document.getElementById('task-detail-name').textContent = taskName
  document.getElementById('task-detail-desc').textContent = taskDesc
  document.getElementById('task-detail-created').textContent = createdAt

  // Handle optional fields
  if (inProgressAt) {
    document.getElementById('in-progress-container').style.display = 'flex'
    document.getElementById('task-detail-in-progress').textContent = inProgressAt
  } else {
    document.getElementById('in-progress-container').style.display = 'none'
  }

  if (doneAt) {
    document.getElementById('done-container').style.display = 'flex'
    document.getElementById('task-detail-done').textContent = doneAt
  } else {
    document.getElementById('done-container').style.display = 'none'
  }

  if (!taskDesc || taskDesc === '') {
    document.getElementById('description-container').style.display = 'none'
  } else {
    document.getElementById('description-container').style.display = 'flex'
  }

  // Show the modal
  showModal('taskDetailModal')
}

// Edit task
function editTask() {
  if (!currentTaskElement) return

  // Get current values
  const taskName = currentTaskElement.getAttribute('data-task-name')
  const taskDesc = currentTaskElement.getAttribute('data-task-desc')

  // Determine current status
  let status = 'todo'
  const parentColumn = currentTaskElement.closest('.column')
  const columnHeader = parentColumn.querySelector('h3').textContent.toLowerCase()

  if (columnHeader.includes('progress')) {
    status = 'inProgress'
  } else if (columnHeader.includes('done')) {
    status = 'done'
  }

  // Set values in edit form
  document.getElementById('editTaskName').value = taskName
  document.getElementById('editTaskDesc').value = taskDesc

  // Set status radio button
  document.querySelector(`input[name="taskStatus"][value="${status}"]`).checked = true

  // Hide task detail modal and show edit modal
  hideModal('taskDetailModal')
  showModal('editTaskModal')
}

// Save task edit
function saveTaskEdit() {
  if (!currentTaskElement) return

  const newTaskName = document.getElementById('editTaskName').value.trim()
  const newTaskDesc = document.getElementById('editTaskDesc').value.trim()
  const newStatus = document.querySelector('input[name="taskStatus"]:checked').value

  if (newTaskName) {
    // Update task content
    currentTaskElement.querySelector('.task-content').textContent = newTaskName

    // Update data attributes
    currentTaskElement.setAttribute('data-task-name', newTaskName)
    currentTaskElement.setAttribute('data-task-desc', newTaskDesc)

    // Get current date for status changes
    const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

    // Determine current status
    let oldStatus = 'todo'
    const parentColumn = currentTaskElement.closest('.column')
    const columnHeader = parentColumn.querySelector('h3').textContent.toLowerCase()

    if (columnHeader.includes('progress')) {
      oldStatus = 'inProgress'
    } else if (columnHeader.includes('done')) {
      oldStatus = 'done'
    }

    // Handle status change
    if (newStatus !== oldStatus) {
      // Update timestamps based on new status
      if (newStatus === 'inProgress' && !currentTaskElement.getAttribute('data-in-progress-at')) {
        currentTaskElement.setAttribute('data-in-progress-at', currentDate)
      } else if (newStatus === 'done' && !currentTaskElement.getAttribute('data-done-at')) {
        currentTaskElement.setAttribute('data-done-at', currentDate)
      }

      // Move task to new column
      const targetColumn = document.querySelector(`.column:nth-child(${newStatus === 'todo' ? 1 : newStatus === 'inProgress' ? 2 : 3})`)

      // Remove from old column
      parentColumn.removeChild(currentTaskElement)

      // Add to new column
      targetColumn.appendChild(currentTaskElement)

      // Update task counts
      updateTaskCounts()
    }

    hideModal('editTaskModal')
  }
}

// Update task counts for all columns
function updateTaskCounts() {
  const columns = document.querySelectorAll('.column')
  columns.forEach((column) => {
    const taskCount = column.querySelectorAll('.task').length
    column.querySelector('.task-count').textContent = `(${taskCount})`
  })
}

// Delete task - store reference
function confirmDeleteTask(event, element) {
  event.stopPropagation() // Prevent task click event
  currentDeleteElement = element.closest('.task')
  deleteType = 'task'

  // Set confirmation message
  document.getElementById('delete-confirm-title').textContent = 'Konfirmasi Hapus Task'
  document.getElementById('delete-confirm-message').textContent = `Apakah Anda yakin ingin menghapus task "${currentDeleteElement.getAttribute(
    'data-task-name'
  )}"?`

  showModal('deleteConfirmModal')
}

// Delete task from task detail
function deleteCurrentTask() {
  if (!currentTaskElement) return

  currentDeleteElement = currentTaskElement
  deleteType = 'task'

  // Set confirmation message
  document.getElementById('delete-confirm-title').textContent = 'Konfirmasi Hapus Task'
  document.getElementById('delete-confirm-message').textContent = `Apakah Anda yakin ingin menghapus task "${currentTaskElement.getAttribute(
    'data-task-name'
  )}"?`

  hideModal('taskDetailModal')
  showModal('deleteConfirmModal')
}

// Delete project
function confirmDeleteProject(event, element) {
  event.stopPropagation() // Prevent project selection
  currentDeleteElement = element.closest('.project')
  deleteType = 'project'

  // Set confirmation message
  document.getElementById('delete-confirm-title').textContent = 'Konfirmasi Hapus Proyek'
  document.getElementById('delete-confirm-message').textContent = `Apakah Anda yakin ingin menghapus proyek "${
    currentDeleteElement.querySelector('.project-name').textContent
  }"?`

  showModal('deleteConfirmModal')
}

// Confirm delete action
function confirmDelete() {
  if (!currentDeleteElement) return

  if (deleteType === 'task') {
    // Get parent column
    const parentColumn = currentDeleteElement.closest('.column')

    // Remove task element
    parentColumn.removeChild(currentDeleteElement)

    // Update task count
    const taskCount = parentColumn.querySelectorAll('.task').length
    parentColumn.querySelector('.task-count').textContent = `(${taskCount})`
  } else if (deleteType === 'project') {
    // Get project list
    const projectList = document.getElementById('projectList')

    // Remove project element
    projectList.removeChild(currentDeleteElement)

    // If deleted the active project, select the first available project
    if (currentDeleteElement.classList.contains('active')) {
      const firstProject = projectList.querySelector('.project')
      if (firstProject) {
        const projectName = firstProject.querySelector('.project-name').textContent
        selectProject(firstProject, projectName)
      }
    }

    // Check empty state
    checkEmptyState()
  }

  hideModal('deleteConfirmModal')
  currentDeleteElement = null
}

function showModal(modalId) {
  document.getElementById(modalId).style.display = 'flex'
}

function hideModal(modalId) {
  document.getElementById(modalId).style.display = 'none'
}

// Select first project on load
window.onload = function () {
  const firstProject = document.querySelector('.project')
  if (firstProject) {
    firstProject.classList.add('active')
  }

  // Check for empty state
  checkEmptyState()
}
