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
    else if (target.className.includes('equals')) {
        operate(expression);
        displayData();
        return;
    }
    else if (target.className.includes('operator') || target.className.includes('icon-opr')) {
        if (!expression) return;
        const lastChar = expression[expression.length - 2];
        if (isNaN(lastChar) && lastChar !== undefined) return;
        
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

        if (expression.split(' ').length == 3) {
            operate(expression);
            expression += operator;
            displayData();
            return;
        }
        expression += operator;
    }

    if (target.className == 'digit') expression += target.innerText;

    // console.log(target.classList[0])
    displayData();
});

function operate(problem) {
    let operator = problem.split(' ')[1];
    const operand1 = +problem.split(' ')[0];
    const operand2 = +problem.split(' ')[2];
    operator = (operator == '÷') ? '/' : (operator == '×') ? '*' : operator;
    
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
    console.log(expression);
}

function displayData() {
    display.innerText = expression;
}