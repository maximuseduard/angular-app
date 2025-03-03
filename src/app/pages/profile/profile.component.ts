import { Component } from '@angular/core';
import { PageTitleComponent } from 'app/components/page-title/page-title.component';

@Component({
  selector: 'app-profile',
  imports: [PageTitleComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
