import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

//import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/do';
//import 'rxjs/add/operator/toPromise';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatsocketService {
  private url = "http://localhost:3000/";
  private socket;

  constructor( private http: HttpClient, public cookie: CookieService) {
 
    this.socket = io(this.url);
      console.log("chat socket service called.")
   }



   public verifyUser = () => {

    return Observable.create((observer) => {
      
      this.socket.on('verifyUser',(data) => {
        observer.next(data);
      });// end Socket
    });//end Observable
   }//end verifyUser

     
     public setUser = (authToken) => {
      this.socket.emit('set-user', authToken);
    }//end setUser

    public getAllActiveGroups = () => {
      console.log("get all active groups called.")
      return Observable.create((observer) => {
        this.socket.on('allRooms', (activeRoomList) => {
          observer.next(activeRoomList)
        })
      })
    }


    public activeGroups(data): Observable<any> {
    

      return this.http.get(`${this.url}api/v1/group/all?authToken=${data.authToken}`)
    }


    public createRoom = (roomName) => {

       console.log(roomName)
        this.socket.emit('create-room', roomName )

    }

  /*   public joinRoom = (data) => {
        this.socket.emit('join-room', data)
    } */



    public deActiveGroup = (data) => {
     this.socket.emit('deActivateRoom', data)
    }

    public deActivateGroupDB(data): Observable<any> {

      const params = new HttpParams()
      .set ( 'authToken', data.authToken)
      .set( 'title', data.roomName)

        return this.http.put(`${this.url}api/v1/group/deactive`, params)
    }










    public onlineUserList = () => {

      return Observable.create((observer) => {
        this.socket.on('online-user-list',(userList) => {
          observer.next(userList);
        });// end Socket
      });//end Observable
     }//end onlineUserList

     public groupOnlineUserList = () => {
       console.log("group online users called.")

      return Observable.create((observer) => {
        this.socket.on('group-online-users', (groupOnlineUserList) => {
          observer.next(groupOnlineUserList);
        });// end Socket
      });//end Observable
     }//end onlineUserList




     public sendChatMessage = (chatMsgObject) => {
      this.socket.emit('chat-msg', chatMsgObject);
    } // end getChatMessage


   
  public editRoomName(editedRoomData): Observable<any> {

    const params = new HttpParams()
    .set( 'authToken', editedRoomData.authToken)
    .set('title', editedRoomData.newRoomName)

    return this.http.put(`${this.url}api/v1/group/edit`, params)

  } //emitting the edited room value

  public roomNameEdited = () =>{

    
    return Observable.create((observer) => {
      this.socket.on('room-name-edited', (editedRoomData) => {
        console.log("roomNameedited from service")
        observer.next(editedRoomData)
      })
    })
  }

  public switchRoom = (joinRoomName) => {
      this.socket.emit('switch-room', joinRoomName)
  }


  public chatByUserId = () => {
    return Observable.create((observer) => {
          this.socket.on('msg-received', (data) => {
            observer.next(data)
          })
    })
  }



  public personTyping = (data) => {

    this.socket.emit('i-am-typing', data)

  }

  public checkIfTyping = () => {
    return Observable.create((observer) => {
      this.socket.on('typing', (data) => {
        observer.next(data)
      })
    })

  }


  public iJoinTheRoom = () => {

    return Observable.create((obserever) => {
      this.socket.on('joinedRoom', (fullName) => {
        obserever.next(fullName)
      })
    })

  }


  public iLeftTheRoom = () => {

    return Observable.create((obserever) => {
      this.socket.on('leftRoom', (fullName) => {
        obserever.next(fullName)
      })
    })
    
  }


  public deactivedGroup = () => {
    return Observable.create((observer) => {
      this.socket.on('group-deactivated', (name) => {
        observer.next(name)
      })
    })
  }











  public deleteRoom = (roomName) => {
    this.socket.emit('deleteThisRoom', roomName)

  }

  public confirmDeletion = () => {

    return Observable.create((obserever) => {
      this.socket.on('room-deleted', () => {
        obserever.next()
      })
    })
    
  }

  

  
  public generateMail = (tempData) => {
    this.socket.emit('invitaion-mail', tempData)
  }



  public getChat(nameOfRoom, skip): Observable<any> {

    return this.http.get(`${this.url}api/v1/chat/get/for/group?skip=${skip}&chatRoom=${nameOfRoom}&authToken=${this.cookie.get('authToken')}`)
      //.do(data => console.log('Data Received'));
  }

     public exitSocket = () => {
      this.socket.disconnect();
    }// end exit socket

    public disconnectedSocket = () => {

      return Observable.create((observer) => {
        this.socket.on('disconnect',() => {
          observer.next();
        });// end Socket
      });//end Observable
     }//end disconnectedSocket 
     

     public disconnect = () => {
       this.socket.emit('disconnect')
     }


     public createGroup(data): Observable<any> {

      const params = new HttpParams()
      .set( 'title', data.title)
      .set ( 'authToken', data.authToken)
    

         return this.http.post(`${this.url}api/v1/group/create`, params)       


     }

     public deleteGroup(data): Observable<any> {

      const params = new HttpParams()
      .set( 'title', data.title)
      .set ( 'authToken', data.authToken)
    

         return this.http.post(`${this.url}api/v1/group/delete`, params)       


     }


     public handleError(err: HttpErrorResponse){
      let errorMessage = '';
      if(err.error instanceof Error){
        errorMessage=`An error occurred: ${err.error.message}`;
       }
       else {
        errorMessage=`Server returned code: ${err.status}, error message is : ${err.error.message}`;
           }//endcondition *if
       console.error(errorMessage);
       return Observable.throw;
      }//end HandleError





}
