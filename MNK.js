module.exports = function calculateMNK({dots = '', from, to}){
    dots = dots.split(' ').map( element => +element);
    from = parsePI(from);
    to = parsePI(to);
    let step = (to - from) / (dots.length - 1);

    let result = {
        x: [],
        mnk: [],
    };
    for(let i = from; i <= to; i += step) result.x.push(+i.toFixed(3));

    const calculator = calculateSum(result.x, dots);
    const sumObject = {
        s00: calculator(''),
        s10: calculator('x'),
        s20: calculator('x^2'),
        s30: calculator('x^3'),
        s40: calculator('x^4'),
        s01: calculator('y'),
        s11: calculator('x*y'),
        s21: calculator('x^2*y'),
    }

    const a = calculateMNKA(sumObject);
    const b = calculateMNKB(sumObject);
    const c = calculateMNKC(sumObject);

    result.x.forEach( x => {
        result.mnk.push(calculateResultY(x, a, b, c));
    });

    return result;
}

function calculateSum(arrayX, arrayY){
    return function(action = ''){
        switch(action){
            case 'x':
                return arrayX.reduce((sum, x) => sum += x, 0);
            case 'x^2':
                return arrayX.reduce((sum, x) => sum += Math.pow(x, 2), 0);
            case 'x^3':
                return arrayX.reduce((sum, x) => sum += Math.pow(x, 3), 0);
            case 'x^4':
                return arrayX.reduce((sum, x) => sum += Math.pow(x, 4), 0);
            case 'y':
                return arrayY.reduce((sum, y) => sum += y, 0);
            case 'x*y':
                return arrayX.reduce((sum, x, index) => sum += x * arrayY[index], 0);
            case 'x^2*y':
                return arrayX.reduce((sum, x, index) => sum += Math.pow(x, 2) * arrayY[index], 0);
            case '':
                return arrayX.length == arrayY.length ? arrayX.length : 'X and Y array are not equal!';
            default:
                return 'Unknown action';
        }
    }
}

function calculateMNKA({s00, s10, s20, s30, s40, s01, s11, s21}){
    return (
        s40 * (s20 * s01 - s10 * s11) - 
        s30 * (s30 * s01 - s10 * s21) + 
        s20 * (s30 * s11 - s20 * s21) /
        (
            s40 * (s20 * s00 - s10 * s10) - 
            s30 * (s30 * s00 - s10 * s20) + 
            s20 * (s30 * s10 - s20 * s20)
        )
    );
}

function calculateMNKB({s00, s10, s20, s30, s40, s01, s11, s21}){
    return (
        s40 * (s11 * s00 - s01 * s10) - 
        s30 * (s21 * s00 - s01 * s20) +
        s20 * (s21 * s10 - s11 * s20) / 
        (
            s40 * (s20 * s00 - s10 * s10) - 
            s30 * (s30 * s00 - s10 * s20) + 
            s20 * (s30 * s10 - s20 * s20)
        )
    );
}

function calculateMNKC({s00, s10, s20, s30, s40, s01, s11, s21}){
    return (
        s21 * (s20 * s00 - s10 * s10) -
        s11 * (s30 * s00 - s10 * s20) +
        s01 * (s30 * s10 - s20 * s20) /
        (
            s40 * (s20 * s00 - s10 * s10) -
            s30 * (s30 * s00 - s10 * s20) +
            s20 * (s30 * s10 - s20 * s20)
        )
    );
}

function calculateResultY(x, a, b, c){
    return a + b * x + Math.pow(x, 2) * c;
}

function parsePI(string = ''){
    if(!/pi/i.test(string)) return +string;

    return /^-?pi$/i.test(string) ? +string.replace(/pi/i, Math.PI) : +string.match(/-?\d+(?:\.\d+)?(?=pi)/i)[0] * Math.PI;
}