import { Component } from '@angular/core';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, addDoc} from 'firebase/firestore/lite';
import { ActivatedRoute, Router } from '@angular/router';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { Usuario } from '../Entidades/usuario';
import { FirebaseService } from '../Servicios/firebase.service';

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyD4gby08uxXihCFHaN9VzJ175DAvRmYY0A",
//   authDomain: "admitodo-glg-e0641.firebaseapp.com",
//   projectId: "admitodo-glg-e0641",
//   storageBucket: "admitodo-glg-e0641.appspot.com",
//   messagingSenderId: "540595022028",
//   appId: "1:540595022028:web:f4d9b14f876bd0711e7a69",
//   measurementId: "G-S38XCEXE64"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBvmQEQuufK6qPsz_ETCpu2X0eV0Q48u5M",
  authDomain: "mendez2024pps.firebaseapp.com",
  projectId: "mendez2024pps",
  storageBucket: "mendez2024pps.appspot.com",
  messagingSenderId: "123687526653",
  appId: "1:123687526653:web:c3846e8b4aea279acf1e94"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//export const usuarios = collection(db, "usuarios");
export const creditos = collection(db, "creditos");

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //Tengo a mis 2 variables dinamicas NGMODEL, mail ingresado y password.
  public mailIngresado:string;
  public passwordIngresado:string;
  
  user = new Usuario();
  public listaUsuariosDB:[Usuario] = [this.user];
  
  constructor(private routerRecieved:Router, public srvFirestore:FirebaseService) {}
  
  //---------- BOTONES TEMPORALES-------------------
  
  adminAutocomplete()
  {
    let txtBoxMail = document.getElementById("mail");
    let txtBoxPassword = document.getElementById("password");
  
    txtBoxMail.setAttribute("value","admin@admin.com");
    txtBoxPassword.setAttribute("value","111111");
  
    this.mailIngresado = "admin@admin.com";
    this.passwordIngresado = "111111";
  }
  
  userAutocomplete()
  {
    let txtBoxMail = document.getElementById("mail");
    let txtBoxPassword = document.getElementById("password");
  
    txtBoxMail.setAttribute("value","usuario@usuario.com");
    txtBoxPassword.setAttribute("value","333333");
  
    this.mailIngresado = "usuario@usuario.com";
    this.passwordIngresado = "333333";
  }
  
  testerAutocomplete()
  {
    let txtBoxMail = document.getElementById("mail");
    let txtBoxPassword = document.getElementById("password");
  
    txtBoxMail.setAttribute("value","tester@tester.com");
    txtBoxPassword.setAttribute("value","555555");
  
    this.mailIngresado = "tester@tester.com";
    this.passwordIngresado = "555555";
  }
  
  limpiarControles()
  {
    let txtBoxMail = document.getElementById("mail");
    let txtBoxPassword = document.getElementById("password");
  
    txtBoxMail.setAttribute("value","");
    txtBoxPassword.setAttribute("value","");
  
    let txtBoxSatisfaccion = document.getElementById("txtSatisfaccion");
    txtBoxSatisfaccion.setAttribute("hidden","true");
  
    let txtBoxError = document.getElementById("txtError");
    txtBoxError.setAttribute("hidden","true");
  }
  //--------------------------------------------------
  
  private mostrarError(errorRecibido:string)
  {
    let txtBoxError = document.getElementById("txtError");
    txtBoxError.textContent = errorRecibido;
    txtBoxError.removeAttribute("hidden");
  
    let txtBoxSatisfaccion = document.getElementById("txtSatisfaccion");
    txtBoxSatisfaccion.setAttribute("hidden","true");
  }
  
  private mostrarSatisfaccion(satisfaccionRecibida:string)
  {
    let txtBoxSatisfaccion = document.getElementById("txtSatisfaccion");
    txtBoxSatisfaccion.textContent = satisfaccionRecibida;
    txtBoxSatisfaccion.removeAttribute("hidden");
  
    let txtBoxError = document.getElementById("txtError");
    txtBoxError.setAttribute("hidden","true");
  }
  
  async registerAuthFirebase()
  {
      const auth = getAuth();
      
      createUserWithEmailAndPassword(auth, this.mailIngresado, this.passwordIngresado).then(async (userCredential) => 
      {
          this.mostrarSatisfaccion("Su usuario acaba de ser registrado satisfactoriamente."); 
          this.limpiarControles();
           
          //SUBIR A LA BASE EL USUARIO
          this.srvFirestore.crearUsuarioDB(this.mailIngresado);
  
          // Signed in
          const userRegistered = userCredential.user;
  
          this.routerRecieved.navigate(['/loged']);
        })
        .catch((error) => 
        {
          const errorCode = error.code;
          const errorMessage = error.message;
  
          switch (errorCode) 
          {
            case "auth/invalid-email":
            {
              this.mostrarError("El mail ingresado es inválido.");
              break;
            }
            case "auth/internal-error":
            {
              this.mostrarError("Hubo un error interno de procesamiento.");
              break;
            }
            case "auth/weak-password":
            {
              this.mostrarError("La contraseña ingresada es débil. Mínimo 6 caracteres.");
              break;
            }
            case "auth/missing-email":
            {
              this.mostrarError("No se ha detectado un mail.");
              break;
            }
            case "auth/email-already-in-use":
            {
              this.mostrarError("Ya existe una cuenta con el mail ingresado.");
              break;
            }
            case "auth/network-request-failed":
            {
              this.mostrarError("Hubo un problema de conexión. Verifica tu conexión.");
              break;
            }
            default:
            {
              this.mostrarError("Ocurrió un error inesperado. Por favor comunícate con el soporte.");
              break;
            }
          }
        });
  }
  
  public loginAuthFirebase()
  {
    const auth = getAuth();
    
    console.log(this.mailIngresado);
    console.log(this.passwordIngresado);
  
    signInWithEmailAndPassword(auth, this.mailIngresado, this.passwordIngresado).then((userCredential) =>
     {
  
      this.mostrarSatisfaccion("El inicio de sesión fue satisfactorio. Bienvenido/a.");
  
        // Signed in
        const userLoged = userCredential.user;
        this.limpiarControles();
        this.routerRecieved.navigate(['/loged']);
      })
      .catch((error) => 
        {
          const errorCode = error.code;
          const errorMessage = error.message;
  
          switch (errorCode) 
          {
            case "auth/invalid-email":
            {
              this.mostrarError("El mail ingresado es inválido.");
              break;
            }
            case "auth/internal-error":
            {
              this.mostrarError("Hubo un error interno de procesamiento.");
              break;
            }
            case "auth/wrong-password":
            {
              this.mostrarError("La contraseña ingresada es incorrecta.");
              break;
            }
            case "auth/weak-password":
            {
              this.mostrarError("La contraseña ingresada es débil. Mínimo 6 caracteres.");
              break;
            }
            case "auth/missing-email":
            {
              this.mostrarError("No se ha detectado un mail.");
              break;
            }
            case "auth/email-already-in-use":
            {
              this.mostrarError("Ya existe una cuenta con el mail ingresado.");
              break;
            }
            case "auth/network-request-failed":
            {
              this.mostrarError("Hubo un problema de conexión. Verifica tu conexión.");
              break;
            }
            default:
            {
              this.mostrarError("Ocurrió un error inesperado. Por favor comunícate con el soporte.");
              break;
            }
          }
        });
  }
  
  }