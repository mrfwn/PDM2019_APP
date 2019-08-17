import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ContactService } from '../services/contact.service';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireDatabase } from 'angularfire2/database';
import swal from 'sweetalert';

@Injectable()
@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  contacts: Observable<any>;
  private PATH = 'contacts/';
  scannerData: any = {};
  options: BarcodeScannerOptions;
  constructor(private toast: ToastController, private provider: ContactService, private route: Router,
              private scanner: BarcodeScanner, private db: AngularFireDatabase) {
    this.contacts = this.provider.getAll();
  }

  async setPresence(key: string) {
    if (this.provider.get(key)) {
      const conv  = this.provider.getPresence(key);
      if (conv.status) {
        // tslint:disable-next-line:max-line-length
        swal( {title: 'Atenção !!!', text: `${conv.name} - já está presente!!`, icon: 'warning', buttons: [false] , timer: 4000});
      } else {
        const items = this.db.list(this.PATH);
        items.update(key, { status: 1 });
        // tslint:disable-next-line:max-line-length
        swal( {title: 'Convidado Registrado!!', text: `Bem Vindo ${conv.name} !!`, icon: 'success', buttons: [false] , timer: 2500});
        // const toDo = await this.toast.create({ message: 'Convidado Registrado!!', duration: 3000 });
        // toDo.present();
      }
    } else {
      const toDo = await this.toast.create({ message: 'Usuário Não Encontrado', duration: 3000 });
      toDo.present();
    }

  }

  async setPresenceCheck(contact: any) {
    if (contact.status) {
      const items = this.db.list(this.PATH);
      items.update(contact.key, { status: 0 });
      const toDo = await this.toast.create({ message: 'Falta Colocada', duration: 2000 });
      toDo.present();
    } else {
      const items = this.db.list(this.PATH);
      items.update(contact.key, { status: 1 });
      const toDo = await this.toast.create({ message: 'Presença Confirmada', duration: 2000 });
      toDo.present();
    }

  }

  changeColor(contact: any) {
    return contact.status === 1 ? true : false;
  }

  qrRead() {
    this.options = {
      prompt: 'Lendo QRCode'
    };
    this.scanner.scan(this.options).then((data) => {
      this.scannerData = data;
      this.setPresence(this.scannerData.text);
    }, (err) => {
      console.log('Erro :', err);
    });
  }

  editContact(contact: any) {
    this.route.navigate(['/tabs/tab2/', contact]);
  }

  removeContact(key: string) {
    if (key) {
      this.provider.remove(key)
        .then(async () => {
          const toDo = await this.toast.create({ message: 'Contato removido com sucesso.', duration: 2000 });
          toDo.present();
        })
        .catch(async () => {
          const toDo = await this.toast.create({ message: 'Erro ao remover o contato.', duration: 2000 });
          toDo.present();
        });
    }
  }
}
