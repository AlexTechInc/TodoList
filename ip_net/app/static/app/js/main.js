let dom_csrftoken = document.querySelector('[name=csrfmiddlewaretoken]');

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

$(".login-button").click(function(e) {
    e.preventDefault();

    let login = $("#floatingInput")[0].value, password = $("#floatingPassword")[0].value;
    
        $.ajax({
        type: "post",
        url: "/api/auth/login",
        data: {
            login: login,
            password: password
        },
        headers: {'X-CSRFToken': csrftoken},
        dataType: "json",
        success: function (response) {
            let json = response, 
                messagebox = $(".messagebox")[0];

            if (!json.status) {
                if ("message" in json) {
                    if (messagebox) {
                        messagebox.style = "display: block; color: var(--bs-danger);";
                        messagebox.innerHTML = json["message"];
                    } else {
                        alert(json["message"]);
                    }
                }
            } else {
                document.location.href = "/";
            }   
        }
    });
})

$(".register-button").click(function(e) {
    e.preventDefault();


    let login = $("#floatingInput")[0].value, 
        password = $("#floatingPassword")[0].value,
        password_repeat = $("#floatingPasswordRepeat")[0].value;

    console.log("register");
    
    $.ajax({
    type: "post",
    url: "/api/auth/register",
    data: {
        login: login,
        password: password,
        password_repeat: password_repeat
    },
    headers: {'X-CSRFToken': csrftoken},
    dataType: "json",
    success: function (response) {
        let json = response, 
            messagebox = $(".messagebox")[0];

        if (!json.status) {
            if ("message" in json) {
                if (messagebox) {
                    messagebox.style = "display: block; color: var(--bs-danger);";
                    messagebox.innerHTML = json["message"];
                } else {
                    alert(json["message"]);
                }
            }
        } else {
            if (messagebox) {
                messagebox.style = "display: block; color: var(--bs-success);";
                messagebox.innerHTML = "Successfully registered. <a href='/login'>Login now</a>";
            } else {
                alert("Successfully registered. Login now");
            }
        }
    }
});
})

$(".form-signin").click(function (e) { 
    let messagebox = $(".messagebox")[0];

    if (messagebox) {
        messagebox.style = "display: none;";
    }
})

$(".logout-button").click(function (e) {
    e.preventDefault();

    console.log();

    $.ajax({
        type: "post",
        url: "/api/auth/logout",
        headers: {'X-CSRFToken': csrftoken},
        success: function (response) {
            document.location.href = "/login"
        }
    });
})