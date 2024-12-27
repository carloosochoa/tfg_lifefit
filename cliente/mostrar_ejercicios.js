const capitalizarInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

document.addEventListener("DOMContentLoaded", function(){
    const ejercicio = JSON.parse(localStorage.getItem("ejercicioSeleccionado"));

    if (ejercicio){
        const contenedor = document.getElementById("mostrar_ejercicio");
            contenedor.id = ejercicio.id;

            const titulo = document.createElement('p');
            titulo.innerHTML = capitalizarInicial(ejercicio.name);
            titulo.classList.add('nombreEjercicio');

            const imagen = document.createElement('img');
            imagen.src = ejercicio.multimedia;
            imagen.classList.add('imagenEjercicio');

            const contenido = document.createElement('div');
            contenido.classList.add('contenedorContenido');

            const descripcion = document.createElement('p');
            descripcion.classList.add('descripcion');
            descripcion.innerHTML = `<span style="font-weight:bold;">Description: </span>` +  ejercicio.description;

            const equipamiento = document.createElement('p');
            equipamiento.classList.add('equipamientoEjercicio');
            equipamiento.innerHTML = `<span style="font-weight:bold;">Equipment: </span>` + ejercicio.equipment;

            const musculo = document.createElement('p');
            musculo.classList.add('nombreMusculo');
            musculo.innerHTML = `<span style="font-weight:bold;">Muscle: </span>` + ejercicio.primary_muscle_id;

            contenido.append(descripcion, equipamiento, musculo);
            contenedor.append(titulo, imagen, contenido);
    }
});