import { CommonModule } from '@angular/common';
import { SplashScreenService } from './../../services/splash-screen/splash-screen.service';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SplashScreenComponent {
  public showSplash = true;
  private splashScreenService = inject(SplashScreenService);
  constructor() { 
    this.splashScreenService.onChanges.subscribe((show: boolean) => {
      this.showSplash = show;
    });
  }

}
