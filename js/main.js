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
  fetchBook()
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
const fetchBook = () => {
  const access_token = localStorage.getItem('access_token')
  $("#book-list").empty()
  
  $.ajax({
    method: 'GET',
    url: `${SERVER}/book`,
    headers: {
      access_token: access_token
    }
  })
  .done(response => {
    const books = response
    console.log(books )
      $('#book-list').append(`
      <div class="frame-book">
        <div class="cover-book">
            <img src="${books.image}" style="width: auto; height: 225px;" alt="">
        </div>
        <div class="details-book">
            <div class="title-book">
                <p>Title Book</p>
                <p>${books.title}</p>
            </div>
            <div class="author-book">
                <p>Author book</p>
                <p>${books.authors}</p>
            </div>
            <div class="isbn-book">
                <p>ISBN</p>
                <p>${books.isbn}</p>
            </div>
            <div class="desc-book">
                <p>Description</p>
                <p>${books.desc}</p>
            </div>
            <div class="rating-book">
            <p>Rating</p>
            <p>${books.rating}</p>
        </div>
        </div>
     </div>
      `)
  })
  .fail(err => {
  console.log("fetchTodos -> err", err)
    console.log(err);
  })
}
