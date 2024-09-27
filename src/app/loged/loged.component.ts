import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from "firebase/auth";
import { FirebaseService } from '../Servicios/firebase.service';
import { ScannerService } from '../Servicios/scanner.service';

@Component({
  selector: 'app-loged',
  templateUrl: './loged.component.html',
  styleUrls: ['./loged.component.scss'],
})
export class LogedComponent implements OnInit, OnDestroy {

  constructor(public routerRecieved:Router, public scanner:ScannerService, public fireSrv:FirebaseService) { }

  spinnerMostrandose = true;

  rango = "Usuario";

  mailLoged:any;
  creditoDelUser:number = 0;
  qr10DelUser:number = 0;
  qr50DelUser:number = 0;
  qr100DelUser:number = 0;

  lecturaQR:any;

  qr10 : string = '8c95def646b6127282ed50454b73240300dccabc';
  qr50 : string = 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ';
  qr100 : string = '2786f4877b9091dcad7f35751bfcf5d5ea712b2f';

  async ngOnInit() 
  {
    setTimeout( ()=> { this.spinnerMostrandose = false}, 2000);

    const auth = getAuth();
    
    try
    {
      if (auth.currentUser.email != null)
      {
          if (auth.currentUser.email == "admin@admin.com")
          { 
            this.rango = "Administrador";
          }

          this.mailLoged = auth.currentUser.email;
      }
    }
    catch(e)
    {
      this.routerRecieved.navigate(['/home']);
    }

    let foundUser = await this.fireSrv.buscarUserByMail(this.mailLoged);
    console.log("FOUND:");
    console.log(foundUser);

    this.creditoDelUser = foundUser.creditos;
    
    this.qr10DelUser = foundUser.qr10;
    this.qr50DelUser = foundUser.qr50;
    this.qr100DelUser = foundUser.qr100;

    console.log(this.qr10DelUser);
    console.log(this.qr50DelUser);
    console.log(this.qr100DelUser);
  }

  async ngOnDestroy() {
    this.spinnerMostrandose = true;
  }

  logOut()
  {
    const auth = getAuth();
    signOut(auth).then(() => 
    {
      // Sign-out successful.
      console.log("Cierre de sesión satisfactorio. Vuelva prontosss!");
      
    }).catch((error) => 
    {
      // An error happened.
      console.log(error);
    });
    this.creditoDelUser = 0;
    
    this.rango = "Usuario";
    
    this.mailLoged = null;
    
    this.qr10DelUser = 0;
    this.qr50DelUser = 0;
    this.qr100DelUser = 0;
    
    this.routerRecieved.navigate(['/home']);
  }

  async escanear()
  {
    // // await this.scanner.test().then((a)=>{
    // //   this.scanner.stopScan();
    // //   this.lecturaQR = a;
    // // });

    // /*
    // qr10 : string = '8c95def646b6127282ed50454b73240300dccabc';
    // qr50 : string = 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172';
    // qr100 : string = '2786f4877b9091dcad7f35751bfcf5d5ea712b2f';
    // */

    // this.lecturaQR = "8c95def646b6127282ed50454b73240300dccabc";


    // // alert(this.lecturaQR);
    // this.verificarAcreditacion(this.lecturaQR);
    this.scanner.scan().then(async (a)=>
    {
      this.lecturaQR = a.rawValue.toString();
      console.log(this.lecturaQR);
      //this.scanner.stopScan();
      await this.verificarAcreditacion(this.lecturaQR);
    });
     
  }

  escanearQR()
  {
    this.scanner.scan().then(async (a)=>
    {
      this.lecturaQR = a.rawValue.toString();
      console.log(this.lecturaQR);
      //this.scanner.stopScan();
      await this.verificarAcreditacion(this.lecturaQR);
    });
  }

  async verificarAcreditacion(valorAcreditado : string)
  {
    if(this.rango == 'Administrador')
    {
      if(valorAcreditado == this.qr10 && this.qr10DelUser < 2)
      {
        // alert("CARGANDO1");
        this.qr10DelUser++;
        this.creditoDelUser += 10;
        await this.fireSrv.modificarUsuarioDB(this.mailLoged,this.creditoDelUser,this.qr10DelUser,this.qr50DelUser,this.qr100DelUser);
        this.mostrarErrorCargando("Se han cargado 10 creditos con este QR.");
      }
      else if(valorAcreditado == this.qr50 && this.qr50DelUser < 2)
      {
        // alert("CARGANDO2");
        this.qr50DelUser++;
        this.creditoDelUser += 50;
        await this.fireSrv.modificarUsuarioDB(this.mailLoged,this.creditoDelUser,this.qr10DelUser,this.qr50DelUser,this.qr100DelUser);
        this.mostrarErrorCargando("Se han cargado 50 creditos con este QR.");
      }
      else if(valorAcreditado == this.qr100 && this.qr100DelUser < 2)
      {
        // alert("CARGANDO3");
        this.qr100DelUser++;
        this.creditoDelUser += 100;
        await this.fireSrv.modificarUsuarioDB(this.mailLoged,this.creditoDelUser,this.qr10DelUser,this.qr50DelUser,this.qr100DelUser);
        this.mostrarErrorCargando("Se han cargado 100 creditos con este QR.");
      }
      else
      {
        this.mostrarErrorCargando("Ni siquiera siendo Admin se puede cargar 2 veces el mismo QR.");
      }
    }
    else
    {
      if(valorAcreditado == this.qr10 && this.qr10DelUser < 1)
      {
        this.qr10DelUser++;
        this.creditoDelUser += 10;
        await this.fireSrv.modificarUsuarioDB(this.mailLoged,this.creditoDelUser,this.qr10DelUser,this.qr50DelUser,this.qr100DelUser);
        this.mostrarErrorCargando("Se han cargado 10 creditos con este QR.");
      }
      else if(valorAcreditado == this.qr50 && this.qr50DelUser < 1)
      {
        this.qr50DelUser++;
        this.creditoDelUser += 50;
        await this.fireSrv.modificarUsuarioDB(this.mailLoged,this.creditoDelUser,this.qr10DelUser,this.qr50DelUser,this.qr100DelUser);
        this.mostrarErrorCargando("Se han cargado 50 creditos con este QR.");
      }
      else if(valorAcreditado == this.qr100 && this.qr100DelUser < 1)
      {
        this.qr100DelUser++;
        this.creditoDelUser += 100;
        await this.fireSrv.modificarUsuarioDB(this.mailLoged,this.creditoDelUser,this.qr10DelUser,this.qr50DelUser,this.qr100DelUser);
        this.mostrarErrorCargando("Se han cargado 100 creditos con este QR.");
      }
      else
      {
        this.mostrarErrorCargando("No se puede cargar crédito del mismo QR más de una vez.");
      }
    }
  }

  limpiarCreditos()
  {
    this.fireSrv.limpiarCreditosUsuarioDB(this.mailLoged);
    this.creditoDelUser = 0;
    this.qr10DelUser = 0;
    this.qr50DelUser = 0;
    this.qr100DelUser = 0;
  }

  errorShow = false;
  errorMessage;

  mostrarErrorCargando(textoError)
  { 
    this.errorShow = true;
    this.errorMessage = textoError;

    setTimeout(()=>{ this.errorShow = false;},2000);
  }

}
