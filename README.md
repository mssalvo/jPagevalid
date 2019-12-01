# jPagevalid
Per validazioni lato client in javascript nativo, si distacca da ogni framework javascript per il suo ciclo di vita - Valida form ed elementi singoli tag Html

# Getting Started

1. Includi jPagevalid sulla tua pagina prima della chiusura tag </body> 
```html
<script src="/path/dist/1.x.x/jpagevalid.js"></script>
```

* ## [Demo jPagevalid](https://mssalvo.github.io/jPagevalid/)


## _Metodi disponibili_

Metodo | Esempio | Destrizione  
------- | ------- | ------- 
**get** | jPaging.get('nomeIstanza') | crea una nova istanza se non presente o ritorna l'istanza associata al nome passato come parametro 
**form** | jPaging.form('id-form-html') | inizializza una validazione per il form, crea una nova istanza associa all'istanza come nome l'id passato come parametro
**isSubmit** | jPaging.get('nomeIstanza').isSubmit(false/true) | abilita o disabilita l'invio modulo per l'evento submit associato al form
**authorizeSend** | jPaging.get('nomeIstanza').authorizeSend() | abilita comunque e sempre l'invio modulo anche in presenza di validazione negativa
**addValidation** | jPaging.addValidation('nome-funzione',funzione,'messaggio-di-errore') | addizziona alle funzioni di default una nuova funzione per validazioni personalizzate 
**changeFnMessage** | jPaging.get('nomeIstanza').changeFnMessage('nome-funzione','messaggio-modificato') | cambia un messaggio associato ad una funzione di default o personalizzata
**valid** | jPaging.get('nomeIstanza').valid() | valida il form legato all'istanza se passato il parametro id valida l'elemento singolo del form jPaging.get('nomeIstanza').valid('id-input')
**addInput** | jPaging.get('nomeIstanza').addInput({object-javascript}) | addiziona un elemento da validare all'istanza corrente 
**include** | jPaging.get('nomeIstanza').include() | addiziona tutti gli elementi con attributo jms-valid="{type:'required',etc..,etc..}" presenti nella pagina html all'istanza per la validazione
**onChange** | jPaging.get('nomeIstanza').onChange(function(valid){}) | esegue la funzione assegnata ad ogni cambiamento di un modulo, nel costruttore viene iniettato la validazione del form true/false 
**checkOnSubmit** | jPaging.get('nomeIstanza').checkOnSubmit() | abilita - disabilita in modo automatico il pulsante submit per l'inivo del modulo [ di default e settato a false ]
**checkOffSubmit** | jPaging.get('nomeIstanza').checkOffSubmit() |  disabilita il modo automatico, lascia all'utente gestire il pulsante submit 
 



## Esempio valida form, fonte dati da attribute jms-valid

```html
   <form id="myformTest" action="...">
       <input type="text" id="01" jms-valid="{type:'requred,number'}">   
      <input type="submit" value="salva"> 
   </form> 
```


```js
jPagevalid.form('myformTest')
```

## _per recuperare un istanzia precedente e utilizzare i metodi disponibili_

**_esempio di nuova istanzia, applicare un validatore ad un form_**

```js
jPagevalid.form('myformTest')
// Oppure
jPagevalid.get('myformTest').form()
```

**_esempio recupero istanzia_**

```js
jPagevalid.get('myformTest')

```

**_valida tutto il form_**

```js
jPagevalid.get('myformTest').valid()

```

**_valida un singolo elemento del form_**

```js
jPagevalid.get('myformTest').valid('idElemento')

```



## Esempio valida tag html, fonte dati da attribute jms-valid

```html
   <div id="myTagTest">
       <input type="text" id="01" jms-valid="{type:'requred,number'}">   
       <input type="text" id="02" jms-valid="{type:'requred,email'}">  
   </div> 
```


```js
jPagevalid.form('myTagTest')
```

## Esempio valida pagina html, fonte dati da attribute jms-valid

```html
   <body>
       <input type="text" id="01" jms-valid="{type:'requred,emain'}">   
       <input type="chekbox" id="02" jms-valid="{type:'requred'}"> 
       <input type="text" id="03" jms-valid="{type:'requred,number'}"> 
       <input type="text" id="04" jms-valid="{type:'requred,data'}"> 
       <input type="text" id="05" jms-valid="{type:'requred,time'}"> 
   </body> 

```

```js
jPagevalid.get('mybody').include();
```


**_per validare l'itero body_**

```js
jPagevalid.get('mybody').valid()
```


**_per validare il singolo elemento del body_**

```js
jPagevalid.get('mybody').valid('01')
jPagevalid.get('mybody').valid('02')
jPagevalid.get('mybody').valid('03')
```
## Aggiungere una funzione di validazione personalizzata


```js
jPagevalid.addValidation('nome-funzione',function(v){},'messaggio di errore');
```
**oppure**

```js
jPagevalid.form('myformTest').addValidation('nome-funzione',function(v){},'messaggio di errore');
```
## Esempio

```html
   <form id="myformTest" action="...">
      <input type="text" id="dataInizio" jms-valid="{type:'requred,date'}">   
      <input type="text" id="dataFine" jms-valid="{type:'requred,date,checkendate'}">   
      <input type="submit" value="salva"> 
   </form> 
```


```js
jPagevalid.addValidation("checkendate",function(value,message,input,search) {
    	
    	var bbol = false;
    	var dataemissioneini = search('dataInizio').value;  // recupero l'elemento input[dataInizio] presente nell'oggetto jPagevalid
    	var dataemissionefine =search('dataFine').value;  // recupero l'elemento input[dataFine] presente nell'oggetto jPagevalid
    	
    	if ( dataemissioneini != '' && dataemissionefine != '' )
    	{
    		var datainizio =  new Date(dataemissioneini);
    		var datafine = new Date(dataemissionefine);
    		 if (datafine.getTime() > datainizio.getTime())         
    			 bbol = true;
    	}
    	return bbol;
     }, 'Inserire una data maggiore della data di inizio')
     .form('myformTest')
     .changeFnMessage('date','Si prega di specificare un formato data valido (GG/MM/AAAA)') // cambio il messaggio del metodo di defasult data
     .isSubmit(false); // disabilito l'invio del modulo tramite l'evento submit

```
## Esempio validazione tramite oggetto javascript
```html
<form id="formTest4" class="needs-validation" novalidate>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="firstName">First name</label>
                <input type="text" class="form-control" id="firstName4" placeholder="" value="">
                <div class="invalid-feedback" firstName4>
                  Valid first name is required.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="total4">Total</label>
                <input type="text" class="form-control" id="total4" placeholder="" value="">
                <div class="invalid-feedback" total4>
                  Valid last name is required.
                </div>
              </div>
            </div>
  
            <div class="mb-3">
              <label for="email">Email </label>
              <input type="email" class="form-control" id="email4" placeholder="you@example.com">
              <div class="invalid-feedback" email4>
                Please enter a valid email address for shipping updates.
              </div>
            </div>

            <div class="mb-3">
              <label for="testoMin">Testo min 20 caratteri</label>
              <input type="text" class="form-control" id="testomin" placeholder=" ">
              <div class="invalid-feedback" testomin>
               min 20 caratteri.
              </div>
            </div>
 
            <hr class="mb-4">
            <button id="btnSubmit" class="btn btn-primary btn-lg btn-block" type="submit">save</button>
          </form>
```

## Esempio 
```js
var obj_form = {
                      form: 'formTest4',
                      submit: true,
                      inputs: [
                          {
                           input: 'firstName4',
                           type: 'required'
                          },
                          {
                             input: 'total4',
                             type: 'required,number',
                             keyup: true,
                             keypress: true
                          },
                          { 
                           input: 'email4',
                           type: 'required,email',
                          },
                         {   input: 'testomin',
                             type: 'required',
                             keyup: true,
                             keypress: true
                               
                          }]}
        
         jPagevalid.form(obj_form);

```

 ## License

jPagevalid è disponibile sotto la licenza MIT. Vedi il [LICENSE](https://github.com/mssalvo/jPagevalid/blob/master/LICENSE) per maggiori informazioni.
