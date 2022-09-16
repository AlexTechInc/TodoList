
// const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

function subtask_html(subtasks) {
    let subtask_html = '';

    subtasks.forEach(element => {
        subtask_html += `<li>${element.text}</li>`
    });

    return subtask_html;
}

function todo_item(text, subtask, color, todo_id) {
    let todo_html = `
        <div class="card" style="background-color: ${color}; margin-top: 5px; text-shadow: 0px 0px 40px white;" id="todo_${todo_id}">
            <div class="card-body">
                <div class="card-title" style="white-space: nowrap;">
                    <i class="bi bi-plus-circle" style="display: inline-block; font-size: 1.2rem;"></i>
                    <h5 style="display: inline-block;"><strong>${text}</strong></h5>
                </div>
                <div class="card-text">
                    <ul>
                        ${subtask}                                                        
                    </ul>

                    <div style="position: absolute; right: 20px; top: 20px;">
                        <i class="bi bi-x-circle" style="display: inline-block; font-size: 1.5rem;"></i>
                    </div>

                    <div class="subtask-add" style="white-space: nowrap; line-height: normal; display: none;">
                        <input type="text" style="display: inline-block;">
                        <input type="button" class="btn btn-success" value="Save">
                        <input type="button" class="btn btn-danger" value="Cancel">
                        <strong class="text-danger"></strong>
                    </div>
                </div>
            </div>
        </div>
        `

    return todo_html;
}

function insert_todo(text, subtask, color, todo_id, pos="beforeend") {
    let container = $("#todo_main_container")[0];

    if (!container) return;

    container.insertAdjacentHTML(pos, todo_item(text, subtask_html(subtask), color, todo_id.toString()));

    $(`#todo_${todo_id} .bi-plus-circle`).click(function (e) {
        $(`#todo_${todo_id} .subtask-add`)[0].style = "display: block";

    });

    $(`#todo_${todo_id} .bi-plus-circle`).click(function (e) {
        $(`#todo_${todo_id} .subtask-add`)[0].style = "display: block";

    });

    $(`#todo_${todo_id} .bi-x-circle`).click(function (e) {
        if (confirm(`Are you sure to remove todo '${text}'`)) {
            $.ajax({
                type: "post",
                url: "/api/manager/remove/",
                data: {
                    todo_id: todo_id
                },
                dataType: "json",
                headers: {'X-CSRFToken': csrftoken},
                success: function (response) {
                    if ("status" in response) {
                        if (response.status) {
                            $(`#todo_${todo_id}`).remove();
                        }
                    }
                }
            });
        }            

    });

    $(`#todo_${todo_id} .btn-danger`).click(function (e) {
        e.preventDefault();

        $(`#todo_${todo_id} .subtask-add`)[0].style = "display: none";
        $(`#todo_${todo_id} .subtask-add strong`)[0].innerHTML = "";
    });

    $(`#todo_${todo_id} .btn-success`).click(function (e) {
        e.preventDefault();

        let text = $(`#todo_${todo_id} .subtask-add input[type='text']`)[0].value
        
        $(`#todo_${todo_id} .subtask-add strong`)[0].innerHTML = "";
        $(`#todo_${todo_id} .subtask-add input[type='text']`)[0].value = ""

        $.ajax({
            type: "post",
            url: "/api/manager/add_subtask/",
            headers: {'X-CSRFToken': csrftoken},
            data: {
                todo_id: todo_id,
                text: text
            },

            dataType: "json",
            success: function (response) {
                if ("status" in response) {
                    if (response.status) {
                        if ("subtask_id" in response) {
                            $(`#todo_${todo_id} .card-text ul`)[0].insertAdjacentHTML("beforeend", `<li>${text}</li>`)
                        }
                    } else {
                        let message = "An error occured on server-side";
                        if ("message" in response) {
                            message = response.message;
                        }
                        
                        $(`#todo_${todo_id} .subtask-add strong`)[0].innerHTML = message;
                        
                        return;
                    }
                }

                $(`#todo_${todo_id} .subtask-add`)[0].style = "display: none";
                }

        });

    });

    $(document).click(function () {
        let error = $(`#todo_${todo_id} .subtask-add strong`)[0];
        if (error) {
            error.innerHTML = "";
        }
    });
}


$(document).ready(function () {
    let container = $("#todo_main_container")[0];
    $("#new_color")[0].value = "#ffffff";

    container.style += `min-height: 50px; max-height: ${window.innerHeight - 250}px; overflow-y: scroll;`

    if (!container) return;

    $.ajax({
        type: "post",
        url: "/api/manager/list/",
        dataType: "json",
        headers: {'X-CSRFToken': csrftoken},
        success: function (response) {
            if ("status" in response) {
                if (response.status) {
                    if ("list" in response) {
                        let list = response.list;

                        list.forEach((element) => {
                            insert_todo(element.text, element.sub, element.color, element.todo_id);
                        });
                    }
                }

            }
        }
    });

    $("#new_button").click(function(e) {

        e.preventDefault();

        $("#new_error")[0].innerHTML = ""

        let text = $("#new_name")[0].value, 
            color = $("#new_color")[0].value;

        $.ajax({
            type: "post",
            url: "/api/manager/add_todo/",
            data: {
                text: text,
                color: color 
            },
            dataType: "json",
            headers: {'X-CSRFToken': csrftoken},
            success: function (response) {
                if ("status" in response) {
                    if (response.status) {
                        if ("todo_id" in response) {
                            insert_todo(text, [], color, response.todo_id, "afterbegin");

                            return;
                        }
                    } else {
                        if ("message" in response) {
                            $("#new_error")[0].innerHTML = response.message;
                            return;
                        }
                    }

                    $("#new_error")[0].innerHTML = "Error on server-side."
                }
            }
        });
    })


});

$(document).click(function () {
    $("#new_error")[0].innerHTML = "";
});