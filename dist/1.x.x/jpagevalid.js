/*!
 * jPagevalid ©
 * @version 1.0.0
 * @author salvatore mariniello - salvo.mariniello@gmail.com 
 * https://github.com/mssalvo/jPagevalid 
 * MIT License
 * Copyright (c) 2019 Salvatore Mariniello
 * https://github.com/mssalvo/jPagevalid/blob/master/LICENSE
 *  
 **/

if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach = function (action, that) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
;
String.prototype.Obj = function () {
    var d = this;
    if (d.indexOf('{') < 0) {
        d = "{" + d + "}";
    }
    d = eval('(' + d + ')');
    return d;
};
function jPagevalid() {
    this.name = arguments[0] || false;
    this.submit = true;
    this.send = false;
    this.inputs = [];
}
jPagevalid.forms = {};
jPagevalid.addValidation = function (fnname/*<nome della funzione>*/, fnCall/*<funzione>*/, msg/*<messaggio>*/) {
    jPagevalid.prototype.partFn[fnname] = {fn: fnCall, message: msg};
    return jPagevalid;
};
jPagevalid.prototype.partFn = {
    email: {fn: function (v) {
            return /[a-z]+@[a-z]+\.[a-z]+/.test(v)
        }, message: 'Sintassi Email email, non valida'},
    number: {fn: function (v) {
            return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v)
        }, message: 'Solo caratteri numerici, accetta segno negativo (-), migliaia (,) decimali (.)'},
    interger: {fn: function (v) {
            return /^-?\d+$/.test(v)
        }, message: 'Solo numeri negativi e positivi non decimale per favore'},
    required: {fn: function (v) {
            return (/^([\s])*$/.test(v) === false);
        }, message: 'Campo Obbligatorio'},
    alphanumeric: {fn: function (v) {
            return /^\w+$/i.test(v)
        }, message: 'Solo lettere, numeri e caratteri di sottolineatura'},
    time: {fn: function (v) {
            return /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(v)
        }, message: 'Inserisci un orario valido, tra le 00:00 e le 23:59'},
    time12: {fn: function (v) {
            return /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(v)
        }, message: 'Inserisci un orario valido nel formato 12 ore am / pm'},
    cap: {fn: function (v) {
            return /^\d{5}$/.test(v)
        }, message: 'Si prega di specificare un codice postale valido'},
    date: {fn: function (v) {
            var isCheckData = false,
                    regex1 = /^\d{2}\/\d{2}\/\d{4}$/,
                    regex2 = /^\d{2}\-\d{2}\-\d{4}$/,
                    adata,bdata, gg, mm, aaaa;
            if (regex1.test(v)) {
                adata = v.split("/");
                gg = parseInt(adata[ 0 ], 10);
                mm = parseInt(adata[ 1 ], 10);
                aaaa = parseInt(adata[ 2 ], 10);
                bdata = new Date(Date.UTC(aaaa, mm - 1, gg, 12, 0, 0, 0));
                if ((bdata.getUTCFullYear() === aaaa) && (bdata.getUTCMonth() === mm - 1) && (bdata.getUTCDate() === gg)) {
                    isCheckData = true;
                } else {
                    isCheckData = false;
                }
            } else if (regex2.test(v)) {
                adata = v.split("-");
                gg = parseInt(adata[ 0 ], 10);
                mm = parseInt(adata[ 1 ], 10);
                aaaa = parseInt(adata[ 2 ], 10);
                bdata = new Date(Date.UTC(aaaa, mm - 1, gg, 12, 0, 0, 0));
                if ((bdata.getUTCFullYear() === aaaa) && (bdata.getUTCMonth() === mm - 1) && (bdata.getUTCDate() === gg)) {
                    isCheckData = true;
                } else {
                    isCheckData = false;
                }
            } else {
                isCheckData = false;
            }
            return  isCheckData;
        }, message: 'Si prega di specificare un formato data valido (GG-MM-AAAA) (GG/MM/AAAA)'}

};
jPagevalid.prototype.changeFnMessage = function (fnname/*<nome della funzione>*/, msg/*<messaggio>*/) {
    this.partFn[fnname].message = msg;
    return this;
};
 
jPagevalid.prototype.addValidation = function (fnname/*<nome della funzione>*/, fnCall/*<funzione>*/, msg/*<messaggio>*/) {
    this.partFn[fnname] = {fn: fnCall, message: msg};
    return this;
};
jPagevalid.prototype.clearById = function (/*<cerca per il singolo id se presente come argomento o Tutti>*/) {
    var t__ = this;
    if (typeof arguments[0] !== "undefined" && typeof arguments[0] === "string") {
        for (var x in t__.inputs) {
            if (t__.inputs[x].elName === arguments[0]) {
                var input = t__.inputs[x];
                var element = input.elObj;
                var elementBoxError = input.elError || {innerHTML: ''};

                if (element.classList) {
                    element.classList.remove(input.classNotValid);
                } else {
                    element.className = element.className.replace(/\input.classNotValid\b/g, "");
                }
                if (element.classList) {
                    element.classList.remove(input.classValid);
                } else {
                    element.className = element.className.replace(/\input.classValid\b/g, "");
                }
                elementBoxError.innerHTML = "";
                return input;
            }
        }
    }
};
jPagevalid.prototype.valid = function (/*<cerca per il singolo id se presente come argomento o Tutti>*/) {
    var t__ = this;
    if (typeof arguments[0] !== "undefined" && typeof arguments[0] === "string") {
        for (var x in this.inputs) {
            if (this.inputs[x].elName === arguments[0]) {
                return this.process(x);
            }
        }
    } else {
        for (var x in this.inputs) {
            (function (x) {
                t__.process(x)
            })(x);
        }
        for (var i in this.inputs) {
            if (!this.inputs[i].valid)
                return false;
        }
        return true;
    }
};
jPagevalid.prototype.process = function (x) {
    this.inputs[x].valid = true;
    var input = this.inputs[x];
    var element = input.elObj;
    var elementBoxError = input.elError || {innerHTML: ''};
    input.message = input.messageOrigin;
    if (input.classNotValid !== input.classNotValidOrigin) {
        if (element.classList) {
            element.classList.remove(input.classNotValid);
        } else {
            element.className = element.className.replace(/\input.classNotValid\b/g, "");
        }
    }
    if (input.classValid !== input.classValidOrigin) {
        if (element.classList) {
            element.classList.remove(input.classValid);
        } else {
            element.className = element.className.replace(/\input.classValid\b/g, "");
        }
    }
    input.classNotValid = input.classNotValidOrigin;
    input.classValid = input.classValidOrigin;
    var types = input.validateType.toLowerCase().split(' ').join('').split(',');
    var isRequired = types.join('').indexOf('required') === -1 ? false : true;
    for (var t in types) {
        if ((isRequired && typeof (types[t]) !== "undefined") || (!isRequired && element.value !== "") && typeof (types[t]) !== "undefined") {
            elementBoxError.innerHTML = "";
            if (types[t] === 'required' && element.type.toLowerCase() === 'checkbox' || element.type.toLowerCase() === 'radio') {
                if (!element.checked)
                {
                    this.inputs[x].valid = false;
                    elementBoxError.innerHTML = input.message || this.partFn[types[t]].message  /*input.message*/
                    return this.inputs[x].valid
                }
            }
            if (!this.partFn[types[t]].fn.apply(element, [element.value, this.partFn[types[t]].message, input])) {
                this.inputs[x].valid = false;
                elementBoxError.innerHTML = input.message || this.partFn[types[t]].message  /*input.message*/
                if (element.classList) {
                    element.classList.remove(input.classValid);
                    element.classList.add(input.classNotValid);
                } else {
                    element.className = element.className.replace(/\input.classValid\b/g, "");
                    if (element.className.split(" ").indexOf(input.classNotValid) == -1) {
                        element.className += " " + input.classNotValid;
                    }
                }
                return this.inputs[x].valid;
            } else {
                if (element.classList) {
                    element.classList.remove(input.classNotValid);
                    element.classList.add(input.classValid);
                } else {
                    element.className = element.className.replace(/\input.classNotValid\b/g, "");
                    if (element.className.split(" ").indexOf(input.classValid) == -1) {
                        element.className += " " + input.classValid;
                    }
                }
            }
        } else if (!isRequired) {
            if (element.classList) {
                element.classList.remove(input.classNotValid);
                element.classList.add(input.classValid);
            } else {
                element.className = element.className.replace(/\input.classNotValid\b/g, "");
                if (element.className.split(" ").indexOf(input.classValid) == -1) {
                    element.className += " " + input.classValid;
                }
            }
            elementBoxError.innerHTML = "";
        }
    }
    if (input.validateFn !== undefined)
    {
        elementBoxError.innerHTML = "";
        var fn = function () {};
        if (typeof (input.validateFn) === "string")
            fn = eval(input.validateFn);
        if (typeof (input.validateFn) === "function")
            fn = input.validateFn;
        if (!fn.apply(element, [element.value, input.message, input]))
        {
            this.inputs[x].valid = false;
            elementBoxError.innerHTML = input.message || ''
            if (element.classList) {
                element.classList.remove(input.classValid);
                element.classList.add(input.classNotValid);
            } else {
                element.className = element.className.replace(/\input.classValid\b/g, "");
                if (element.className.split(" ").indexOf(input.classNotValid) == -1) {
                    element.className += " " + input.classNotValid;
                }
            }
        } else {
            this.inputs[x].valid = true;
            if (element.classList) {
                element.classList.remove(input.classNotValid);
                element.classList.add(input.classValid);
            } else {
                element.className = element.className.replace(/\input.classNotValid\b/g, "");
                if (element.className.split(" ").indexOf(input.classValid) == -1) {
                    element.className += " " + input.classValid;
                }
            }
        }
    }
    return this.inputs[x].valid;
};
jPagevalid.prototype.addInput = function (obj) {
    var t__ = this;
    try {
        if (typeof (obj.input) === "string") {
            obj.input = document.getElementById(obj.input); /*MS querySelector*/
            if (obj.input) {
                if (typeof (obj.focus) === "undefined" || typeof (obj.focus) === "boolean" && obj.focus)
                    obj.input.addEventListener('focus', function () {
                        t__.eventFocus(obj.input)
                    }, false);
                if (typeof (obj.blur) === "undefined" || typeof (obj.blur) === "boolean" && obj.blur)
                    obj.input.addEventListener('blur', function () {
                        t__.eventBlur(obj.input)
                    }, false);
                if (typeof (obj.keyup) === "boolean" && obj.keyup)
                    obj.input.addEventListener('keyup', function () {
                        t__.eventBlur(obj.input)
                    }, false);
                if (typeof (obj.keypress) === "boolean" && obj.keypress)
                    obj.input.addEventListener('keypress', function () {
                        t__.eventBlur(obj.input)
                    }, false);
                t__.inputs.push(new Obj(obj.input, obj.boxErr, obj.message || '', obj.type, obj.valid, obj.name || obj.input.id, obj.classNotValid, obj.classValid, obj.keyup, obj.keypress, obj.blur, obj.focus))
            }
        } else {
            obj.input.id = obj.input.id || 'jms-' + Math.floor(Math.random() * 5500) + '-' + Math.floor(Math.random() * 10000);
            t__.inputs.push(new Obj(obj.input, obj.boxErr, obj.message || '', obj.type, obj.valid, obj.name || obj.input.id, obj.classNotValid, obj.classValid, obj.keyup, obj.keypress, obj.blur, obj.focus))
        }
    } catch (err) {
    }
    return t__;
};
jPagevalid.prototype.include = function (d) {
    var t__ = this;
    var frm = undefined;
    if (typeof d !== "undefined" && typeof d === "string")
        frm = document.getElementById(d);
    var doc = frm || document;

    Array.prototype.forEach.call(doc.querySelectorAll('[jms-valid]'), function (el, i) {
        try {
            var objVal = el.getAttribute("jms-valid").Obj();
            objVal.input = el;
            t__.addInput(objVal);
            el.removeAttribute('jms-valid');
            if (typeof (objVal.focus) === "undefined" || typeof (objVal.focus) === "boolean" && objVal.focus)
                el.addEventListener('focus', function () {
                    t__.eventFocus(el)
                }, false);
            if (typeof (objVal.blur) === "undefined" || typeof (objVal.blur) === "boolean" && objVal.blur)
                el.addEventListener('blur', function () {
                    t__.eventBlur(el)
                }, false);
            if (typeof (objVal.keyup) === "boolean" && objVal.keyup)
                el.addEventListener('keyup', function () {
                    t__.eventBlur(el)
                }, false);
            if (typeof (objVal.keypress) === "boolean" && objVal.keypress)
                el.addEventListener('keypress', function () {
                    t__.eventBlur(el)
                }, false);
        } catch (err) {
        }
    });
    if (arguments.length > 1 && typeof (arguments[1]) === "string") {
        var f = document.getElementById(arguments[1]);
        if (f && typeof (f.tagName) !== "undefined" && String(f.tagName).toUpperCase() === "FORM")
            f.onsubmit = function () {
                return t__.send ? t__.execute(true) : t__.submit ? t__.valid() : t__.execute(false);
            }
    }
    return t__;
};
jPagevalid.prototype.eventFocus = function (a) {
    var t__ = this;
    t__.clearById(a.id);
};
jPagevalid.prototype.eventBlur = function (o) {
    var t__ = this;
    t__.valid(o.id);
};
jPagevalid.prototype.removeAndInclude = function (d) {
    var t__ = this;
    t__.inputs = [];
    var doc = d || document;
    Array.prototype.forEach.call(doc.querySelectorAll('[jms-valid]'), function (el, i) {
        t__.addInput(el.getAttribute("jms-valid").Obj());
        el.removeAttribute('jms-valid');
    });
    return t__;
};
jPagevalid.prototype.execute = function (b) {
    var t__ = this;
    t__.valid();
    return b;
};
jPagevalid.prototype.isSubmit = function (b) {
    this.submit = b;
    this.send = false;
    return this;
};
jPagevalid.prototype.authorizeSend = function () {
    this.send = true;
    return this;
};
jPagevalid.prototype.removeAll = function () {
    this.inputs = [];
    return this;
};
jPagevalid.prototype.form = function (/*form o object-valid*/) {
    var t__ = this;
    if (typeof (arguments[0]) === "undefined")
    {
        return t__.include(t__.name, t__.name);
    } else if (typeof (arguments[0]) === "string")
    {
        return t__.include(arguments[0], arguments[0]);
    } else if (typeof (arguments[0]) === "object")
    {
        var inputs = (typeof (arguments[0].inputs) === "undefined") ? [] : arguments[0].inputs;
        for (var i in inputs)
            (function (a) {
                t__.addInput(a)
            })(inputs[i]);


        if (arguments.length > 0 && typeof (arguments[0].form) === "string") {
            var f = document.getElementById(arguments[0].form);
            if (f && typeof (f.tagName) !== "undefined" && String(f.tagName).toUpperCase() === "FORM")
                if (typeof (arguments[0].submit) === "undefined" || (typeof (arguments[0].submit) === "boolean" && arguments[0].submit))
                    f.onsubmit = function () {
                        return t__.send ? t__.execute(true) : t__.submit ? t__.valid() : t__.execute(false);
                    }
        }
        return t__;
    }
};
var Obj = function (input, boxErr, message, validType, validCallback, name, classNotValid, classValid, keyup, keypress, blur, focus) {
    this.elObj = input;
    this.elError = boxErr ? document.getElementById(boxErr) : {innerHTML: ''};
    this.message = message || '';
    this.messageOrigin = message || '';
    this.validateType = validType || '';
    this.validateFn = validCallback || undefined;
    this.elName = name || new Date().getTime();
    this.classNotValid = classNotValid || 'is-invalid';
    this.classValid = classValid || 'is-valid';
    this.classNotValidOrigin = classNotValid || 'is-invalid';
    this.classValidOrigin = classValid || 'is-valid';
    this.keyup = typeof (keyup) === "boolean" ? keyup : false;
    this.keypress = typeof (keypress) === "boolean" ? keypress : false;
    this.blur = typeof (blur) === "boolean" ? blur : true;
    this.focus = typeof (focus) === "boolean" ? focus : true;
    this.valid = true;
};
jPagevalid.get = function (n) {
    if (typeof (n) === "undefined")
        n = new Date().getTime();
    if (typeof (jPagevalid.forms[n]) === "undefined")
        jPagevalid.forms[n] = new jPagevalid(n);
    return jPagevalid.forms[n];
};
jPagevalid.form = function (/*form o object-valid*/) {

    if (typeof (arguments[0]) === "string")
    {
        return jPagevalid.get(arguments[0]).include(arguments[0], arguments[0]);
    } else if (typeof (arguments[0]) === "object")
    {
        var jvalid = jPagevalid.get((typeof (arguments[0].form) === "undefined") ? undefined : arguments[0].form)

        var inputs = (typeof (arguments[0].inputs) === "undefined") ? [] : arguments[0].inputs;
        for (var i in inputs)
            (function (a) {
                jvalid.addInput(a)
            })(inputs[i]);

        if (arguments.length > 0 && typeof (arguments[0].form) === "string") {
            var f = document.getElementById(arguments[0].form);
            if (f && typeof (f.tagName) !== "undefined" && String(f.tagName).toUpperCase() === "FORM")
                if (typeof (arguments[0].submit) === "undefined" || (typeof (arguments[0].submit) === "boolean" && arguments[0].submit))
                    f.onsubmit = function () {
                        return jvalid.send ? jvalid.execute(true) : jvalid.submit ? jvalid.valid() : jvalid.execute(false);
                    }
        }
        return jvalid;
    }
};
