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
  // tslint:disable-next-line:no-trailing-whitespace
  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private provider: ContactService,
              private toast: ToastController, private activatedroute: ActivatedRoute, private route: Router) {
    this.contact = (this.activatedroute.snapshot.params) ? this.activatedroute.snapshot.params  : {};
    console.log(this.contact);
    this.createForm(this.contact);
  }
  createForm(contact: any) {
    this.form = this.formBuilder.group({
      key: [contact.key],
      name: [contact.name, Validators.required],
      email: [contact.email, Validators.required],
      agency: [contact.agency, Validators.required],
      tel: [contact.tel, Validators.required],
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
