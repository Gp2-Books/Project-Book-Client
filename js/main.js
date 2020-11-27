const SERVER = 'http://localhost:3000'

// function show login page
function beforeLogin() {
  $('#home-page').hide()
  $('#login-page').show()
  $('#register-page').hide()
}

// function show home page
function afterLogin () {
  $('#home-page').show()
  fetchTodos()
  $('#login-page').hide()
  $('#register-page').hide()
}

// function show register
function showRegister() {
  $('#register-page').show()  
  $('#login-page').hide()
  $('#home-page').hide()
}

// move show register page
$('#btn-register').on('click', ev => {
  ev.preventDefault()
  showRegister()
})

// move login page
$('#btn-login').on('click', ev => {
  ev.preventDefault()
  beforeLogin()
})

// function register
const register = () => {
  
  const email = $('#register-email').val()
  const password = $('#register-password').val()
  
  $.ajax({
    method: 'POST',
    url: `${SERVER}/register`,
    data: {
      email,
      password
    }
  })
  .done(response => {
    $('#login-page').show()
    $('#register-page').hide()
  })
  .fail(err => {
    console.log(err);
  })
}

// function login
const login = ev => {
  
  const email = $("#login-email").val()
  const password = $("#login-password").val()
  console.log(email, password)
  $.ajax({
    method: 'POST',
    url: `${SERVER}/login`,
    data: {
      email,
      password,
    },
  })
  .done(response => {
    const token = response.access_token
    localStorage.setItem('access_token', token)
    afterLogin()
    fetchTodos()
  })
  .fail(err =>   {  
    console.log(err);
  })
  .always( () => {
    $("#login-email").val("")
    $("#login-password").val("")
  })
}
//function google login
function onSignIn(googleUser) {
  let googleToken = googleUser.getAuthResponse().id_token;
  console.log(googleToken)
  $.ajax({
    url: `${SERVER}/googleLogin`,
    method: 'POST',
    data: {
      googleToken
    } 
  })
  .done(res => {
    console.log(`glogin succes`)
    localStorage.setItem('access_token', res.access_token)
    afterLogin()
    console.log(res)
  })
  .fail(err => {
    console.log(err)
  })
}

// function logout
function logout() {
  localStorage.removeItem('access_token')
  beforeLogin ()
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

// save access token in application
$(document).ready(function () {
  const token = localStorage.getItem('access_token')
  
  if (token) {
    afterLogin()
    fetchTodos()
  } else {
    beforeLogin()
  }
  $("#login-page").on("submit", (event) => {
    event.preventDefault()
    register()
  } )

  $("#register-page").on("submit", (event) => {
    event.preventDefault()
    register()
  } )
})


// find All Books
const fetchTodos = () => {
  const access_token = localStorage.getItem('access_token')
  
  $.ajax({
    method: 'GET',
    url: `${SERVER}/todos`,
    headers: {
      access_token: access_token
    }
  })
  .done(response => {
    const books = response.books
    books.forEach(item => {
      $('#todo-list').append(`
        <div class="card">
          <div class="card-left">
            <div class="card-info">
              <h5>${item.title}</h5>
              <i class="far fa-star"></i>
            </div>
            <p>${item.description}</p>
          </div>
          <div class="card-right">
            <p><span>status: </span>${item.status}</p>
            <p>${item.due_date}</p>
          </div>
        </div>
      `)
    })
  })
  .fail(err => {
  console.log("fetchTodos -> err", err)
    console.log(err);
  })
}
