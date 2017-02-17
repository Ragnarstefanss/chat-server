import { Component, OnInit } from '@angular/core';
import { ChatService} from "../chat.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  constructor(private chatService : ChatService, private router: Router) { }

  rooms: string[];
  roomName: string;


  ngOnInit() {
    this.chatService.getRoomsList().subscribe(lst => {
      this.rooms = lst;
    })

  }
     onJoinRoom() {

      console.log("joinRoom called in component");
      if(this.roomName.length < 1)
      {
        return;
      }
      this.chatService.joinRoom(this.roomName).subscribe(succeeded =>{
        if(succeeded === true)
        {
          this.router.navigate(["rooms",this.roomName]);
        }
      });
  }

}
