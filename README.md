# jPagevalid
Per validazioni lato client in javascript nativo, si distacca da ogni framework javascript per il suo ciclo di vita - Valida form ed elementi singoli tag Html


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

esempio di nuova istanzia, applicare un validatore ad un form 

```js
jPagevalid.form('myformTest')
// Oppure
jPagevalid.get('myformTest').form()
```

esempio recupero istanzia

```js
jPagevalid.get('myformTest')

```

valida tutto il form

```js
jPagevalid.get('myformTest').valid()

```

valida un singolo elemento del form

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

per validare il singolo elemento del body

```js
jPagevalid.get('mybody').valid('01')
jPagevalid.get('mybody').valid('02')
jPagevalid.get('mybody').valid('03')
```
## Aggiungere una funzione di validazione personalizzata


```js
jPagevalid.addValidation('nome-funzione',function(v){},'messaggio di errore');
```
oppure

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



 ## License

jPagevalid è disponibile sotto la licenza MIT. Vedi il [LICENSE](https://github.com/mssalvo/jPagevalid/blob/master/LICENSE) per maggiori informazioni.
