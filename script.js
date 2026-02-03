let tiempoOriginal = 25 * 60; // 25 minutos
let tiempoRestante = tiempoOriginal;
let intervalo = null;
let enPausa = true;

const elementoReloj = document.querySelector('h1');
const botonStart = document.getElementById('start');
const botonReset = document.getElementById('reset');
const sonidoAlarma = document.getElementById('alarma');

function actualizarDisplay() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    
    // Formato 00:00
    const texto = `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    
    elementoReloj.textContent = texto;
    document.title = `${texto} - Zen Focus`;
}

function alternarTemporizador() {
    if (enPausa) {
        // INICIAR
        iniciar();
    } else {
        // PAUSAR
        pausar();
    }
}

function iniciar() {
    if (!enPausa) return; // Ya está corriendo
    
    enPausa = false;
    botonStart.textContent = "Pausar"; // Cambiamos el texto del botón
    
    intervalo = setInterval(() => {
        tiempoRestante--;
        actualizarDisplay();

        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            sonidoAlarma.play(); // ¡SONIDO! 🔔
            alert("¡Tiempo terminado! Tómate un descanso.");
            resetear(); // Volvemos al inicio automáticamente
        }
    }, 1000);
}

function pausar() {
    if (enPausa) return;
    
    clearInterval(intervalo);
    intervalo = null;
    enPausa = true;
    botonStart.textContent = "Continuar"; // Feedback visual
}

function resetear() {
    pausar(); // Primero paramos si estaba corriendo
    tiempoRestante = tiempoOriginal;
    botonStart.textContent = "Empezar";
    actualizarDisplay();
}

// Event Listeners
botonStart.addEventListener('click', alternarTemporizador);
botonReset.addEventListener('click', resetear);

// Inicializar pantalla
actualizarDisplay();