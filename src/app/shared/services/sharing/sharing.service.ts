import { XmppServicesService } from './../xmpp-services/xmpp-services.service';
import { Injectable, inject } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { Observable, Subject, catchError, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { xml } from '@xmpp/client';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { XmppServicesModel } from '../../models/xmpp-services.model';

@Injectable({
  providedIn: 'root'
})
export class SharingService {
  private xmppService = inject(XmppService);
  private xmppServicesService = inject(XmppServicesService);
  private httpClient = inject(HttpClient);

  private uploadProgressSource = new Subject<{fileId: string, progress: number}>();
  get uploadProgress$() {
    return this.uploadProgressSource.asObservable();
  }

  shareFile(file: File, fileId: string): Observable<any> {
    return this.requestUploadSlot(file.name, file.size, fileId, file.type).pipe(
      switchMap(id => this.getUploadSlotUrl(id)),
      switchMap(url => this.uploadFile(url, fileId, file, file.type)),
      filter((resp: any) => resp.event.type === HttpEventType.Response),
    );
  }

  private uploadFile(url: any, fileId: string, file: File, contentType: string): Observable<any> {
    return this.httpClient.put(url.put, file, {
      headers: { 'Content-Type': contentType },
      reportProgress: true,
      responseType: 'text',
      observe: 'events'
    }).pipe(
      tap(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total ? (event.loaded / event.total) * 100 : 0;
          this.uploadProgressSource.next({fileId, progress});
        }
      }),
      catchError(error => {
        console.error('Erro durante o upload:', error);
        return throwError(() => new Error('Erro durante o upload'));
      }),
      map((event) => {
        return {event, fileId, url: url.get};
      })
    );
  }

  private requestUploadSlot(fileName: string, fileSize: number, fileId: string, contentType: string): Observable<any> {
    return this.xmppServicesService.services$.pipe(
      filter(services => services.length > 0),
      map((services: XmppServicesModel[]) => services.filter(service => service.jid.includes("upload"))),
      switchMap((services) => {
        return of(services[0].jid);
      }),
      switchMap((to) => {
        const iq = xml('iq', { type: 'get', id: fileId, to: to },
          xml('request', { xmlns: 'urn:xmpp:http:upload:0', filename: fileName, size: fileSize.toString(), 'content-type': contentType })
        );

        return this.xmppService.sendStanza(iq).pipe(map(() => fileId));
      })
    );
  }

  private getUploadSlotUrl(id: string): Observable<any> {
    return this.xmppService.onStanza$.pipe(
      filter(stanza => stanza.attrs.id === id),
      map(stanza => {
        const put = stanza.getChild('slot', 'urn:xmpp:http:upload:0').getChild('put').attrs.url;
        const get = stanza.getChild('slot', 'urn:xmpp:http:upload:0').getChild('get').attrs.url;

        return { get, put }
      })
    );
  }
}
