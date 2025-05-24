const containerTodos = document.querySelector('.task-container.todo');
const containerInProgress = document.querySelector('.task-container.in-progress');
const containerDone = document.querySelector('.task-container.done');
let tasks = []
let todoTasks = []
let inProgressTasks = []
let doneTasks = []

// Fungsi untuk mengatur drop area
function setupDropZone(container) {
  container.addEventListener('dragover', (e) => {
    e.preventDefault(); // Penting agar drop bisa dilakukan
    e.dataTransfer.dropEffect = 'move';
    container.classList.add('drag-over'); // Optional styling
  });

  container.addEventListener('dragleave', () => {
    container.classList.remove('drag-over');
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    container.classList.remove('drag-over');
    const type = container.dataset.title;

    const taskId = e.dataTransfer.getData('text/plain');
    const task = document.getElementById(taskId);
    if (task) {
      let oldType = null
      container.appendChild(task);
      tasks = tasks.map((t) => {
        if (t.id == taskId) {
          oldType = t.status;
          t.status = type;
        }
        return t;
      });
      balanceOrder(oldType, type);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
}

function initData() {
  const oldDatas = localStorage.getItem('tasks') || '[]';
  tasks = JSON.parse(oldDatas).sort((a, b) => a.order - b.order);

  const datas = [
    { id: 1, title: 'Task 1', status: 'todo', order: 1 },
    { id: 2, title: 'Task 2', status: 'todo', order: 2 },
    { id: 3, title: 'Task 3', status: 'todo', order: 3 },
    { id: 4, title: 'Task 4', status: 'todo', order: 4 },
    { id: 5, title: 'Task 5', status: 'todo', order: 5 },
    { id: 6, title: 'Task 6', status: 'todo', order: 6 },
    { id: 7, title: 'Task 7', status: 'todo', order: 7 },
    { id: 8, title: 'Task 8', status: 'todo', order: 8 },
    { id: 9, title: 'Task 9', status: 'todo', order: 9 },
    { id: 10, title: 'Task 10', status: 'todo', order: 10 },
  ]

  for (const data of tasks) {
    const task = document.createElement('div');
    task.classList.add('task');
    task.id = data.id;
    task.innerHTML = `<p>${data.title}</p>`;
    task.draggable = true;
    if (data.status === 'todo') {
      containerTodos.appendChild(task);
    } else if (data.status === 'in-progress') {
      containerInProgress.appendChild(task);
    } else if (data.status === 'done') {
      containerDone.appendChild(task);
    }
    setupTask(task)
  }
}

function balanceOrder(first, second) {
  // Balance First Container
  const firstDatas = document.querySelectorAll(`.task-container.${first} .task`);
  firstDatas.forEach((task, index) => {
    tasks = tasks.map((t) => {
      if (task.id == t.id) {
        t.order = index + 1;
      }
      return t
    })
  })

  // Balance Second Container if first !== second
  if (first !== second) {
    const secondDatas = document.querySelectorAll(`.task-container.${second} .task`);
    secondDatas.forEach((task, index) => {
      tasks = tasks.map((t) => {
        if (task.id == t.id) {
          t.order = index + 1;
        }
        return t
      })

    })
  }
}

function setupTask(task) {
  task.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    // Tambahkan class untuk styling saat drag (opsional)
    task.classList.add('dragging');
  });

  task.addEventListener('dragend', (e) => {
    task.classList.remove('dragging');
  });
}

setupDropZone(containerTodos);
setupDropZone(containerInProgress);
setupDropZone(containerDone);
initData();