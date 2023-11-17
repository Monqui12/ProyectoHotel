import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { LoadChildren, Router } from '@angular/router';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialsForm!: FormGroup;
  
  constructor(
    private database: DatabaseService,
    public router:Router,
    private platform: Platform,
    private alertController: AlertController,
    private formBuilder:FormBuilder,
    private loadingController:LoadingController,
    private toastController:ToastController
  ) { }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.validaSesion().then((r) => {
        if(r){
          this.router.navigate(['/home']);
          return;
        }else{
          // this.showAlert('Falso');
        }
      }).catch((er) => {
        this.showAlert('Cierra y vuelve a abrir la app' + er,'Error!');
      });
    });  
    this.credentialsForm = this.formBuilder.group({
          identificacion: ['', [Validators.required]],
          password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }
  async validaSesion(){
    return await this.database.getUserSesion().then(res => {
      if(res == true){
        return true;
      }else{
        return false;
      }
    }).catch((er) => {
      return false;
    });
  }
  async login(){
    const loading = this.loadingController.create({message: 'Iniciando Sesión...'});
    loading.then(loading => loading.present());
    this.presentToast('Sesion iniciada');
    loading.then(loading => loading.dismiss());
    this.router.navigate(['/home']);
    this.credentialsForm.value
  }
  showAlert(msg:any, header:any) {
    let alert = this.alertController.create({
      message: msg,
      header: header,
      buttons: [{text: 'Aceptar'}]
    });
    alert.then(alert => alert.present());
  }
  async presentToast(msg:any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  delete(){
    this.database.cerrarSesion();
  }
}
