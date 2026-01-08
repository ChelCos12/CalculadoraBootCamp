const pantalla = document.querySelector('.pantalla');
const botonesNumeros = document.querySelectorAll('.numero');
const botonesOperadores = document.querySelectorAll('.operador');
const botonesFuncion = document.querySelectorAll('.funcion');
const botonIgual = document.querySelector('.igual');

let numeroActual = '0';
let numeroAnterior = '';
let operacion = null;
let debeResetear = false;
let historyList = [];

const savedHistory = localStorage.getItem("history");
if (savedHistory) {
    historyList = JSON.parse(savedHistory);
    renderHistory();
}

function actualizarPantalla() {
    pantalla.textContent = numeroActual;
}
function limpiar() {
    numeroActual = '0';
    numeroAnterior = '';
    operacion = null;
    debeResetear = false;
    actualizarPantalla();
}

function agregarNumero(numero) {
    if (debeResetear) {
        numeroActual = numero;
        debeResetear = false;
    } else {
        if (numeroActual === '0') {
            numeroActual = numero;
        } else {
            numeroActual = numeroActual + numero;
        }
    }
    actualizarPantalla();
}

function agregarPunto() {
    if (!numeroActual.includes('.')) {
        numeroActual = numeroActual + '.';
        actualizarPantalla();
    }
}

function seleccionarOperacion(op) {
    if (operacion !== null && !debeResetear) {
        calcular();
    }
    
    numeroAnterior = numeroActual;
    operacion = op;
    debeResetear = true;
}
function calcular() {
    const anterior = parseFloat(numeroAnterior);
    const actual = parseFloat(numeroActual);
    let resultado;
    
    switch (operacion) {
        case '+':
            resultado = anterior + actual;
            break;
        case '-':
            resultado = anterior - actual;
            break;
        case '×':
            resultado = anterior * actual;
            break;
        case '÷':
            if (actual === 0) {
                alert('No se puede dividir entre cero');
                limpiar();
                return;
            }
            resultado = anterior / actual;
            break;
        default:
            return;
    }

    const expresion = `${numeroAnterior} ${operacion} ${numeroActual}`;
    saveHistory({ expresion, resultado });
    
    numeroActual = resultado.toString();
    operacion = null;
    numeroAnterior = '';
    debeResetear = true;
    actualizarPantalla();
}
function cambiarSigno() {
    if (numeroActual === '0') return;
    
    if (numeroActual.charAt(0) === '-') {
        numeroActual = numeroActual.slice(1);
    } else {
        numeroActual = '-' + numeroActual;
    }
    actualizarPantalla();
}

function borrarOperacion() {
    numeroActual = '0';
    actualizarPantalla();
}

botonesNumeros.forEach(boton => {
    boton.addEventListener('click', () => {
        const valor = boton.textContent;
        
        if (valor === '.') {
            agregarPunto();
        } else {
            agregarNumero(valor);
        }
    });
});

botonesOperadores.forEach(boton => {
    boton.addEventListener('click', () => {
        seleccionarOperacion(boton.textContent);
    });
});

botonesFuncion.forEach(boton => {
    boton.addEventListener('click', () => {
        const funcion = boton.textContent;
        
        if (funcion === 'C') {
            limpiar();
        } else if (funcion === '±') {
            cambiarSigno();
        } else if (funcion === 'CE') {
            borrarOperacion();
        }
    });
});

botonIgual.addEventListener('click', () => {
    calcular();
});

//LocalHistory
function saveHistory(operation) {
    historyList.push(operation);
    localStorage.setItem("history", JSON.stringify(historyList));
    renderHistory();
}

function renderHistory() {
    let container = document.getElementById("lista-historial");
    container.innerHTML = "";
    let reversedHistory = historyList.slice().reverse();
    
    for (let i = 0; i < reversedHistory.length; i++) {
        let itemElement = document.createElement("div");
        itemElement.className = "operacion-item";
        itemElement.innerHTML = `
            <div>${reversedHistory[i].expresion}</div>
            <div class="resultado">= ${reversedHistory[i].resultado}</div>
        `;
        container.appendChild(itemElement);
    }
}

function clearHistory() {
    historyList = [];
    localStorage.removeItem("history");
    renderHistory();
}


document.addEventListener('keydown', (event) => {
    const tecla = event.key;
    
    if (tecla >= '0' && tecla <= '9') {
        agregarNumero(tecla);
    }
    if (tecla === '.') {
        agregarPunto();
    }
    if (tecla === '+') {
        seleccionarOperacion('+');
    }
    if (tecla === '-') {
        seleccionarOperacion('-');
    }
    if (tecla === '*') {
        seleccionarOperacion('×');
    }
    if (tecla === '/') {
        seleccionarOperacion('÷');
    }
    if (tecla === 'Enter' || tecla === '=') {
        calcular();
    }
    if (tecla === 'Escape') {
        limpiar();
    }
});

document.getElementById('limpiar-historial').addEventListener('click', clearHistory);
