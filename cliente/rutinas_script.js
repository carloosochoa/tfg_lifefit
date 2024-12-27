let numeroRutinas;
let musculos;
const REDIRECT = '192.168.1.167:8000';
let contador_ejercicios = 1;
const modal = document.getElementById('modal');
const ventana_borrosa = document.getElementById('ventana_borrosa');
modal.style.display = "none";
const main = document.getElementById("main");
const contenedorRutinas = document.getElementById('contenedor_rutinas');
const id = localStorage.getItem('userId');
const parrafo = document.getElementById("parrafo_sinRutinas");
const capitalizarInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}
document.addEventListener("DOMContentLoaded", async function () {
    console.log(id);
    const url = `http://${REDIRECT}/api/contar_rutinas/${id}`;
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
        musculos = await nombreMusculos();
        if (numeroRutinas) {
            await obtenerRutinas();
            const contenedorBoton = document.getElementById('contenedor_boton');
            const mensaje = document.createElement('p');
            mensaje.classList.add('mensaje_rutinas');
            mensaje.innerHTML = "Your Routines <span class='material-symbols-outlined'>fitness_center</span>";

            contenedorBoton.appendChild(mensaje);
        }
        else {

            sinRutinas();

        }

    } catch (error) {
        console.error(error);
        throw error;
    }
});

document.getElementById("close_session").addEventListener("click", function () {
    localStorage.removeItem("userId");
    window.location.href = "index.html";
});
function sinRutinas() {
    parrafo.style.display = "block";
    main.appendChild(parrafo);
}

async function obtenerRutinas() {
    const url = `http://${REDIRECT}/api/mostrar_rutinas/${id}`;
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
        console.log(respuesta.datos);

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

async function nombreMusculos() {
    const url = `http://${REDIRECT}/api/nombre_musculos`;
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

        return respuesta;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function nombreEjercicios() {
    const url = `http://${REDIRECT}/api/nombre_ejercicios`;
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

        return respuesta;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function selectEjercicios(musculoId) {
    const url = `http://${REDIRECT}/api/filtro_ejercicios_musculos/${musculoId}`;
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
        return respuesta;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

function crearSelect(ejercicios) {
    let select_name_exercise = document.createElement("select");
    select_name_exercise.name = "ejercicio[]";
    select_name_exercise.className = "form-control mb-3";
    select_name_exercise.id = "selectEjercicios";
    ejercicios.forEach(ejercicio => {
        let opcion = document.createElement("option");
        opcion.value = ejercicio.id;
        opcion.innerHTML = capitalizarInicial(ejercicio.name);
        select_name_exercise.appendChild(opcion);
    });
    document.getElementById('inputsEjercicios').appendChild(select_name_exercise);
}


async function agregarEjercicio() {
    contador_ejercicios += 1;
    const contenedor = document.getElementById('inputsEjercicios');

    let select_name_muscle = document.createElement("select");
    select_name_muscle.className = "form-control mb-3";

    let opcion1 = document.createElement("option");
    opcion1.value = "0";
    opcion1.text = "Select Muscle...";
    select_name_muscle.appendChild(opcion1);

    musculos.forEach(musculo => {
        let opcion = document.createElement("option");
        opcion.value = musculo.id;
        opcion.text = capitalizarInicial(musculo.name);
        select_name_muscle.appendChild(opcion);
    });

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
    input_repeticiones.id = "inputRepeticiones";


    contenedor.append(select_name_muscle);

    select_name_muscle.addEventListener('change', async function (e) {
        if (e.target === select_name_muscle && select_name_muscle.value !== "0") {
            const ejercicios = await selectEjercicios(select_name_muscle.value);
            crearSelect(ejercicios);
            contenedor.append(input_series, input_repeticiones);
        }
           
    });

}


document.getElementById('agregarEjercicio').addEventListener('click', agregarEjercicio);
document.getElementById('abrir_modal').addEventListener('click', agregarEjercicio);


document.getElementById('crear_rutina').addEventListener("click", async function (e) {
    e.preventDefault();
    await crearRutinas();
});

async function crearRutinas() {
    let name = document.getElementById('nombreEjercicios').value;

    let ejerciciosNombre = document.querySelectorAll('select[name="ejercicio[]"]');
    let ejerciciosSeries = document.querySelectorAll('input[name="serie[]"]');
    let ejerciciosRepeticiones = document.querySelectorAll('input[name="repeticion[]"]');
    console.log(name, ejerciciosSeries, ejerciciosRepeticiones);

    if (name.length == 0) {
        mensajeError = "Error: Please enter all information";
        alert(mensajeError + "hdh");
        return;
    }

    const nombres = Array.from(ejerciciosNombre).map(input => input.value);
    const series = Array.from(ejerciciosSeries).map(input => input.value);
    const repeticiones = Array.from(ejerciciosRepeticiones).map(input => input.value);

    const datosRutina = {
        user_id: id,
        name: name,
        exerciseName: nombres,
        exerciseSets: series,
        exerciseReps: repeticiones
    };
    try {
        const respuesta = await fetch(`http://${REDIRECT}/api/crear_rutinas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosRutina)
        });
        if (!respuesta.ok) {
            throw new Error('Network response was not ok');

        }
        cerrarModal();
        contenedorRutinas.innerHTML = "";
        obtenerRutinas();

    } catch (error) {
        console.error(error);
    }
}
function mostrarRutinas(rutinas) {
    console.log(rutinas);
    parrafo.style.display = 'none';

    for (const [rutinaNombre, ejercicios] of Object.entries(rutinas)) {
        console.log(ejercicios);
        console.log(rutinaNombre);
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        const titulo = document.createElement('p');
        titulo.innerHTML = capitalizarInicial(rutinaNombre);
        titulo.classList.add('nombreRutina');

        const contenedorAbrirRutina = document.createElement('div');
        contenedorAbrirRutina.id = 'contenedor_abrir_rutina';


        const abrir_rutina = document.createElement('a');
        abrir_rutina.innerHTML = "Show routine";
        abrir_rutina.id = 'abrir_rutina';
        abrir_rutina.className = 'btn btn-primary';

        const borrar_rutina = document.createElement('a');
        borrar_rutina.innerHTML = "Delete routine <span class='material-symbols-outlined'>delete</span>";
        borrar_rutina.id = ejercicios[0].id_rutina;
        borrar_rutina.className = 'btn btn-danger';
        borrar_rutina.classList.add('borrar_rutina');



        abrir_rutina.addEventListener('click', function () {
            abrirRutina(ejercicios);
        });

        borrar_rutina.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this routine?')) {
                borrarRutina(this.id);
            }
        });

        contenedorAbrirRutina.append(abrir_rutina);
        tarjeta.append(titulo, contenedorAbrirRutina, borrar_rutina);
        contenedorRutinas.appendChild(tarjeta);
    }
    main.appendChild(contenedorRutinas);
}

function abrirRutina(ejercicios) {
    const datos = JSON.stringify(ejercicios);
    window.location.href = 'ejercicios.html?datos=' + encodeURIComponent(datos);
}
function cerrarModal() {
    const cuerpo = document.getElementById('cuerpo');
    cuerpo.style.filter = "blur(0px)";
    ventana_borrosa.style.display = "none";
    modal.style.display = "none";
}

async function borrarRutina(rutina) {
    try {
        const respuesta = await fetch(`http://${REDIRECT}/api/borrar_rutina/${rutina}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!respuesta.ok) {
            throw new Error('Network response was not ok');

        }
        const datos = await respuesta.json();
        cerrarModal();
        contenedorRutinas.innerHTML = "";
        obtenerRutinas();

    } catch (error) {
        console.error(error);
    }
}

ventana_borrosa.addEventListener("click", cerrarModal);
