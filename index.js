var calcApi = (function () {
    var res,
        num = [],
        calc = [],
        ops = [],
        val, el, sym, full = false;

    var core = {
        operate: function (sym) {
            var z;
            switch (sym) {
                case '+':
                    z = this.add(calc[0], calc[1]);
                    break;
                case '-':
                    z = this.sub(calc[0], calc[1]);
                    break;
                case 'x':
                    z = this.mul(calc[0], calc[1]);
                    break;
                case '/':
                    z = this.div(calc[0], calc[1]);
                    break;
            }
            return z;
        },
        add: function (a, b) {
            res = a + b;
            return this.result(res);
        },
        sub: function (a, b) {
            res = a - b;
            return this.result(res);
        },
        mul: function (a, b) {
            res = a * b;
            return this.result(res);
        },
        div: function (a, b) {
            res = a / b;
            return this.result(res);
        },
        clearAll: function (s) {
            num = [];
            calc = [];
            ops = [];
            s.html('0');
            $('p').removeClass('active');
        },
        clear: function (s) {
            num = [];
            s.html('0');
        },
        op: function (x, s) {
            if (x === 'AC') {
                this.clearAll(s);
            } else if (x === 'C') {
                this.clear(s);
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
            return x;
        },
        removeClass: function () {
            if (el !== undefined && el.hasClass('active')) {
                el.removeClass("active");
            }
        }
    };

    var publicApi = {
        ifNumbers: function (val, s) {
            //Set full to keep number to go over nine digits.
            num.length < 9 ? full = false : full = true;
            if (!full) {
                if (val === '.' && !num.includes('.')) {
                    if (num[0] > 0) {
                        num.push('.');
                        s.html(num.join(''));
                    } else if (num.length === 0) {
                        num.push(0);
                        num.push('.');
                        s.html(num.join(''));
                    }
                    core.removeClass();
                } else if (val === '0' && !num.includes('.') && num.length === 0) {
                    s.html('0');
                    core.removeClass();
                } else if (val !== '.') {
                    num.push(val);
                    s.html(num.join(''));
                    core.removeClass();
                }
            }
        },
        ifOperator: function (val, $this, s) {
            ops.push(val);
            //if number blocks abuse of multiple operator
            if (!isNaN(s.html()) && (el === undefined || !el.hasClass('active'))) {
                //when operator clicked, push screen first number to array.
                calc.push(parseFloat(s.html()));
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
                s.html(core.operate(ops[0]));
                ops.shift();
            }
        },
        ifEqual: function (s) {
            if (calc.length !== 0) {
                //when equal clicked, push second number from screen to array
                calc.push(parseFloat(s.html()) || 0);
                //selects operation and performs desired operation on the two numbers on array calc.
                s.html(core.operate(sym));
                calc = [];
                ops = [];
            }
        },
        ifClear: function (val, s) {
            core.op(val, s);
        }
    };
    return publicApi;
})();


(function ($, calc) {

    var $screen = $('#screen div'),
        $p = $('p');

    $p.mouseup(function () {
        $(this).toggleClass('clicked');
    }).mousedown(function () {
        $(this).toggleClass('clicked');
    });

    $p.on('click', function () {
        val = $(this).html();
        if (!isNaN(val) || val === '.') {
            calc.ifNumbers(val, $screen);
        } else if (val !== '=' && val !== 'C' && val !== 'AC') {
            calc.ifOperator(val, $(this), $screen);
        } else if (val === '=') {
            calc.ifEqual($screen);
        } else if (val === 'C' || val === 'AC') {
            calc.ifClear(val, $screen);
        }
    });
})(jQuery, calcApi);