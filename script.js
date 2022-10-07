const apikey = 'dedccc12-53c4-4d3e-b91e-13ca9dcf0224';
const apihost = 'https://todo-api.coderslab.pl';

//łączenie z listą
function apiListTasks() {
    fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey}
        }
    ).then(resp => {
        return resp.json();
    }).then(data => {
        renderTask(data.data);
    });
}

const body = document.querySelector('#app');
apiListTasks();

function renderTask(tasks) {
    tasks.forEach(function (task) {
        const taskId = task.id;
        const title = task.title;
        const description = task.description;
        const status = task.status;
        const newSection = document.createElement('section');
        newSection.className = 'card mt-5 shadow-sm';
        body.appendChild(newSection);
        const newDiv = document.createElement('div');
        newDiv.className = 'card-header d-flex justify-content-between align-items-center';
        newSection.appendChild(newDiv);
        const div2 = document.createElement('div');
        newDiv.appendChild(div2);
        const newh5 = document.createElement('h5');
        newh5.innerText = title;
        div2.appendChild(newh5);
        const h6 = document.createElement('h6');
        h6.className = 'card-subtitle text-muted';
        h6.innerText = description;
        div2.appendChild(h6);
        const divToButtons = document.createElement('div');
        newDiv.appendChild(divToButtons);
        if (status == 'open') {
            const finishButton = document.createElement('button');
            finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
            finishButton.innerText = 'Finish';
            divToButtons.appendChild(finishButton);
        }
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
        deleteButton.innerText = 'Delete';
        divToButtons.appendChild(deleteButton);
        deleteButton.addEventListener('click', function() {
            apiDeleteTask(taskId).then(
                newSection.remove()
            )
        });
        const ul = document.createElement('ul');
        ul.className = 'list-group list-group-flush';
        newSection.appendChild(ul);
        apiListOperationsForTask(taskId).then(function(resp) {
            resp.data.forEach(function (operation) {
                renderOperation(ul, operation.id, status, operation.description, operation.timeSpent);
            })
        })
        if (status == 'open') {
            const addOperationForm = document.createElement('div');
            addOperationForm.className = 'card-body';
            addOperationForm.innerHTML = '<form>\n' +
                '<div class="input-group">\n' +
                '<input type="text" placeholder="Operation description" class="form-control" minlength="5">\n' +
                '<div class="input-group-append">\n' +
                '<button class="btn btn-info">Add</button>\n' +
                '</div></div></form>';
            newSection.appendChild(addOperationForm);
        }
        // const formAddOperation = document.querySelector('.btn-info form');
        // console.log(formAddOperation);
        // formAddOperation.addEventListener('submit', function () {
        //     apiCreateOperationForTask().then (
        //         renderOperation(ul, operation.id, status, operation.description, operation.timeSpent)
        //     )}
        // )
    })
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function renderOperation(operationsList, operationId, status, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center'
    operationsList.appendChild(li);
    const divInUl = document.createElement('div');
    divInUl.innerText = operationDescription;
    li.appendChild(divInUl);
    const spanTime = document.createElement('span');
    spanTime.className = 'badge badge-success badge-pill ml-2';
    const formattedTime = formatTime(timeSpent);
    spanTime.innerText = formattedTime;
    divInUl.appendChild(spanTime);
    const divForButttons = document.createElement('div');
    li.appendChild(divForButttons);
    if (status == 'open') {
        const add15Button = document.createElement('button');
        add15Button.className = 'btn btn-outline-success btn-sm mr-2';
        add15Button.innerText = '+15m';
        divForButttons.appendChild(add15Button);

        const add1hButton = document.createElement('button');
        add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
        add1hButton.innerText = '+1h';
        divForButttons.appendChild(add1hButton);
    }
    const deleteButtonOperation = document.createElement('button');
    deleteButtonOperation.className = 'btn btn-outline-danger btn-sm';
    deleteButtonOperation.innerText = 'Delete';
    divForButttons.appendChild(deleteButtonOperation);
}
function formatTime(timeSpent) {
    if (timeSpent > 59) {
        let hours = timeSpent/60;
        let minutes = timeSpent % 60;
        return hours + 'h' + minutes + 'm';
    }
    return timeSpent + 'm';
}

//pobieranie danych New Task

const form = document.querySelector('form');

form.addEventListener('submit', handleSubmit);
function handleSubmit(e) {
    e.preventDefault();
    const titleIn = document.querySelector('#titleTask');
    const descriptionIn = document.querySelector('#description')
    const title = titleIn.value;
    const description = descriptionIn.value;
    console.log(title);
    console.log(description);
apiCreateTask(title, description).then(
     function(response) {
         console.log('Odpowiedź z serwera to:', response);
     }
 ).then (
renderTask(response);
)}
function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description, status: 'open' }),
            method: 'POST'
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({description: description, timeSpent: 0 }),
            method: 'POST'
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}


