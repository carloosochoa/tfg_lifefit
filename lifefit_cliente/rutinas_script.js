let numeroRutinas;
const modal = document.getElementById('modal');
const ventana_borrosa = document.getElementById('ventana_borrosa');
modal.style.display = "none";
const main = document.getElementById("main");
const contenedorRutinas = document.getElementById('contenedor_rutinas');
const capitalizarInicial = (nombre) =>{
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}
document.addEventListener("DOMContentLoaded", async function () {

    const url = `http://192.168.0.23:8000/api/contar_rutinas/1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'User-agent': 'learning app',
        },

    };
    try {
        const response = await fetch(url, options);
        numeroRutinas = await response.json();
        if (numeroRutinas){
            await obtenerRutinas();
            const contenedorBoton = document.getElementById('contenedor_boton');
            const mensaje = document.createElement('p');
            mensaje.classList.add('mensaje_rutinas');
            mensaje.innerHTML = "Your Routines <span class='material-symbols-outlined'>fitness_center</span>";
        
            contenedorBoton.appendChild(mensaje);
        }
        else{
            sinRutinas();
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
});
function sinRutinas(){

    const parrafo = document.createElement("p");
    parrafo.innerHTML = "You do not have any routines created <span class='material-symbols-outlined'>sentiment_dissatisfied</span> <span class='material-symbols-outlined'>fitness_center</span>";
    parrafo.classList.add("sinRutinas");
    main.appendChild(parrafo);
}

async function obtenerRutinas(){
    let id = 1;
    const url = `http://192.168.0.23:8000/api/mostrar_rutinas/1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'User-agent': 'learning app',
        },

    };
    try {
        const response = await fetch(url, options);
        respuesta = await response.json();

        console.log(respuesta);
        mostrarRutinas(respuesta.datos);

    } catch (error) {
        console.error(error);
        throw error;
    }
}



document.getElementById('abrir_modal').addEventListener("click", function () {
    const contenedorEjercicios = document.getElementById('inputsEjercicios');
    contenedorEjercicios.innerHTML = '';

    modal.style.display = "block";

    ventana_borrosa.style.display = "block";
    const cuerpo = document.getElementById('cuerpo');
    cuerpo.style.filter = "blur(2px)";
});

function agregarEjercicio() {
    const contenedor = document.getElementById('inputsEjercicios');
    let input_name = document.createElement("input");
    input_name.type = "text";
    input_name.className = "form-control";
    input_name.placeholder = "Exercise...";
    input_name.name = "ejercicio[]";

    let input_series = document.createElement("input");
    input_series.type = "number";
    input_series.className = "form-control";
    input_series.placeholder = "Series...";
    input_series.name = "serie[]";

    let input_repeticiones = document.createElement("input");
    input_repeticiones.type = "number";
    input_repeticiones.className = "form-control";
    input_repeticiones.placeholder = "Repetitions...";
    input_repeticiones.name = "repeticion[]";
    contenedor.append(input_name, input_series, input_repeticiones);
}
document.getElementById('agregarEjercicio').addEventListener('click', agregarEjercicio);

document.getElementById('crear_rutina').addEventListener("click", async function (e) {
    e.preventDefault();
    await crearRutinas();
});

async function crearRutinas() {

    const user_id = document.getElementById('user_id').value;
    const name = document.getElementById('name').value;

    const ejerciciosNombre = document.querySelectorAll('input[name="ejercicio[]"]');
    const ejerciciosSeries = document.querySelectorAll('input[name="serie[]"]');
    const ejerciciosRepeticiones = document.querySelectorAll('input[name="repeticion[]"]');

    const nombres = Array.from(ejerciciosNombre).map(input => input.value);
    const series = Array.from(ejerciciosSeries).map(input => input.value);
    const repeticiones = Array.from(ejerciciosRepeticiones).map(input => input.value);

    const datosRutina = {
        user_id: user_id,
        name: name,
        exerciseName: nombres,
        exerciseSets : series,
        exerciseReps: repeticiones
    };

    console.log(datosRutina);

    try {
        const respuesta = await fetch('http://192.168.0.23:8000/api/crear_rutinas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosRutina)
        });
        if (!respuesta.ok) {
            throw new Error('Network response was not ok');

        }
        const datos = await respuesta.json();
        cerrarModal();
        contenedorRutinas.innerHTML = "";
        obtenerRutinas();
        console.log('Routine created succesful');
        console.log(datos);

    } catch (error) {
        console.error(error);
    }
}
function mostrarRutinas(rutinas){
    console.log(rutinas);



    for (const [rutinaNombre, ejercicios] of Object.entries(rutinas)){
        console.log(rutinaNombre);
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        const titulo = document.createElement('p');
        titulo.innerHTML = capitalizarInicial(rutinaNombre);
        titulo.classList.add('nombreRutina');

        const abrir_rutina = document.createElement('a');
        abrir_rutina.innerHTML = "Show routine";
        abrir_rutina.id = 'abrir_rutina';
        abrir_rutina.className = 'btn btn-primary';

        tarjeta.append(titulo, abrir_rutina);
        contenedorRutinas.appendChild(tarjeta);
        console.log(ejercicios);
        abrir_rutina.addEventListener('click', function(){
            abrirRutina(ejercicios);
        });
    }
    main.appendChild(contenedorRutinas);
}

function abrirRutina(ejercicios){
    const datos = JSON.stringify(ejercicios);
    window.location.href = 'ejercicios.html?datos=' + encodeURIComponent(datos);
}
function cerrarModal(){
    const cuerpo = document.getElementById('cuerpo');
    cuerpo.style.filter = "blur(0px)";
    ventana_borrosa.style.display = "none";
    modal.style.display = "none";
}
ventana_borrosa.addEventListener("click",cerrarModal);

// TODO pagina musculos y añadir columna imagen a musculos
// Realizar funcion abrir rutina
// iniciar sesion usuario
// Buscador ejercicios cuando creas una rutina
