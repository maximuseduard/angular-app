import { Component } from '@angular/core';
import { PageTitleComponent } from 'app/components/page-title/page-title.component';

@Component({
  selector: 'app-order-form',
  imports: [PageTitleComponent],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {}
