//DOM
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
    // Solo agregar punto si no hay uno ya
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

//BOTONES
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


//TECLADO
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
    if (tecla === 'Backspace') {
        if (numeroActual.length > 1) {
            numeroActual = numeroActual.slice(0, -1);
        } else {
            numeroActual = '0';
        }
        actualizarPantalla();
    }
});
