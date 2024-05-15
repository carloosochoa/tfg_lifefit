const REDIRECT = '192.168.0.23:8000';

let cuerpo = document.getElementById('cuerpo');
cuerpo.style.display = 'none';
const userId = localStorage.getItem('userId');

if(localStorage.getItem('userId')){
    inicio();
}

const capitalizarInicial = (nombre) =>{
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
    const url1 = 'http://192.168.0.23:8000/api/crear_ejercicios';
    const options1 = {
        method: 'POST',
        headers: {
            accept : 'application/json',
            'User-agent': 'learning app',
        },
        body: JSON.stringify(ejercicios),
    };

    try {
        const response = await fetch(url1, options1);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function crearEjercicios() {
    try {
        const ejercicios = await obtenerEjercicios();
        console.log(ejercicios);
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

        
        // Iterar sobre los músculos y enviarlos al servidor Laravel para insertar en la base de datos
        const url1 = 'http://192.168.0.23:8000/api/crear_musculos';
        const options1 = {
            method: 'POST',
            headers: {
                accept : 'application/json',
                'User-agent': 'learning app',
            },
            body: JSON.stringify(musculos),
        };
    
        try {
            const response = await fetch(url1, options1);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    } catch (error) {
        console.error("Ha ocurrido un error: " + error);
    }
}

async function obtenerEjerciciosApi(){
    const url = 'http://192.168.0.23:8000/api/mostrar_ejercicios';
    const options = {
        method: 'GET',
        headers: {
            accept : 'application/json',
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
function mostrarEjerciciosApi(ejercicios){
    const contenedor = document.getElementById('ejercicios');
    pantallaLogin = document.getElementById('contLogin').style.display = 'none';
    cuerpo.style.display = 'block';
    ejercicios.forEach((ejercicio ,index) => {
        if(index <= 100 && ejercicio.multimedia!== null && ejercicio.multimedia !== undefined) {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');
        tarjeta.classList.add('tarjeta'+index);

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
        equipamiento.innerHTML =  `<span style="font-weight:bold;">Equipment: </span>` + ejercicio.equipment;

        const musculo = document.createElement('p');
        musculo.classList.add('nombreMusculo');
        musculo.innerHTML =  `<span style="font-weight:bold;">Muscle: </span>` + ejercicio.primary_muscle_id;
        
        contenido.append(equipamiento, musculo);
        tarjeta.append(titulo,imagen,contenido);
        contenedor.appendChild(tarjeta);
        }
    });
}
async function iniciarSesion(){
    const formulario = document.getElementById('formularioLogin');
    const formData = new FormData(formulario);
    const datosUsuario = Object.fromEntries(formData);
    try {
        const respuesta = await fetch('http://192.168.0.23:8000/api/iniciar_sesion', {
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
        console.log('Login succesful');
        console.log(datos);
        localStorage.setItem('userId', datos.success.id);
        
    } catch (error) {
        console.error(error);
    }
}

async function inicio(){
    await obtenerEjerciciosApi();
}

document.getElementById('formularioLogin').addEventListener('submit', async function(e) {
    e.preventDefault();
    await iniciarSesion();
    inicio();
    });

document.querySelectorAll(".menu a").forEach(function(link) {
    link.addEventListener("click", async function(event) {
        event.preventDefault(); 

        const musculoId = this.getAttribute("id");

        try {
            const url = `http://${REDIRECT}/api/filtro_ejercicios_musculos/${musculoId}}`;
            const options = {
                method: 'GET',
                headers: {
                    accept : 'application/json',
                    'User-agent': 'learning app',
                },
        
            };
            const response = await fetch(url, options);

            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const contenedor = document.getElementById('ejercicios');
            contenedor.innerHTML = '';
            mostrarEjerciciosApi(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    });
});


