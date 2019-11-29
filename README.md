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
