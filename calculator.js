const display = document.querySelector('#display');
let expression = '';
document.querySelector('#keypad').addEventListener('click', (event) => {
    const target = event.target; 
    if (target.className == 'column') return;

    if (target.classList[0] == 'clear-btn') {
        expression = '';
        displayData();
        return;
    }
    else if (target.className.includes('operator') || target.className.includes('icon-opr')) {
        //Don't add operator if the expression is empty.
        if (!expression) return;
        // Don't add operator if the last element (disregard spaces) is an operator. Include lastChar !== '.' to disregard decimal point.
        const lastChar = expression[expression.length - 2];
        if (isNaN(lastChar) && lastChar !== undefined && lastChar !== '.') return;
        
        let operator
        switch(target.classList[0]) {
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
    else if (target.className.includes('equals')) {
        //Don't execute operate() if expression doesn't have two operands and an operator.
        const lastChar = expression[expression.length - 2];
        if (isNaN(lastChar) && lastChar !== undefined) return;
        operate(expression);
    }
    else if (target.className.includes('backspace-btn')) {
        //Convert expression to an array, each character should be an array element. 
        let expressionArry = expression.split('');
        //Pop the last element from the array including any white space before it. 
        expressionArry.pop();
        if (expressionArry[expressionArry.length - 1] === ' ') expressionArry.pop();
        expression = expressionArry.join('');
    }
    else if (target.className.includes('decimal-point')) {
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

    if (target.className == 'digit') expression += target.innerText;
    displayData();
});

// document.addEventListener()

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