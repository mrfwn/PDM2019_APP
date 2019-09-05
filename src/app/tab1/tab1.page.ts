import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ContactService } from '../services/contact.service';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireDatabase } from 'angularfire2/database';
import swal from 'sweetalert';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { resolve } from 'url';
@Injectable()
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  public searchControl: FormControl;
  contacts: Observable<any>;
  list: any;
  private PATH = 'contacts/';
  scannerData: any ;
  searchTerm = '';
  searching: any = false;
  options: BarcodeScannerOptions;
  constructor(private toast: ToastController, private provider: ContactService, private route: Router,
              private scanner: BarcodeScanner, private db: AngularFireDatabase) {
    this.contacts = this.provider.getAll();
    this.searchControl = new FormControl();
  }

  getList() {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise(resolve => {
      this.db.object(this.PATH).snapshotChanges()
      .subscribe(actions => resolve(actions.payload.val()));
    });
  }

  ngOnInit() {
    this.setFilteredItems('');

    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.searching = false;
        this.contacts = this.provider.getAll();
        this.setFilteredItems(search);
      });
  }

  filterItems(searchTerm) {
    return this.contacts.map((res) => {
      res = res.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
      // console.log(JSON.stringify(res));
      return res;
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredItems(searchTerm) {
   this.contacts = this.filterItems(searchTerm);
  }

 /* setPresence(key: string) {
    const check = this.provider.getPresence(key);

    if (check != null && check !== undefined ) {
      // const conv  = this.provider.getPresence(key);
      if (check.status) {
        // tslint:disable-next-line:max-line-length
        swal( {title: 'Atenção !!!', text: `${check.name} - já está presente!!`, icon: 'warning', buttons: [false] , timer: 4000});
      } else {
        const items = this.db.list(this.PATH);
        items.update(key, { status: 1 });
        // tslint:disable-next-line:max-line-length
        swal( {title: 'Convidado Registrado!!', text: `Bem Vindo ${check.name} !!`, icon: 'success', buttons: [false] , timer: 2500});
        // const toDo = await this.toast.create({ message: 'Convidado Registrado!!', duration: 3000 });
        // toDo.present();
      }
    } else {
      swal( {title: 'Usuário Não encontrado', icon: 'warning', buttons: [false] , timer: 2000});
      // const toDo = await this.toast.create({ message: 'Usuário Não Encontrado', duration: 3000 });
      // toDo.present();
    }
    // this.provider.conv = null;

  }*/

  setPresenceCheck(contact: any) {
    if (contact.status) {
      this.db.list(this.PATH).update(contact.key, { status: 0 });
      swal( {title: 'Falta colocada !!!', text: ``, icon: 'info', buttons: [false] , timer: 2000});
    } else {
      this.db.list(this.PATH).update(contact.key, { status: 1 });
      swal( {title: 'Presença Confirmada !!!', text: ``, icon: 'success', buttons: [false] , timer: 2000});
    }

  }

  changeColor(contact: any) {
    return contact.status === 1 ? true : false;
  }

  getPresence(key: any) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise(resolve => {
      this.db.object(this.PATH + key).snapshotChanges()
      .subscribe(actions => resolve(actions.payload.val()));
    });
 }

  qrRead() {
    this.options = {prompt: 'Lendo QRCode'};
    this.scanner.scan(this.options).then((data) => {
      this.getPresence(data.text).then( (ret: any) => {
        if (ret) {
          if (ret.status) {
            swal( {title: 'Atenção !!!', text: `${ret.name} - já está presente!!`, icon: 'warning', buttons: [false] , timer: 4000});
          } else {
            this.db.list(this.PATH).update(data.text, { status: 1 });
            swal( {title: 'Convidado Registrado!!', text: `Bem Vindo ${ret.name} !!`, icon: 'success', buttons: [false] , timer: 2500});
          }
        } else {
          swal( {title: 'Convidado Não encontrado', icon: 'error', buttons: [false] , timer: 2000});
        }
      });
    });
  }

  editContact(contact: any) {
    this.route.navigate(['/tabs/tab2/', contact]);
  }

  removeContact(key: string) {
    if (key) {
      this.provider.remove(key)
        .then(async () => {
          swal( {title: 'Convidado Removido!', icon: 'info', buttons: [false] , timer: 2000});
        })
        .catch(async () => {
          swal( {title: 'Erro ao remover convidado !', icon: 'error', buttons: [false] , timer: 2000});
        });
    }
  }
}
