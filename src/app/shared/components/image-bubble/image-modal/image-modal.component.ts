import { Component, OnInit } from '@angular/core';
import { IonImg } from "@ionic/angular/standalone";

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
  standalone: true,
  imports: [IonImg],
})



export class ImageModalComponent  implements OnInit {
  public image: any;

  constructor() { }

  ngOnInit() {}

}
