import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment'
import { eventsModel, imageModel, eventBaseModel, uploadImageModel, eventByIdmodel, uploadmultiImageModel } from './events.model';



@Injectable({
    providedIn: 'root'
})
export class EventsService {
    constructor(private _httpClient: HttpClient) {
    }
    private _event: BehaviorSubject<eventsModel[] | null> = new BehaviorSubject(null);
    private _images: BehaviorSubject<imageModel[] | null> = new BehaviorSubject(null);
    private _eventDetails: BehaviorSubject<eventByIdmodel | null> = new BehaviorSubject(null);

    get event$(): Observable<eventsModel[]> {
        return this._event.asObservable();
    }

    set images(value: imageModel[]) {
        this._images.next(value);
    }

    get images$(): Observable<imageModel[]> {
        return this._images.asObservable();
    }

    get eventDetails$(): Observable<eventByIdmodel> {
        return this._eventDetails.asObservable();
    }


    getevent(): Observable<eventsModel[]> {
        return this._httpClient.get<eventsModel[]>(environment.apiURL + 'Event').pipe(
            tap((response: eventsModel[]) => {
                this._event.next(response);
            })
        );
    }
    geteventbyUserId(): Observable<eventsModel[]> {
        return this._httpClient.get<eventsModel[]>(environment.apiURL + 'Event/byUserId').pipe(
            tap((response: eventsModel[]) => {
                this._event.next(response);
            })
        );
    }
    getImagesByEvent(eventId: number): Observable<imageModel[]> {
        return this._httpClient.get<imageModel[]>(environment.apiURL + 'Image?eventId=' + eventId).pipe(

            catchError(error => {
                this._images.next([]);
                return of([]);
            }),
            tap((response: imageModel[]) => {
                this._images.next(response);
            })
        );
    }

    errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          'Something bad happened; please try again later.');
      }
    addBaseEvent(event: eventBaseModel): Observable<any> {
        const url = environment.apiURL + "Event";
        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify(event);
        return this._httpClient.post(url, body, { 'headers': headers })

    }

    getEventDaetilsbyID(eventId: number): Observable<eventByIdmodel> {
        return this._httpClient.get<eventByIdmodel>(environment.apiURL + 'Event/getbyId?eventId=' + eventId).pipe(
            tap((response: eventByIdmodel) => {
                this._eventDetails.next(response);
            })
        );
    }

    addImagetoEvent(image: uploadImageModel): Observable<any> {
        let formData: FormData = new FormData();
        formData.append('ImageFile', image.imageFile);
        formData.append('EventId', image.eventId.toString());
        formData.append('IsPublic', image.isPublic.toString());
        formData.append('Title', image.title);
        formData.append('Description', image.description);
        formData.append('Tags', image.tags);
        formData.append('UserId', image.userId.toString());
        formData.append('Price', image.price.toString());
        const url = environment.apiURL + "Image/Upload";
        return this._httpClient.post(url, formData)

    }
    addImagestoEvent(image: uploadmultiImageModel): Observable<any> {

        let formData: FormData = new FormData();
        for (var i = 0; i < image.imageFile.length; i++) {
            formData.append("ImageFile", image.imageFile[i]);
        }
        formData.append('EventId', image.eventId.toString());
        formData.append('IsPublic', image.isPublic.toString());
        formData.append('Title', image.title);
        formData.append('Description', image.description);
        formData.append('Tags', image.tags);
        formData.append('Price', image.price.toString());
        const url = environment.apiURL + "Image/UploadImages";
        return this._httpClient.post(url, formData)

    }

    eventAddPermission(data: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiURL}Event/addpermission`, data);
    }

    eventDeletePermission(eventId, permissionId): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiURL}Event/permission`, {
            params: {
                permissionId: permissionId,
                eventId: eventId
            }
        });
    }

    getEventById(eventId: number): Observable<any> {
        return this._httpClient.get(`${environment.apiURL}Event/getbyId?eventId=${eventId}`)
    }

    updateEvent(updatedEvent: any) {
        return this._httpClient.put(`${environment.apiURL}Event`, updatedEvent);
    }

    deleteImagebyId(imageId: string): Observable<any> {
        const url = environment.apiURL + "Image?imageGuid=" + imageId;
        return this._httpClient.delete<any>(url);
    }

    updateImageDetails(imageId: any, imageDetails: uploadImageModel): Observable<any> {
        const url = environment.apiURL + "Image/update?imageGuid=" + imageId;
        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify(imageDetails);
        return this._httpClient.put(url, body, { 'headers': headers })

    }

    updateImageViewCount(ImageGuiID:any):Observable<any>{
        return this._httpClient.put(`${environment.apiURL}Dashboard/UpdateImageViewCount?imageGuid=${ImageGuiID}`,"");

    }

    // /**
    //  * Delete the event
    //  *
    //  * @param event
    //  */
    //  deleteEvent(event: Event): Observable<boolean>
    //  {
    //      return this._httpClient.delete<boolean>('api/apps/events', {params: {id: event.}}).pipe(
    //          map((isDeleted: boolean) => {
 
    //              // Update the notes
    //              this.getevent().subscribe();
 
    //              // Return the deleted status
    //              return isDeleted;
    //          })
    //      );
    //  }


}