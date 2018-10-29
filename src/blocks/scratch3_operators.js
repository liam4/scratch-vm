const Cast = require('../util/cast.js');
const MathUtil = require('../util/math-util.js');
const Decimal = require('decimal.js');

class Scratch3OperatorsBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            operator_add: this.add,
            operator_subtract: this.subtract,
            operator_multiply: this.multiply,
            operator_divide: this.divide,
            operator_lt: this.lt,
            operator_equals: this.equals,
            operator_gt: this.gt,
            operator_and: this.and,
            operator_or: this.or,
            operator_not: this.not,
            operator_random: this.random,
            operator_join: this.join,
            operator_letter_of: this.letterOf,
            operator_length: this.length,
            operator_contains: this.contains,
            operator_mod: this.mod,
            operator_round: this.round,
            operator_mathop: this.mathop
        };
    }

    add (args) {
        return +Decimal.add(Cast.toNumber(args.NUM1), Cast.toNumber(args.NUM2));
    }

    subtract (args) {
        return +Decimal.sub(Cast.toNumber(args.NUM1), Cast.toNumber(args.NUM2));
    }

    multiply (args) {
        return +Decimal.mul(Cast.toNumber(args.NUM1), Cast.toNumber(args.NUM2));
    }

    divide (args) {
        return +Decimal.div(Cast.toNumber(args.NUM1), Cast.toNumber(args.NUM2));
    }

    lt (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) < 0;
    }

    equals (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) === 0;
    }

    gt (args) {
        return Cast.compare(args.OPERAND1, args.OPERAND2) > 0;
    }

    and (args) {
        return Cast.toBoolean(args.OPERAND1) && Cast.toBoolean(args.OPERAND2);
    }

    or (args) {
        return Cast.toBoolean(args.OPERAND1) || Cast.toBoolean(args.OPERAND2);
    }

    not (args) {
        return !Cast.toBoolean(args.OPERAND);
    }

    random (args) {
        const nFrom = Cast.toNumber(args.FROM);
        const nTo = Cast.toNumber(args.TO);
        const low = nFrom <= nTo ? nFrom : nTo;
        const high = nFrom <= nTo ? nTo : nFrom;
        if (low === high) return low;
        // If both arguments are ints, truncate the result to an int.
        if (Cast.isInt(args.FROM) && Cast.isInt(args.TO)) {
            return low + Math.floor(Math.random() * ((high + 1) - low));
        }
        return (Math.random() * (high - low)) + low;
    }

    join (args) {
        return Cast.toString(args.STRING1) + Cast.toString(args.STRING2);
    }

    letterOf (args) {
        const index = Cast.toNumber(args.LETTER) - 1;
        const str = Cast.toString(args.STRING);
        // Out of bounds?
        if (index < 0 || index >= str.length) {
            return '';
        }
        return str.charAt(index);
    }

    length (args) {
        return Cast.toString(args.STRING).length;
    }

    contains (args) {
        const format = function (string) {
            return Cast.toString(string).toLowerCase();
        };
        return format(args.STRING1).includes(format(args.STRING2));
    }

    mod (args) {
        const n = Cast.toNumber(args.NUM1);
        const modulus = Cast.toNumber(args.NUM2);
        let result = Decimal.mod(n, modulus);
        // Scratch mod is kept positive.
        if (result / modulus < 0) result += modulus;
        return result;
    }

    round (args) {
        return Decimal.round(Cast.toNumber(args.NUM));
    }

    mathop (args) {
        const operator = Cast.toString(args.OPERATOR).toLowerCase();
        const n = Cast.toNumber(args.NUM);
        switch (operator) {
        case 'abs': return +Decimal.abs(n);
        case 'floor': return +Decimal.floor(n);
        case 'ceiling': return +Decimal.ceil(n);
        case 'sqrt': return +Decimal.sqrt(n);
        case 'sin': return parseFloat(Decimal.sin((Math.PI * n) / 180).toFixed(10));
        case 'cos': return parseFloat(Decimal.cos((Math.PI * n) / 180).toFixed(10));
        case 'tan': return MathUtil.tan(n);
        case 'asin': return (+Decimal.asin(n) * 180) / Math.PI;
        case 'acos': return (+Decimal.acos(n) * 180) / Math.PI;
        case 'atan': return (+Decimal.atan(n) * 180) / Math.PI;
        case 'ln': return Decimal.log(n);
        case 'log': return Decimal.log(n) / Math.LN10;
        case 'e ^': return Decimal.exp(n);
        case '10 ^': return Decimal.pow(10, n);
        }
        return 0;
    }
}

module.exports = Scratch3OperatorsBlocks;
