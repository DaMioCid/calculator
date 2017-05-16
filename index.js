$(function () {
    var $screen = $('#screen div'),
        $p = $('p'),
        num = [],
        calc = [],
        ops = [],
        val, el, sym, full = false;

    $p.mouseup(function () {
        $(this).toggleClass('clicked');
    }).mousedown(function () {
        $(this).toggleClass('clicked');
    });

    $p.on('click', function () {
        val = $(this).html();
        if (!isNaN(val) || val === '.') {
            ifNumbers(val);
        } else if (val !== '=' && val !== 'C' && val !== 'AC') {
            ifOperator(val, $(this));
        } else if (val === '=' && calc.length !== 0) {
            ifEqual();
        } else if (val === 'C' || val === 'AC') {
            calcApi.op(val);
        }
    });
    function ifNumbers(val) {
        //Set full to keep number to go over nine digits.
        num.length < 9 ? full = false : full = true;
        if (!full) {
            if (val === '.' && !num.includes('.')) {
                if (num[0] > 0) {
                    num.push('.');
                    calcApi.screen(num.join(''));
                } else if (num.length === 0) {
                    num.push(0);
                    num.push('.');
                    calcApi.screen(num.join(''));
                }
                calcApi.removeClass();
            } else if (val === '0' && !num.includes('.') && num.length === 0) {
                $screen.html('0');
                calcApi.removeClass();
            } else if (val !== '.') {
                num.push(val);
                calcApi.screen(num.join(''));
                calcApi.removeClass();
            }
        }

    }
    function ifOperator(val, $this) {
        ops.push(val);
        //if number blocks abuse of multiple operator
        if (!isNaN($screen.html()) && (el === undefined || !el.hasClass('active'))) {
            //when operator clicked, push screen first number to array.
            calc.push(parseFloat($screen.html()));
        }
        if (el !== undefined && el.hasClass('active')) {
            ops.shift();
            el.removeClass('active');
        }
        num = [];
        el = $this;
        el.addClass("active");
        sym = val;
        if (calc.length === 2) {
            calcApi.operate(ops[0]);
            ops.shift();
        }
    }
    function ifEqual() {
        //when equal clicked, push second number from screen to array
        calc.push(parseFloat($screen.html()) || 0);
        //selects operation and performs desired operation on the two numbers on array calc.
        calcApi.operate(sym);
        calc = [];
        ops = [];
    }
    var calcApi = {
        operate: function (sym) {
            switch (sym) {
                case '+':
                    calcApi.add(calc[0], calc[1]);
                    break;
                case '-':
                    calcApi.sub(calc[0], calc[1]);
                    break;
                case 'x':
                    calcApi.mul(calc[0], calc[1]);
                    break;
                case '/':
                    calcApi.div(calc[0], calc[1]);
                    break;
            }
        },
        res: 0,
        add: function (a, b) {
            res = a + b;
            calcApi.result(res);
        },
        sub: function (a, b) {
            res = a - b;
            calcApi.result(res);
        },
        mul: function (a, b) {
            res = a * b;
            calcApi.result(res);
        },
        div: function (a, b) {
            res = a / b;
            calcApi.result(res);
        },
        clearAll: function () {
            num = [];
            calc = [];
            ops = [];
            $screen.html('0');
            $('p').removeClass('active');
        },
        clear: function () {
            num = [];
            $screen.html('0');
        },
        op: function (x) {
            if (x === 'AC') {
                calcApi.clearAll();
            } else if (x === 'C') {
                calcApi.clear();
                if (calc.length !== 0) {
                    el.addClass("active");
                }
            }
        },
        result: function (x) {
            var y = x.toString();
            if (y.length > 9) {
                x = x.toPrecision(9).replace(/(\.[0-9]*[1-9])0*|(\.0*)/, "$1");
                if ((x.includes('.') && x.includes('e')) || x < 1) {
                    x = parseFloat(y).toPrecision(5).replace(/(\.[0-9]*[1-9])0*|(\.0*)/, "$1");
                }
            }
            num = [];
            calc = [];
            calc.push(x);
            $screen.html(x);
        },
        screen: function (x) {
            $screen.html(x);
        },
        removeClass: function () {
            if (el !== undefined && el.hasClass('active')) {
                el.removeClass("active");
            }
        }
    };
});