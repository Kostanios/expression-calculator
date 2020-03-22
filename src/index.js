const operations = new Map([
    ["+", (x,y) => x + y],
    ["-", (x,y) => x - y],
    ["*", (x,y) => x*y],
    ["/", (x,y) => {
        if( y === 0)
            throw "TypeError: Division by zero.";
        return x / y;
    }]
]);

function expressionCalculator(expr) {
    expr = expr.replace(/ /g, "");

    if(expr.replace(/[\d+\-*/)]/g, "").length !== expr.replace(/[\d+\-*/(]/g, "").length)
        throw "ExpressionError: Brackets must be paired";
        
    return calculate(expr.split("").join(" ").replace(/\b \b/g, "").split(" ")).value;
}


function calculate(arr){
    var bracketsStack = [];
    var multiplyStack = [];
    var sumStack = [];
    var fBracketsIndex = arr.findIndex(x => x === "(");
    var lBracketsIndex = arr.findIndex(x => x === ")");
    var rest = [];

    while(fBracketsIndex >= 0 && fBracketsIndex < lBracketsIndex)
    {    
        let result = calculate(arr.slice(fBracketsIndex + 1, arr.length));
        bracketsStack = arr.slice(0, fBracketsIndex);
        bracketsStack.push(result.value);
        bracketsStack = bracketsStack.concat(result.rest);
        lBracketsIndex = bracketsStack.findIndex(x => x === ")");
        fBracketsIndex = bracketsStack.findIndex(x => x === "(");
        arr = bracketsStack;
    }

    if(bracketsStack.length === 0)
        bracketsStack = arr;
    
    if(lBracketsIndex > 0)
    {   
        rest = bracketsStack.slice(lBracketsIndex+1, bracketsStack.length);
        bracketsStack.length = lBracketsIndex;
    }

    for(let i = 0; i < bracketsStack.length; i++)
    {
        if(bracketsStack[i] === "*" || bracketsStack[i] === "/")
        {
            let func = operations.get(bracketsStack[i]);
            multiplyStack.push(func(multiplyStack.pop(), Number(bracketsStack[i+1])));
            i++;
        }
        else    
            multiplyStack.push(operations.has(bracketsStack[i]) ? bracketsStack[i] : Number(bracketsStack[i]));
    }

    for(let i = 0; i < multiplyStack.length; i++)
    {
        if(multiplyStack[i] === "+" || multiplyStack[i] === "-")
        {
            let func = operations.get(multiplyStack[i]);
            sumStack.push(func(sumStack.pop(), multiplyStack[i+1]));
            i++;
        }
        else
            sumStack.push(Number(multiplyStack[i]));
    }

    return {value : sumStack.pop(), rest};
}

module.exports = {
    expressionCalculator
}
