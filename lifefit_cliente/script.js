const REDIRECT = '192.168.1.167:8000';
const mensaje = document.getElementById('error');
mensaje.style.display = 'none';
const ventana_borrosa = document.getElementById('ventana_borrosa');
const modal = document.getElementById('modal');
async function iniciarSesion(){
    const formulario = document.getElementById('formularioLogin');
    const formData = new FormData(formulario);
    const datosUsuario = Object.fromEntries(formData);

    if(datosUsuario.name == "" || datosUsuario.password == ""){
        mensaje.style.display = "block";
        mensaje.innerHTML = "Error: Please enter all information";
        return;
    }

    try {
        const respuesta = await fetch(`http://${REDIRECT}/api/iniciar_sesion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        });
        if (!respuesta.ok) {
            throw new Error('Network response was not ok');
            
        }
        const datos = await respuesta.json();
        if(datos.success){
        localStorage.setItem('userId', datos.user_id);
        window.location.href = 'home.html';
        }else{
            mensaje.innerHTML = "Error: User or password incorrect";
            mensaje.style.display = "block";
        }
    } catch (error) {
        console.error(error);

    }
}

document.getElementById("login").addEventListener("click", function (){
    iniciarSesion();
});

async function registrarUsuario(){
    const formulario = document.getElementById('formularioRegistro');
    const formData = new FormData(formulario);
    const datosUsuario = Object.fromEntries(formData);

    if(datosUsuario.name == "" || datosUsuario.password == ""){
        cerrarModal();
        mensaje.style.display = "block";
        mensaje.innerHTML = "Error: Please enter all information";
        return;
    }

    try {
        const respuesta = await fetch(`http://${REDIRECT}/api/crear_usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        });
        if (!respuesta.ok) {
            throw new Error('Network response was not ok');
            
        }
        const datos = await respuesta.json();
        if(datos.success){
        localStorage.setItem('userId', datos.user_id);
        window.location.href = 'home.html';
        }else{
            const mensajeError = document.createElement("p");
            mensajeError.classList.add("mensaje_error");
            mensajeError.textContent = 'Error: ' + datos.message;
            modal.appendChild(mensajeError);
        }
    } catch (error) {
        console.error(error);

    }
}
document.getElementById("crear_cuenta").addEventListener("click", function (){
    abrirModal();
});

document.getElementById("registrar").addEventListener("click", function (){
    registrarUsuario();
});

function abrirModal(){
    modal.style.display = "flex";
    ventana_borrosa.classList.add('ventana_borrosa');
    ventana_borrosa.style.display = "block";
    const login = document.getElementById("contLogin");
    login.style.filter = "blur(10px)";
    document.querySelector("body").appendChild(ventana_borrosa);

}



document.getElementById("ventana_borrosa").addEventListener("click", function (){
    cerrarModal();
});

function cerrarModal(){
    const login = document.getElementById("contLogin");
    login.style.filter = "blur(0px)";
    ventana_borrosa.style.display = "none";
    modal.style.display = "none";
}
