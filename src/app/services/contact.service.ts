import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private PATH = 'contacts/';
  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('name'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  }

  get(key: string) {
    return this.db.object(this.PATH + key).snapshotChanges()
      .map(c => {
        return { key: c.key, ...c.payload.val() };
      });
  }

  save(contact: any) {
    return new Promise((resolve, reject) => {
      if (contact.key) {
        contact.status = 0;
        this.db.list(this.PATH)
          .update(contact.key, {
            name: contact.name, email: contact.email, agency: contact.agency
            , tel: contact.tel, status: contact.status
          })
          .then(() => {resolve(); contact = null; })
          .catch((e) => reject(e));
      } else {
        contact.status = 0;
        this.db.list(this.PATH)
          .push({ name: contact.name, email: contact.email, agency: contact.agency, tel: contact.tel , status: contact.status })
          .then(() => resolve());
      }
    });
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }

}
