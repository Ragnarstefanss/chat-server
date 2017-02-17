import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import {Router, ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  roomId : string;
  messages : string[];
  newChatInput: string;
  constructor(private chatService : ChatService, private router: Router,
     private route: ActivatedRoute) { }

  ngOnInit() {
    this.roomId = this.route.snapshot.params['id'];
  }

}
