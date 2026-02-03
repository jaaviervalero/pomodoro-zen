let tiempoRestante = 25 * 60; // 25 minutos convertidos a segundos
let intervalo = null; // Aquí guardaremos el ID del "metrónomo"

const elementoReloj = document.querySelector('h1');
const botonEmpezar = document.getElementById('start');

// Función para pintar el tiempo en pantalla (formato 00:00)
function actualizarDisplay() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;

    // Operador ternario (un if compacto): ¿Es menor de 10? Ponle un '0' delante.
    const textoMinutos = minutos < 10 ? '0' + minutos : minutos;
    const textoSegundos = segundos < 10 ? '0' + segundos : segundos;

    elementoReloj.textContent = `${textoMinutos}:${textoSegundos}`;
    
    // Bonus: Cambia el título de la pestaña del navegador también
    document.title = `${textoMinutos}:${textoSegundos} - Zen Focus`;
}

function iniciarPomodoro() {
    if (intervalo) return; // Si ya está corriendo, no hacemos nada (evita bugs de doble click)

    console.log("Temporizador iniciado");
    
    intervalo = setInterval(() => {
        tiempoRestante--; // Restamos 1 segundo
        actualizarDisplay();

        // Cuando llega a 0
        if (tiempoRestante <= 0) {
            clearInterval(intervalo); // Paramos el metrónomo
            intervalo = null;
            tiempoRestante = 25 * 60; // Reseteamos para la próxima
            alert("¡Tiempo! Descansa 5 minutos.");
            actualizarDisplay();
        }
    }, 1000); // Se ejecuta cada 1000 milisegundos (1 segundo)
}

// Conectamos el botón con la función
botonEmpezar.addEventListener('click', iniciarPomodoro);