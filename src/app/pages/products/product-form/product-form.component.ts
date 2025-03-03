import { Component } from '@angular/core';
import { PageTitleComponent } from 'app/components/page-title/page-title.component';

@Component({
  selector: 'app-product-form',
  imports: [PageTitleComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {}
