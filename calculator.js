const display = document.querySelector('#display');
let expression = '';
document.querySelector('#keypad').addEventListener('click', (event) => {
    const target = event.target; 
    if (target.className == 'column') return;

    if (target.classList[0] == 'clear-btn') {
        expression = '';
    }
    else if (target.className.includes('operator') || target.className.includes('icon-opr')) {
        addOperator(target, true);
    }
    else if (target.className.includes('equals')) {
        //Don't execute operate() if expression doesn't have two operands and an operator.
        const lastChar = expression[expression.length - 2];
        if (isNaN(lastChar) && lastChar !== undefined) return;
        operate(expression);
    }
    else if (target.className.includes('backspace-btn')) {
        backspace();
    }
    else if (target.className.includes('decimal-point')) {
        addDecimalPoint();
    }

    if (target.className == 'digit') expression += target.innerText;
    displayData();
});

document.addEventListener('keyup', (event) => {
    const key = event.key;
    if (!isNaN(key)) expression += key;

    if (key == '.') {
        addDecimalPoint();
    }
    else if (key == 'Backspace') {
        backspace();
    }
    else if (key == 'Delete') {
        expression = '';
    }
    else if (key == 'Enter') {
        //Don't execute operate() if expression doesn't have two operands and an operator.
        const lastChar = expression[expression.length - 2];
        if (isNaN(lastChar) && lastChar !== undefined) return;
        operate(expression);
    }
    else if (key == '+' || key == '/' || key == '*' || key == '-') {
        addOperator(key, false);
    }

    displayData();
});

function operate(problem) {
    let operator = problem.split(' ')[1];
    const operand1 = +problem.split(' ')[0];
    const operand2 = +problem.split(' ')[2];
    operator = (operator == '÷') ? '/' : (operator == '×') ? '*' : operator;
    
    if (operator == '/' && operand2 == 0) {
        expression = "Can't divide by zero";
        return;
    }

    switch(operator) {
        case '+':
            expression = String(operand1 + operand2);
            break
        case '-':
            expression = String(operand1 - operand2);
            break
        case '*':
            expression = String(operand1 * operand2);
            break
        case '/':
            expression = String(operand1 / operand2);
    }

    //Round the number to four decimal places if the decimal count is greater than four.
    if (expression.includes('.')) {
        const decimalCount = expression.split('.')[1].length;
        expression = (decimalCount >= 4) ? Number(expression).toFixed(4) : expression;
    }
}

function displayData() {
    display.innerText = expression;
}

function addDecimalPoint() {
    //Don't add decimal point if expression is empty.
    if (!expression) return;
    // Don't add decimal point if the last element (disregard space) is an operator
    const lastChar = expression[expression.length - 2];
    if (isNaN(lastChar) && lastChar !== undefined) return;
    // Prevent user from adding multiply decimal points to a number
    const lastNumber_isFloat = (expression.split(' ')[expression.split(' ').length - 1].includes('.')) ? true : false;
    if (lastNumber_isFloat) return;
    expression += '.';
}

function backspace() {
    //Convert expression to an array, each character should be an array element. 
    let expressionArry = expression.split('');
    if (expressionArry[expressionArry.length - 1] === ' ') {
        //Remove the operator and the spaces around it 
        for (let i = 0; i < 3; i++) {
            expressionArry.pop();
        }
    }
    else {
        expressionArry.pop();
    }
    expression = expressionArry.join('');
}

function addOperator(operator, clickEvent = true) {
    //Don't add operator if the expression is empty.
    if (!expression) return;
    // Don't add operator if the last element (disregard spaces) is an operator. Include lastChar !== '.' to disregard decimal point.
    const lastChar = expression[expression.length - 2];
    if (isNaN(lastChar) && lastChar !== undefined && lastChar !== '.') return;
    
    if (clickEvent) {
        switch(operator.classList[0]) {
            case 'plus':
                operator = ' + ';
                break
            case 'minus':
                operator = ' - ';
                break
            case 'multiply':
                operator = ' × ';
                break
            case 'divide':
                operator = ' ÷ ';
        }
    }
    else {
        switch(operator) {
            case '+':
                operator = ' + ';
                break
            case '-':
                operator = ' - ';
                break
            case '*':
                operator = ' × ';
                break
            case '/':
                operator = ' ÷ ';
        }
    }

    //Execute operate() if the expression already contains two operands and an operator
    if (expression.split(' ').length == 3) {
        operate(expression);
        expression += operator;
        displayData();
        return;
    }
    else {
        expression += operator;
    }
}