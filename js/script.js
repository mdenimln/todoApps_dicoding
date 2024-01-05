document.addEventListener('DOMContentLoaded', function () {

 
    const submitForm = document.getElementById('form');

    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
    });
  
    // fungsi membuat id unik
    function generateId() {
      return +new Date();
    }

    // funsgi membuat objek untuk menyimpan data yang nantinya akan di push atau di tampung di array todos
    function generateTodoObject(id, task, timeStamp, isCompleted) {
      return {
        id,
        task,
        timeStamp,
        isCompleted
      }
    }
    // array todos
    const todos = [];
    // const SAVED_EVENT = 'saved-todo';
    const STORAGE_KEY = 'TODO_APPS';
  
    function isStorageExist() {
      if(typeof(Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
      }
      return true;
  
    }
    // document.addEventListener(SAVED_EVENT, function() {
    //   console.log(localStorage.getItem(STORAGE_KEY))
    // })
    function saveData() {
      if(isStorageExist) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        // document.dispatchEvent(new Event(SAVED_EVENT));
      }
    }
    function loadDataFromStorage() {
      const dataTodoLocal = localStorage.getItem(STORAGE_KEY);
      let data = JSON.parse(dataTodoLocal);

      if(data !== null) {
        for(const todo of data){
          todos.push(todo);
        }
      }
      document.dispatchEvent(eCustomRender)
    }
    // nama custom event 
    const RENDER_EVENT = 'render-todo';
    // membuat custom event
    const eCustomRender = new Event(RENDER_EVENT);
    // fungsi untuk merender ulang fungsi ini akan terjadi ketika event render-event di bangkitkan
    document.addEventListener(RENDER_EVENT, function () {
      const uncompletedTODOList = document.getElementById('todos');
      // menghapus kembali todo agar tidak ada duplikat saat memproses kode for of
      uncompletedTODOList.innerHTML = '';

      const completedTODOList = document.getElementById('completed-todos');
      completedTODOList.innerHTML = '';
    
      for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (todoItem.isCompleted) {
          completedTODOList.append(todoElement)
        } else {
          uncompletedTODOList.append(todoElement);
        }
      }
    });

    // fungsi menambahkan list todo kedalam array todo
    function addTodo() {
      const textTodo = document.getElementById('title').value;
      const timeStamp = document.getElementById('date').value;

      const generatedID = generateId();
      const todoObject = generateTodoObject(generatedID, textTodo, timeStamp, false);

      todos.push(todoObject);

      // membangkitkan custom event
      document.dispatchEvent(eCustomRender);
      saveData();
    }

    // fungsi untuk membuat todo denagn mengambil dari argumen , dimana argumen nya berisi objek 
    function makeTodo(todoObject) {
      const texttitleTodo = document.createElement('h2');
      texttitleTodo.innerText = todoObject.task;

      const texttimeStamp = document.createElement('p');
      texttimeStamp.innerText = todoObject.timeStamp;

      const textContainer = document.createElement('div');
      textContainer.classList.add('inner')
      textContainer.append(texttitleTodo, texttimeStamp);

      const container = document.createElement('div');
      container.classList.add('item', 'shadow');
      container.setAttribute('id', `todo-${todoObject.id}`);
      container.append(textContainer);

      
      // menyeleksi elemen berdasarkan todoID
      function findTodo(todoId){
        for(const todoItem of todos){
          if(todoItem.id === todoId){
            return todoItem;
          }
        }
        return null;
      }
      // menyeleksi index berdasarkan todoID
      function findTodoIndex(todoId) {
        for(const index in todos) {
          if (todos[index].id === todoId) {
            return index;
          }
        }
      }

      // menambahkan todo ke iscompleted
      function addTaskToCompleted(todoId) {
        const todoTarget = findTodo(todoId);
        if (todoTarget == null) return;
        todoTarget.isCompleted = true;
        document.dispatchEvent(eCustomRender);
        saveData();
      }
      // menghapus todo
      function removeTaskFromCompleted(todoId) {
        const todoTarget = findTodoIndex(todoId);
        
        if(todoTarget === -1) return;

        todos.splice(todoTarget, 1);
        document.dispatchEvent(eCustomRender);
        saveData();
      }
      // mengembalikan todo ke !iscomplete
      function undoTaskFromCompleted(todoId) {
        const todoTarget = findTodo(todoId);
        if (todoTarget == null) return;

        todoTarget.isCompleted = false;
        document.dispatchEvent(eCustomRender);
        saveData();
      }

      if(todoObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', () => {
          undoTaskFromCompleted(todoObject.id)
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', () => {
          removeTaskFromCompleted(todoObject.id);
        })

        container.append(undoButton, trashButton);

      } else{

        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', () => {
          addTaskToCompleted(todoObject.id);
        })
        container.append(checkButton);
      }

      return container;
    }

    if(isStorageExist) {
      loadDataFromStorage()
    }
  
});