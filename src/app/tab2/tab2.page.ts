import { Component } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public csvItems: any;
  title: string;
  form: FormGroup;
  contact: any;
  private PATH = 'contacts/';
  // tslint:disable-next-line:no-trailing-whitespace
  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private provider: ContactService,
              // tslint:disable-next-line:max-line-length
              private toast: ToastController, private activatedroute: ActivatedRoute, private route: Router) {
    this.contact = (this.activatedroute.snapshot.params) ? this.activatedroute.snapshot.params  : {};
    console.log(this.contact);
    this.createForm(this.contact);
  }
  createForm(contact: any) {
    this.form = this.formBuilder.group({
      key: [contact.key],
      name: [contact.name, Validators.required],
      email1: [contact.email1, Validators.required],
      email2: [contact.email2 || ''],
      agency: [contact.agency, Validators.required],
      tel1: [contact.tel1, Validators.required],
      tel2: [contact.tel2 || ''],
      status: [1],
      sexo: [contact.sexo, Validators.required],
      event: [contact.event, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.provider.save(this.form.value)
        .then(async () => {
          const toDo = await this.toast.create({ message: 'Contato salvo com sucesso.', duration: 2000 });
          toDo.present();
          const contact = {};
          this.createForm(contact);
          this.route.navigate(['/tabs/tab2/']);
        })
        .catch(async (e) => {
          const toDo = await this.toast.create({ message: 'Erro ao salvar o contato.', duration: 2000 });
          toDo.present();
          console.error(e);
        });
    }
  }
}
