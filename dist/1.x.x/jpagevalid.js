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
    this.fnChange = undefined;
    this.btnSubmits = [];
    this.isEnabledSubmits = false;
}
jPagevalid.forms = {};
jPagevalid.addValidation = function (fnname/*<nome della funzione>*/, fnCall/*<funzione>*/, msg/*<messaggio>*/) {
    jPagevalid.prototype.partFn[fnname] = {fn: fnCall, message: msg};
    return jPagevalid;
};
jPagevalid.prototype.partFn = {
    email: {fn: function (v) {
            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,12}$/.test(v)
        }, message: 'Si prega di specificare un email valida per favore'},
    number: {fn: function (v) {
            return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v)
        }, message: 'Solo caratteri numerici, accetta segno negativo (-), migliaia (,) decimali (.)'},
    interger: {fn: function (v) {
            return /^-?\d+$/.test(v)
        }, message: 'Solo numeri negativi e positivi non decimale per favore'},
    required: {fn: function (v) {
            return (/^([\s])*$/.test(v) === false);
        }, message: 'Campo Obbligatorio'},
    checkto: {fn: function (v) {
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
    equals: {fn: function (f, i, p) {
            return f(i, p);
        }, message: 'Il valore inserito non coincide con quello atteso'},
    valid: {fn: function () {
            var bbol = this.internCheckValid();
            this.fnEnabledSubmits();
            return bbol;
        }, message: ''},
    date: {fn: function (v) {
            var isCheckData = false,
                    regex1 = /^\d{2}\/\d{2}\/\d{4}$/,
                    regex2 = /^\d{2}\-\d{2}\-\d{4}$/,
                    adata, bdata, gg, mm, aaaa;
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
jPagevalid.prototype.isAllEqualsTo = function (input, inputs) {
    var isVal = true;
    var inputsId = input.equalsTo.split(',');
    for (var j in inputsId) {
        for (var i in inputs) {
            if (inputs[i].elName == inputsId[j] && (inputs[i].elObj.type.toLowerCase() === 'checkbox' || inputs[i].elObj.type.toLowerCase() === 'radio') && (input.elObj.type.toLowerCase() === 'checkbox' || input.elObj.type.toLowerCase() === 'radio'))
                isVal = (inputs[i].elObj.checked == input.elObj.checked);
            else if (input.elName != inputs[i].elName && inputs[i].elName == inputsId[j] && inputs[i].elObj.value !== input.elObj.value)
                isVal = false;
        }
    }
    return isVal;
};
jPagevalid.prototype.allValid = function () {
    for (var i in this.inputs) {
        if (!this.inputs[i].valid)
            return false;
    }
    return true;
};
jPagevalid.prototype.executeOnChange = function (o) {
    var t__ = this;
    if (typeof t__.fnChange === "function") {
        t__.fnChange.apply(t__, [t__.allValid(), o, function (id) {
                var el = undefined;
                t__.inputs.forEach(function (e) {
                    if (id == e.elName)
                        el = e.elObj;
                });
                return el || document.querySelector('#'+id) || document.createElement('input')
            }]);
    }
    if (t__.isEnabledSubmits)
        t__.fnEnabledSubmits();

    return this;
};
jPagevalid.prototype.checkOffSubmit = function () {
    this.isEnabledSubmits = false;
    return this;
};
jPagevalid.prototype.checkOnSubmit = function () {
    if(typeof arguments[0]!=="undefined")
    {
     var btn=document.getElementById(arguments[0]) || document.querySelector(arguments[0]) || document.createElement('button');
     if(btn)
     this.btnSubmits.push(btn)   
    }    
    this.isEnabledSubmits = true;
    this.fnEnabledSubmits();
    return this;
};
jPagevalid.prototype.fnEnabledSubmits = function () {
    var t__ = this;
    if (t__.isEnabledSubmits)
    {
        t__.btnSubmits.forEach(function (el) {
            if (!t__.allValid())
                el.disabled = true;
            else
                el.disabled = false;
        })

    }

};
jPagevalid.prototype.onChange = function (fn) {
    this.fnChange = fn;
    return this;
};
jPagevalid.prototype.changeFnMessage = function (fnname/*<nome della funzione>*/, msg/*<messaggio>*/) {
    this.partFn[fnname].message = msg;
    return this;
};

jPagevalid.prototype.addValidation = function (fnname/*<nome della funzione>*/, fnCall/*<funzione>*/, msg/*<messaggio>*/) {
    if (fnname !== "equals" && fnname !== "valid" && fnname !== "checkto")
        this.partFn[fnname] = {fn: fnCall, message: msg};
    return this;
};
jPagevalid.prototype.clearById = function (/*<elimina le classi di validazioni ed il messaggio prodotto>*/) {
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
jPagevalid.prototype.internCheckValid = function (/*<cerca per il singolo id se presente come argomento o Tutti>*/) {
    var t__ = this;
    if (typeof arguments[0] !== "undefined" && typeof arguments[0] === "string") {
        for (var x in this.inputs) {
            if (this.inputs[x].elName === arguments[0]) {
                return this.intern_process_private(x);
            }
        }
    } else {
        for (var x in this.inputs) {
            (function (x) {
                t__.intern_process_private(x)
            })(x);
        }
        for (var i in this.inputs) {
            if (!this.inputs[i].valid)
                return false;
        }
        return true;
    }
};
jPagevalid.prototype.intern_process_private = function (x) {
    this.inputs[x].valid = true;
    var input = this.inputs[x];
    var element = input.elObj;
    var elementBoxError = input.elError || {innerHTML: ''};
    var inputsObj = this.inputs;
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
    var isRequiredIF_ = this.isRequiredIf(input);
    for (var t in types) {
        if ((isRequired && typeof (types[t]) !== "undefined") || (!isRequired && element.value !== "" && typeof (types[t]) !== "undefined")
                || (element.type.toLowerCase() === 'checkbox' || element.type.toLowerCase() === 'radio' && types[t] === "equals")
                || isRequiredIF_ || types[t] === "valid") {
            elementBoxError.innerHTML = "";
            if ((types[t] === 'required' || isRequiredIF_ || types[t] === 'valid') && (element.type.toLowerCase() === 'checkbox' || element.type.toLowerCase() === 'radio')) {
                if (!element.checked && types[t] !== 'valid')
                {
                    this.inputs[x].valid = false;
                    elementBoxError.innerHTML = input.message || this.partFn[types[t]].message  /*input.message*/
                    return this.inputs[x].valid
                }
                return this.inputs[x].valid
            }
            var t__ = this;
            if (types[t] !== "equals" && types[t] !== "valid" && !this.partFn[types[t]].fn.apply(element, [element.value, this.partFn[types[t]].message, input, function (id) {
                    var el = undefined;
                    inputsObj.forEach(function (e) {
                        if (id == e.elName)
                            el = e.elObj;
                    });
                    return el || document.querySelector('#'+id) || document.createElement('input')
                }]) || types[t] === "equals" && !this.partFn[types[t]].fn.apply(element, [t__.isAllEqualsTo, input, t__.inputs])) {
                if (types[t] === "valid")
                    return true;
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
        if (!fn.apply(element, [element.value, input.message, input, function (id) {
                var el = undefined;
                inputsObj.forEach(function (e) {
                    if (id == e.elName)
                        el = e.elObj;
                });
                return el ||  document.querySelector('#'+id) || document.createElement('input')
            }]))
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
jPagevalid.prototype.isRequiredIf = function (input) {
    var t__=this;
    if (typeof input.requiredIf === "object") {
        if (input.requiredIf.type === "def") {
            return false;
        } else if (input.requiredIf.type.toLowerCase() === 'checkbox' || input.requiredIf.type.toLowerCase() === 'radio')
        {
            return input.requiredIf.checked;
        } else if (input.requiredIf.tagName.toLowerCase() === 'input' && input.requiredIf.type.toLowerCase() === 'text')
        {
            return input.requiredIf.value.length > 0;
        } else if (input.requiredIf.tagName.toLowerCase() === 'select')
        {
            return input.requiredIf.value.length > 0;
        } else
        {
            return false;
        }
    } else if (typeof input.requiredIf === "function")
    {
        return input.requiredIf.apply(this, [function (id) {
                    var el = undefined;
                    t__.inputs.forEach(function (e) {
                        if (id == e.elName)
                            el = e.elObj;
                    });
                    return el ||  document.querySelector('#'+id) || document.createElement('input')}])
    } else
    {
        return false;
    }
};
jPagevalid.prototype.process = function (x) {
    this.inputs[x].valid = true;
    var input = this.inputs[x];
    var element = input.elObj;
    var elementBoxError = input.elError || {innerHTML: ''};
    var inputsObj = this.inputs;
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
        var isRequiredIF_ = this.isRequiredIf(input);
        if ((isRequired && typeof (types[t]) !== "undefined") || (!isRequired && element.value !== "" && typeof (types[t]) !== "undefined")
                || (element.type.toLowerCase() === 'checkbox' || element.type.toLowerCase() === 'radio' && types[t] === "equals")
                || isRequiredIF_ || types[t] === "valid") {
            elementBoxError.innerHTML = "";
            if ((types[t] === 'required' || isRequiredIF_ || types[t] === 'valid') && (element.type.toLowerCase() === 'checkbox' || element.type.toLowerCase() === 'radio')) {
                if (!element.checked && types[t] !== 'valid')
                {
                    this.inputs[x].valid = false;
                    elementBoxError.innerHTML = input.message || this.partFn[types[t]].message  /*input.message*/
                    return this.inputs[x].valid
                } else if (types[t] === 'valid') {
                    this.partFn.valid.fn.apply(this, [])
                }
                this.fnEnabledSubmits();
                return this.inputs[x].valid
            }
            var t__ = this;
            if (types[t] !== "equals" && types[t] !== "valid" && !this.partFn[types[t]].fn.apply(element, [element.value, this.partFn[types[t]].message, input, function (id) {
                    var el = undefined;
                    inputsObj.forEach(function (e) {
                        if (id == e.elName)
                            el = e.elObj;
                    });
                    return el ||  document.querySelector('#'+id) || document.createElement('input')
                }]) || types[t] === "equals" && !this.partFn[types[t]].fn.apply(element, [t__.isAllEqualsTo, input, t__.inputs])
                    || types[t] === "valid" && !this.partFn[types[t]].fn.apply(t__, [])) {
                if (types[t] === "valid")
                    return true;
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
        if (!fn.apply(element, [element.value, input.message, input, function (id) {
                var el = undefined;
                inputsObj.forEach(function (e) {
                    if (id == e.elName)
                        el = e.elObj;
                });
                return el || document.querySelector('#'+id) || document.createElement('input')
            }]))
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
            t__.removeId(obj.input);
            obj.input = document.getElementById(obj.input); /*MS querySelector*/
            if (obj.input) {
                if (typeof (obj.focus) === "undefined" || typeof (obj.focus) === "boolean" && obj.focus)
                    obj.input.addEventListener('focus', function () {
                        t__.eventFocus(obj.input)
                    }, false);
                if (typeof (obj.blur) === "undefined" || typeof (obj.blur) === "boolean" && obj.blur || typeof t__.fnChange === "function")
                    obj.input.addEventListener('blur', function () {
                        t__.eventValid(obj.input)
                    }, false);
                if (typeof (obj.keyup) === "boolean" && obj.keyup || typeof t__.fnChange === "function")
                    obj.input.addEventListener('keyup', function () {
                        t__.eventValid(obj.input)
                    }, false);
                if (typeof (obj.keypress) === "boolean" && obj.keypress || typeof t__.fnChange === "function")
                    obj.input.addEventListener('keypress', function () {
                        t__.eventValid(obj.input)
                    }, false);
                if (obj.input.type.toLowerCase() === 'checkbox' || obj.input.type.toLowerCase() === 'radio')
                    obj.input.addEventListener('click', function () {
                        t__.eventValid(obj.input)
                    }, false);

                t__.inputs.push(new Obj(obj.input, obj.boxErr, obj.message || '', obj.type, obj.valid, obj.name || obj.input.id, obj.classNotValid, obj.classValid, obj.keyup, obj.keypress, obj.blur, obj.focus, obj.equalsTo, obj.requiredIf))
                t__.checkAddInputRequiredIf(obj);
            }
        } else {
            obj.input.id = obj.input.id || 'jms-' + Math.floor(Math.random() * 5500) + '-' + Math.floor(Math.random() * 10000);
            t__.removeId(obj.input.id);
            t__.inputs.push(new Obj(obj.input, obj.boxErr, obj.message || '', obj.type, obj.valid, obj.name || obj.input.id, obj.classNotValid, obj.classValid, obj.keyup, obj.keypress, obj.blur, obj.focus, obj.equalsTo, obj.requiredIf))
            t__.checkAddInputRequiredIf(obj);
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
            if (typeof (objVal.blur) === "undefined" || typeof (objVal.blur) === "boolean" && objVal.blur || typeof t__.fnChange === "function")
                el.addEventListener('blur', function () {
                    t__.eventValid(el)
                }, false);
            if (typeof (objVal.keyup) === "boolean" && objVal.keyup || typeof t__.fnChange === "function")
                el.addEventListener('keyup', function () {
                    t__.eventValid(el)
                }, false);
            if (typeof (objVal.keypress) === "boolean" && objVal.keypress || typeof t__.fnChange === "function")
                el.addEventListener('keypress', function () {
                    t__.eventValid(el)
                }, false);
            if (el.type.toLowerCase() === 'checkbox' || el.type.toLowerCase() === 'radio')
                el.addEventListener('click', function () {
                    t__.eventValid(el)
                }, false);
        } catch (err) {
        }
    });
    if (arguments.length > 1 && typeof (arguments[1]) === "string") {
        var f = document.getElementById(arguments[1]);
        if (f && typeof (f.tagName) !== "undefined" && String(f.tagName).toUpperCase() === "FORM") {
            f.onsubmit = function () {
                return t__.send ? t__.execute(true) : t__.submit ? t__.valid() : t__.execute(false);
            }
            t__.btnSubmits = [];
            Array.prototype.forEach.call(f.querySelectorAll('[type=submit]'), function (el, i) {
                t__.btnSubmits.push(el);
            });
        }
    }
    t__.executeOnChange(t__.inputs.length > 0 ? t__.inputs[0].elObj : document.createElement('input'));

    return t__;
};
jPagevalid.prototype.eventFocus = function (a) {
    var t__ = this;
    t__.clearById(a.id);
    t__.executeOnChange(a);

};
jPagevalid.prototype.eventValid = function (o) {
    var t__ = this;
    t__.valid(o.id);
    t__.executeOnChange(o);
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
jPagevalid.prototype.checkAddInputRequiredIf = function (obj) {

    if (typeof obj.requiredIf !== "undefined" && typeof obj.requiredIf !== "function") {
        var bbol_ = false;
        this.inputs.forEach(function (e) {
            if (obj.requiredIf === e.elName) {
                if (e.validateType.indexOf('valid') === -1)
                    e.validateType += e.validateType ? ',valid' : 'valid';
                bbol_ = true;
            }
        });
        if (!bbol_) {
            this.addInput({input: obj.requiredIf, type: 'valid', keyup: true, keypress: true, blur: true, focus: true});
        }
    }

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

jPagevalid.prototype.removeId = function () {
    var idOb = "";
    if (typeof (arguments[0]) === "string")
        idOb = arguments[0];
    if (typeof (arguments[0]) === "object")
        idOb = arguments[0].id;
    for (var j in this.inputs) {
        if (this.inputs[j].elName === idOb) {
            this.inputs.splice(j, 1);
        }
    }
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
            if (f && typeof (f.tagName) !== "undefined" && String(f.tagName).toUpperCase() === "FORM") {
                if (typeof (arguments[0].submit) === "undefined" || (typeof (arguments[0].submit) === "boolean" && arguments[0].submit))
                    f.onsubmit = function () {
                        return t__.send ? t__.execute(true) : t__.submit ? t__.valid() : t__.execute(false);
                    }
                t__.btnSubmits = [];
                Array.prototype.forEach.call(f.querySelectorAll('[type=submit]'), function (el, i) {
                    t__.btnSubmits.push(el);
                });
            }
        }
        t__.executeOnChange(t__.inputs.length > 0 ? t__.inputs[0].elObj : document.createElement('input'));
        return t__;
    }
};
var Obj = function (input, boxErr, message, validType, validCallback, name, classNotValid, classValid, keyup, keypress, blur, focus, equalsTo, requiredIf) {
    this.elObj = input;
    this.elError = boxErr ? document.getElementById(boxErr) : document.querySelector('[' + name + ']') ? document.querySelector('[' + name + ']') : {innerHTML: ''};
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
    this.equalsTo = equalsTo || undefined;
    this.requiredIf = requiredIf || undefined;
    this.valid = this.validateType.indexOf('required') === -1 ? true : false;
    if (this.requiredIf) {
        this.validateType += this.validateType ? ',checkto' : 'checkto';
        this.requiredIf = typeof requiredIf === "function" ? requiredIf : typeof requiredIf === "string" ? document.getElementById(requiredIf) : document.querySelector('[' + requiredIf + ']') ? document.querySelector('[' + requiredIf + ']') : {checked: false, type: 'def'};
    } else {
        this.requiredIf = {checked: false, type: 'def'}
    }
    if (this.equalsTo && this.validateType.indexOf('equals') === -1) {
        this.validateType += this.validateType ? ',equals' : 'equals';
    }

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
            if (f && typeof (f.tagName) !== "undefined" && String(f.tagName).toUpperCase() === "FORM") {
                if (typeof (arguments[0].submit) === "undefined" || (typeof (arguments[0].submit) === "boolean" && arguments[0].submit))
                    f.onsubmit = function () {
                        return jvalid.send ? jvalid.execute(true) : jvalid.submit ? jvalid.valid() : jvalid.execute(false);
                    }
                jvalid.btnSubmits = [];
                Array.prototype.forEach.call(f.querySelectorAll('[type=submit]'), function (el, i) {
                    jvalid.btnSubmits.push(el);
                });
            }
        }
        jvalid.executeOnChange(jvalid.inputs.length > 0 ? jvalid.inputs[0].elObj : document.createElement('input'));
        return jvalid;
    }
};
