userpass = document.getElementById("password")
useremail = document.getElementById("email")
buttonpass = document.getElementById("dang-nhap")

function an_hienpassbutton() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

buttonpass.addEventListener('submit', function(event) {
    event.preventDefault();
    const lay_gia_tri_pass = userpass.value;
    const lay_gia_tri_user = useremail.value;
    console.log(lay_gia_tri_pass, lay_gia_tri_user)
    fetch("localhost:5000/input-pass",{
        methods: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            email: lay_gia_tri_user,
            password: lay_gia_tri_pass
        }
        )
    }
    .then(response => {
        return response.json().then(data => {
            if(!response.ok){
                throw data
            }
            return data;
        })
    
    })
    )
})

