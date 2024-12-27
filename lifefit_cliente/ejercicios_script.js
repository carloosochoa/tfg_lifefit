document.addEventListener("DOMContentLoaded", function () {
    const respuesta = window.location.search;
    const parseoDatos = new URLSearchParams(respuesta);
    const datosJSON = parseoDatos.get('datos');
    const datosUsuario = JSON.parse(datosJSON);


    if (datosUsuario) {
        mostrarEjercicios(datosUsuario);
    }
});
const capitalizarInicial = (nombre) => {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

function mostrarEjercicios(ejercicios) {
    const cuerpoTabla = document.createElement('tr');
    cuerpoTabla.classList.add('cuerpo_tabla');

    const botonVisible = document.createElement('button');
    botonVisible.innerHTML = 'Update values';
    botonVisible.style.display = 'none';

    ejercicios.forEach((ejercicio, index) => {
        const rutina = document.getElementById('rutina');
        const cuerpoTabla = document.createElement('tr');
        cuerpoTabla.classList.add('cuerpo_tabla');
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');
        const contenedor = document.createElement('div');
        contenedor.classList.add('contenedorContenido');
        contenedor.id = 'contenedorContenido';
        const titulo = document.createElement('p');
        titulo.innerHTML = `Exercise ${index + 1}: ${capitalizarInicial(ejercicio.nombre)}`;
        titulo.classList.add('nombreEjercicio');

        const imagen = document.createElement('img');
        imagen.src = ejercicio.imagen;
        imagen.classList.add('imagenEjercicio');
        contenedor.append(titulo, imagen);

        const tabla = document.createElement('table');
        const thead = document.createElement('thead');
        const trCabecera = document.createElement('tr');
        trCabecera.id = "cabecera_tabla";

        const tdEquipment = document.createElement('td');
        tdEquipment.textContent = "Equipment";

        const tdMuscle = document.createElement('td');
        tdMuscle.textContent = "Muscle";

        const tdSets = document.createElement('td');
        tdSets.textContent = "Sets";

        const tdReps = document.createElement('td');
        tdReps.textContent = "Reps";

        trCabecera.append(tdEquipment, tdMuscle, tdSets, tdReps);
        thead.appendChild(trCabecera);

        const equipamientoTd = document.createElement('td');
        equipamientoTd.textContent = ejercicio.equipamiento;

        const musculoTd = document.createElement('td');
        musculoTd.textContent = ejercicio.musculo;

        const setsTd = document.createElement('td');
        const setsInput = document.createElement('input');
        setsInput.classList.add('seriesInput');
        setsInput.type = 'number';
        setsInput.value = ejercicio.series;
        setsTd.appendChild(setsInput);

        const repsTd = document.createElement('td');
        const repsInput = document.createElement('input');
        repsInput.classList.add('repeticionesInput');
        repsInput.type = 'number';
        repsInput.value = ejercicio.repeticiones;
        repsTd.appendChild(repsInput);

        cuerpoTabla.append(equipamientoTd, musculoTd, setsTd, repsTd);
        tabla.appendChild(thead);
        tabla.appendChild(cuerpoTabla);
        tarjeta.append(contenedor, tabla);
        rutina.appendChild(tarjeta);
    });



    let actualizarDatos = [];

    botonVisible.addEventListener('click', function () {
        const seriesValue = document.querySelector('.seriesInput').value;
        const repeticionesValue = document.querySelector('.repeticionesInput').value;
        actualizarDatos.push(seriesValue, repeticionesValue);
    });


    rutina.append(botonVisible);

    const inputs = document.querySelectorAll('.seriesInput, .repeticionesInput');
    inputs.forEach(input => {
        input.addEventListener('change', function () {
            botonVisible.style.display = "block";
        });
    });
}

