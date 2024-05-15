document.addEventListener("DOMContentLoaded", function(){
    const respuesta = window.location.search;
    const parseoDatos = new URLSearchParams(respuesta);
    const datosJSON = parseoDatos.get('datos');
    const datosUsuario = JSON.parse(datosJSON);

    console.log(datosUsuario);

    if (datosUsuario){
        mostrarEjercicios(datosUsuario);
    }
});
const capitalizarInicial = (nombre) =>{
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

function mostrarEjercicios(ejercicios){
    const contenedor = document.getElementById('rutina'); 
    ejercicios.forEach((ejercicio, index) => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        const titulo = document.createElement('p');
        titulo.innerHTML = `Exercise ${index+1}: ${capitalizarInicial(ejercicio.nombre)}`; 
        titulo.classList.add('nombreEjercicio');

        const imagen = document.createElement('img');
        imagen.src = ejercicio.imagen;
        imagen.classList.add('imagenEjercicio');

        const contenido = document.createElement('div');
        contenido.classList.add('contenedorContenido');

        const equipamiento = document.createElement('p');
        equipamiento.classList.add('equipamientoEjercicio');
        equipamiento.innerHTML =  `<span style="font-weight:bold;">Equipment: </span>` + ejercicio.equipamiento;

        const musculo = document.createElement('p');
        musculo.classList.add('nombreMusculo');
        musculo.innerHTML =  `<span style="font-weight:bold;">Muscle: </span>` + ejercicio.musculo;

        const series = document.createElement('p');
        series.classList.add('seriesEjercicio');
        series.innerHTML =  `<span style="font-weight:bold;">Sets: </span>` + ejercicio.series;

        const repeticiones = document.createElement('p');
        repeticiones.classList.add('repeticionesEjercicio');
        repeticiones.innerHTML =  `<span style="font-weight:bold;">Repetitions: </span>` + ejercicio.repeticiones;

        contenido.append(equipamiento, musculo,series,repeticiones);
        tarjeta.append(titulo,imagen,contenido);
        contenedor.appendChild(tarjeta);

    });
}