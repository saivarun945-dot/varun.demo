document.addEventListener('DOMContentLoaded', () => {
    const calculatorScreen = document.getElementById('calculator-screen');
    const buttons = document.querySelectorAll('.button');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    function updateDisplay() {
        calculatorScreen.value = currentInput;
    }

    function inputDigit(digit) {
        if (waitingForSecondOperand === true) {
            currentInput = digit;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    function inputDecimal(dot) {
        if (waitingForSecondOperand === true) {
            currentInput = "0.";
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }

        if (!currentInput.includes(dot)) {
            currentInput += dot;
        }
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    const performCalculation = {
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '=': (firstOperand, secondOperand) => secondOperand // Equals just shows the second operand after operation
    };

    function handleFunction(func) {
        if (func === 'AC') {
            currentInput = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
        } else if (func === '+/-') {
            currentInput = String(parseFloat(currentInput) * -1);
        } else if (func === '%') {
            currentInput = String(parseFloat(currentInput) / 100);
        }
        updateDisplay();
    }

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const { value } = event.target.dataset;

            if (!value) return; // Ignore clicks if data-value is not set

            if (event.target.classList.contains('number')) {
                inputDigit(value);
            } else if (event.target.classList.contains('operator')) {
                handleOperator(value);
            } else if (event.target.classList.contains('function')) {
                if (value === '.') {
                    inputDecimal(value);
                } else if (value === 'mobile') {
                    // This button is for visual representation,
                    // no specific calculator logic
                    console.log('Mobile button clicked (visual only)');
                } else {
                    handleFunction(value);
                }
            } else if (event.target.classList.contains('equals')) {
                handleOperator('=');
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (key >= '0' && key <= '9') {
            inputDigit(key);
        } else if (key === '.') {
            inputDecimal(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleOperator(key);
        } else if (key === 'Enter' || key === '=') {
            handleOperator('=');
            event.preventDefault(); // Prevent default Enter key behavior (e.g., submitting forms)
        } else if (key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === '') {
                currentInput = '0';
            }
            updateDisplay();
        } else if (key === 'Escape') {
            handleFunction('AC');
        }
    });

    updateDisplay(); // Initial display update
});