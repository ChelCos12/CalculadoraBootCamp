const pantalla = document.querySelector('.pantalla');
const botonesNumeros = document.querySelectorAll('.numero');
const botonesOperadores = document.querySelectorAll('.operador');
const botonesFuncion = document.querySelectorAll('.funcion');
const botonIgual = document.querySelector('.igual');


let numeroActual = '0';
let numeroAnterior = '';
let operacion = null;
let debeResetear = false;

function actualizarPantalla() {
    pantalla.textContent = numeroActual;
}

// Limpiar toda la calculadora
function limpiar() {
    numeroActual = '0';
    numeroAnterior = '';
    operacion = null;
    debeResetear = false;
    actualizarPantalla();
}

// Agregar un número a la pantalla
function agregarNumero(numero) {
    // Si debe resetear (después de un cálculo), empieza desde cero
    if (debeResetear) {
        numeroActual = numero;
        debeResetear = false;
    } else {
        // Si la pantalla muestra '0', reemplázalo
        // Si no, agrega el número al final
        if (numeroActual === '0') {
            numeroActual = numero;
        } else {
            numeroActual = numeroActual + numero;
        }
    }
    actualizarPantalla();
}

// Agregar el punto decimal
function agregarPunto() {
    // Solo agregar punto si no hay uno ya
    if (!numeroActual.includes('.')) {
        numeroActual = numeroActual + '.';
        actualizarPantalla();
    }
}

// Seleccionar una operación (+, -, ×, ÷)
function seleccionarOperacion(op) {
    // Si ya había una operación pendiente, calcular primero
    if (operacion !== null && !debeResetear) {
        calcular();
    }
    
    numeroAnterior = numeroActual;
    operacion = op;
    debeResetear = true;
}

// Realizar el cálculo
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


// Botones de números (0-9 y punto)
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

// Botones de operadores (+, -, ×, ÷)
botonesOperadores.forEach(boton => {
    boton.addEventListener('click', () => {
        seleccionarOperacion(boton.textContent);
    });
});

// Botones de funciones (C, ±)
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

// Botón igual (=)
botonIgual.addEventListener('click', () => {
    calcular();
});


//lectura desde el teclado
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
        event.preventDefault(); //?
        seleccionarOperacion('÷');
    }
    if (tecla === 'Enter' || tecla === '=') {
        event.preventDefault();
        calcular();
    }
    if (tecla === 'Escape') {
        limpiar();
    }
    
    // Backspace para borrar último dígito
    if (tecla === 'Backspace') {
        if (numeroActual.length > 1) {
            numeroActual = numeroActual.slice(0, -1);
        } else {
            numeroActual = '0';
        }
        actualizarPantalla();
    }
});