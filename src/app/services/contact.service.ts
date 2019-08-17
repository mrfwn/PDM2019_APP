import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private PATH = 'contacts/';
  conv: any;
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

  getPresenceConteudo() {
     const itemsRef = this.db.list(this.PATH);
     return itemsRef.snapshotChanges(['child_added'])
      .subscribe(actions => {
        actions.forEach(action => {
          alert(JSON.stringify(action));
          alert(action.key);
          alert(action.payload.val());
        });
      });
  }
  /*getPresence(key: any) {
    const itemsRef = this.db.list(this.PATH + key);
    return itemsRef.snapshotChanges(['child_added'])
     .subscribe(actions => {
       actions.forEach(action => {
         alert(JSON.stringify(action));
         alert(action.key);
         alert(action.payload.val());
       });
     });
 }*/

 getPresence(key: any) {
   this.db.object(this.PATH + key).snapshotChanges()
   .subscribe(actions => this.conv = actions.payload.val());
   return this.conv;
}

  save(contact: any) {
    return new Promise((resolve, reject) => {
      if (contact.key) {
        this.db.list(this.PATH)
          .update(contact.key, {
            name: contact.name, email1: contact.email1, email2: contact.email2, agency: contact.agency
            , tel1: contact.tel1, tel2: contact.tel2 , status: contact.status , sexo: contact.sexo , event: contact.event
          })
          .then(() => {resolve(); contact = null; })
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ name: contact.name, email1: contact.email1, email2: contact.email2
            , agency: contact.agency, tel1: contact.tel1, tel2: contact.tel2 , status: contact.status, sexo: contact.sexo
            , event: contact.event })
          .then(() => resolve());
      }
    });
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }

}
