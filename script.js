document.addEventListener('DOMContentLoaded', function () {
    const todoList = document.querySelector('.todo-list');
    const input = document.querySelector('.input input[type="text"]');
    const itemsLeft = document.querySelector('footer span');
    const filterButtons = document.querySelectorAll('.bottom-info a');
    const clearCompleted = document.querySelector('.bottom-comment');
    const themeToggle = document.querySelector('.theme-toggle');

    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.src = isDarkMode ? 'images/icon-sun.svg' : 'images/icon-moon.svg';
    }

    if (isDarkMode) {
        document.body.classList.add('dark');
        themeToggle.src = 'images/icon-sun.svg';
    }

    themeToggle.addEventListener('click', toggleTheme);

    function updateItemsCount() {
        const activeItems = document.querySelectorAll('.todo-list li:not(.completed)').length;
        itemsLeft.textContent = `${activeItems} items left`;
    }

    function createNewTodoItem(text) {
        const li = document.createElement('li');
        li.innerHTML = `
      <input type="checkbox">
      <span>${text}</span>
      <button class="delete-button"></button>
    `;

        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', function () {
            li.classList.toggle('completed');
            updateItemsCount();
        });

        const deleteButton = li.querySelector('.delete-button');
        deleteButton.addEventListener('click', function () {
            li.remove();
            updateItemsCount();
        });

        li.setAttribute('draggable', true);
        setupDragAndDrop(li);

        return li;
    }

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && input.value.trim()) {
            const newTodo = createNewTodoItem(input.value.trim());
            todoList.appendChild(newTodo);
            input.value = '';
            updateItemsCount();
        }
    });

    document.querySelectorAll('.todo-list li').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function () {
            item.classList.toggle('completed');
            updateItemsCount();
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            item.remove();
            updateItemsCount();
        });
        item.appendChild(deleteButton);

        item.setAttribute('draggable', true);
        setupDragAndDrop(item);
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.textContent.toLowerCase();
            document.querySelectorAll('.todo-list li').forEach(item => {
                if (filter === 'all') {
                    item.style.display = '';
                } else if (filter === 'active') {
                    item.style.display = item.classList.contains('completed') ? 'none' : '';
                } else if (filter === 'completed') {
                    item.style.display = item.classList.contains('completed') ? '' : 'none';
                }
            });
        });
    });

    clearCompleted.addEventListener('click', function () {
        document.querySelectorAll('.todo-list li.completed').forEach(item => {
            item.remove();
        });
        updateItemsCount();
    });

    updateItemsCount();

    function setupDragAndDrop(item) {
        item.addEventListener('dragstart', function () {
            this.classList.add('dragging');
        });

        item.addEventListener('dragend', function () {
            this.classList.remove('dragging');
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault();
            const draggingItem = document.querySelector('.dragging');
            const siblings = [...todoList.querySelectorAll('li:not(.dragging)')];
            const nextSibling = siblings.find(sibling => {
                const rect = sibling.getBoundingClientRect();
                return e.clientY <= rect.top + rect.height / 2;
            });

            if (nextSibling) {
                todoList.insertBefore(draggingItem, nextSibling);
            } else {
                todoList.appendChild(draggingItem);
            }
        });
    }

    document.querySelectorAll('.todo-list li').forEach(item => {
        item.setAttribute('draggable', true);
        setupDragAndDrop(item);
    });
});

    