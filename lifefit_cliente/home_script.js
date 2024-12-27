const REDIRECT = '192.168.1.167:8000';

let cuerpo = document.getElementById('cuerpo');
const userId = localStorage.getItem('userId');

if (localStorage.getItem('userId')) {
    inicio();
}

const capitalizarInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}
async function obtenerEjercicios() {

    const urlEjercicios = 'https://exercisedb.p.rapidapi.com/exercises?limit=1300';
    const optionsEjercicios = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '7ea9603420mshd2f48dae93c66abp1e68b0jsnca41b5bbeeaf',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        },
    };
    try {
        const response = await fetch(urlEjercicios, optionsEjercicios);
        const data = await response.json();
        const ejercicios = data.map(exercise => {
            return {
                nombre: exercise.name,
                description: exercise.instructions[0],
                equipment: exercise.equipment,
                primary_muscle_id: exercise.target,
                secundary_muscles: exercise.secondayMuscles,
                multimedia: exercise.gifUrl
            };
        });
        return ejercicios;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function enviarEjercicios(ejercicios) {
    const url1 = `http://${REDIRECT}/api/crear_ejercicios`;
    const options1 = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'User-agent': 'learning app',
        },
        body: JSON.stringify(ejercicios),
    };

    try {
        const response = await fetch(url1, options1);
        const data = await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function crearEjercicios() {
    try {
        const ejercicios = await obtenerEjercicios();
        await enviarEjercicios(ejercicios);
    } catch (error) {
        console.error("Ha ocurrido un error: " + error);
    }
}

async function obtenerMusculos() {
    const urlMusculos = 'https://exercisedb.p.rapidapi.com/exercises/targetList';
    const optionsMusculos = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '7ea9603420mshd2f48dae93c66abp1e68b0jsnca41b5bbeeaf',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        },
    };
    try {
        const response = await fetch(urlMusculos, optionsMusculos);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function insertarMusculos() {
    try {
        const musculos = await obtenerMusculos();

        const url1 = `http://${REDIRECT}/api/crear_musculos`;
        const options1 = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'User-agent': 'learning app',
            },
            body: JSON.stringify(musculos),
        };

        try {
            const response = await fetch(url1, options1);
            const data = await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    } catch (error) {
        console.error("Ha ocurrido un error: " + error);
    }
}


async function obtenerEjerciciosApi() {
    const url = `http://${REDIRECT}/api/mostrar_ejercicios`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'User-agent': 'learning app',
        },

    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        mostrarEjerciciosApi(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
function mostrarEjerciciosApi(ejercicios) {
    const contenedor = document.getElementById('ejercicios');
    cuerpo.style.display = 'block';
    ejercicios.forEach((ejercicio, index) => {
        if (index <= 100 && ejercicio.multimedia !== null && ejercicio.multimedia !== undefined) {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');
            tarjeta.classList.add('tarjeta' + index);
            tarjeta.id = ejercicio.id;

            const titulo = document.createElement('p');
            titulo.innerHTML = capitalizarInicial(ejercicio.name);
            titulo.classList.add('nombreEjercicio');

            const imagen = document.createElement('img');
            imagen.src = ejercicio.multimedia;
            imagen.classList.add('imagenEjercicio');

            const contenido = document.createElement('div');
            contenido.classList.add('contenedorContenido');



            const equipamiento = document.createElement('p');
            equipamiento.classList.add('equipamientoEjercicio');
            equipamiento.innerHTML = `<span style="font-weight:bold;">Equipment: </span>` + ejercicio.equipment;

            const musculo = document.createElement('p');
            musculo.classList.add('nombreMusculo');
            musculo.innerHTML = `<span style="font-weight:bold;">Muscle: </span>` + ejercicio.primary_muscle_id;

            contenido.append(equipamiento, musculo);
            tarjeta.append(titulo, imagen, contenido);
            contenedor.appendChild(tarjeta);

            tarjeta.addEventListener('click', function () {
                mostrarEjercicio(ejercicio);
            });
        }
    });
}

function mostrarEjercicio(ejercicio) {
    localStorage.setItem('ejercicioSeleccionado', JSON.stringify(ejercicio));
    console.log("Ejercicio seleccionado:", ejercicio);
    window.location.href = 'mostrar_ejercicios.html';
}


async function inicio() {
    await obtenerEjerciciosApi();

}

document.addEventListener('DOMContentLoaded', async function (e) {
    e.preventDefault();
    inicio();
});

document.querySelectorAll(".menu a").forEach(function (link) {
    link.addEventListener("click", async function (event) {
        event.preventDefault();

        const musculoId = this.getAttribute("id");
        const contenedor = document.getElementById('ejercicios');
        contenedor.innerHTML = '';

        try {
            const url = `http://${REDIRECT}/api/filtro_ejercicios_musculos/${musculoId}`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'User-agent': 'learning app',
                },

            };
            const response = await fetch(url, options);


            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            mostrarEjerciciosApi(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            alert("Hubo un problema al cargar los ejercicios.");
        }
    });
});
document.getElementById("close_session").addEventListener("click", function () {
    localStorage.removeItem("userId");
    window.location.href = "index.html";
});



