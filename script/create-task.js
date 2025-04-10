const inputField = document.querySelector('.todo-list__task-input');
const addButton = document.querySelector('.todo-list__add-task-button');

const removeEventListeners = (taskItem) => {
  const deleteButton = taskItem.querySelector('.todo-list__task-button--delete');
  const inputComplete = taskItem.querySelector('input[type="checkbox"]');

  if (deleteButton) {
    deleteButton.removeEventListener('click', deleteButtonClickHandler);
  }

  if (inputComplete) {
    inputComplete.removeEventListener('change', checkboxChangeHandler);
  }
};

const deleteButtonClickHandler = (event) => {
  const taskItem = event.target.closest('.todo-list__task-item');
  removeEventListeners(taskItem);
  taskItem.remove();
  updateStatistics();
};

const checkboxChangeHandler = (event) => {
  const taskItem = event.target.closest('.todo-list__task-item');
  const taskTextElement = taskItem.querySelector('span');

  if (event.target.checked) {
    taskTextElement.classList.add('todo-list__task-item--completed');
  } else {
    taskTextElement.classList.remove('todo-list__task-item--completed');
  }

  updateStatistics();
};

const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const taskItem = createTask(task.text, task.completed);
    document.querySelector('.todo-list__task-list').appendChild(taskItem);
  });
  updateStatistics();
};

const saveTasks = () => {
  const taskItems = document.querySelectorAll('.todo-list__task-item');
  const tasks = Array.from(taskItems).map(taskItem => {
    const taskTextElement = taskItem.querySelector('span');
    const inputComplete = taskItem.querySelector('input[type="checkbox"]');
    return {
      text: taskTextElement.textContent,
      completed: inputComplete.checked
    };
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const updateStatistics = () => {
  const taskItems = document.querySelectorAll('.todo-list__task-item');
  const completedTasks = document.querySelectorAll('.todo-list__task-item--completed');

  const remainingCount = document.querySelector('.todo-list__remaining-count');
  const completedCount = document.querySelector('.todo-list__completed-count');

  remainingCount.textContent = taskItems.length - completedTasks.length;
  completedCount.textContent = completedTasks.length;

  saveTasks();
};

const createCheckbox = (taskItem, taskTextElement, isChecked) => {
  const inputComplete = document.createElement('input');
  inputComplete.type = 'checkbox';
  taskItem.appendChild(inputComplete);
  inputComplete.classList.add('todo-list__task-input--complete');

  if (isChecked) {
    inputComplete.checked = true;
    taskTextElement.classList.add('todo-list__task-item--completed');
  }

  inputComplete.addEventListener('change', checkboxChangeHandler);
};

const createDeleteButton = (taskItem) => {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Удалить';
  deleteButton.classList.add('todo-list__task-button--delete');
  taskItem.appendChild(deleteButton);

  deleteButton.addEventListener('click', deleteButtonClickHandler);
};

const createTask = (taskText, isChecked = false) => {
  const taskItem = document.createElement('li');
  taskItem.classList.add('todo-list__task-item');

  const taskTextElement = document.createElement('span');
  taskTextElement.textContent = taskText;
  taskItem.appendChild(taskTextElement);

  createCheckbox(taskItem, taskTextElement, isChecked);
  createDeleteButton(taskItem);

  return taskItem;
};

const taskAdd = () => {
  const taskText = inputField.value.trim();
  if (taskText !== '') {
    const taskItem = createTask(taskText);
    document.querySelector('.todo-list__task-list').appendChild(taskItem);
    inputField.value = '';
    updateStatistics();
  }
};

addButton.addEventListener('click', taskAdd);

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    taskAdd();
  }
});

window.addEventListener('load', loadTasks);

export { taskAdd };
