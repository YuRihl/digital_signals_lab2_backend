const fs = require('fs');

module.exports = function calculateFullFourier({dots, from, to}){
    dots = dots.split(' ').map(element => +element);
    from = parsePI(from);
    to = parsePI(to);
    let step = (to - from) / (dots.length - 1);

    let result = {
        x: [],
        fourier: [],
    };

    for(let x = from; x <= to; x += step){
        result.x.push(+x.toFixed(3));
    }

    for(let x = from; x <= to; x += step){
        result.fourier.push(+calculateFourier(result.x, dots, x).toFixed(3));
    }

    fs.appendFileSync('fourier.txt', `Average innacuracy is ${Math.abs(dots.reduce( (sum, element) => sum += +element, 0) / dots.length 
    - result.fourier.reduce( (sum, element) => sum += element, 0) / result.fourier.length)}`);

    return result;
}

function calculateFourier(x, y, currentX){
    const a0 = calculateA({x, y, i: 0});
    const a = [];
    const b = [];

    let sum = 0;
    for(let i = 1; i < x.length; i++){
        a.push(calculateA({x, y, i}));
        b.push(calculateB({x, y, i}));

        sum += a[a.length - 1] * Math.cos(i * currentX) + b[b.length - 1] * Math.sin(i * currentX);
    }

    // writeFile('fourier.txt', a0, a, b);
    
    return a0 / 2 + sum;
}

function calculateA({x, y, i}){
    return y.length == x.length ? (2.0 / y.length) * y.reduce((sum, y, index) => sum += y * Math.cos(i * x[index]), 0)
        :'X and Y arrays are not equal!';
}

function calculateB({x, y, i}){
    return y.length == x.length ? (2.0 / y.length) * y.reduce((sum, y, index) => sum += y * Math.sin(i * x[index]), 0)
    :'X and Y arrays are not equal!';
}

function writeFile(filename = '', ...data){
    let [a0, a, b] = data;

    fs.writeFileSync(filename, `a[0] = ${a0}    b[0] = 0\n`);

    a.forEach((element, index) => {
        fs.appendFile(filename, `a[${index}] = ${element}    b[${index}] = ${b[index]}\n`)
    });
}

function parsePI(string = ''){
    if(!/pi/i.test(string)) return +string;

    return /^-?pi$/i.test(string) ? +string.replace(/pi/i, Math.PI) : +string.match(/-?\d+(?:\.\d+)?(?=pi)/i)[0] * Math.PI;
}