import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-title',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
})
export class PageTitleComponent {
  title = input<string>();
  subtitle = input<string | undefined>();
  backUrl = input<string | undefined>();

  constructor(private readonly _router: Router) {}

  goBack() {
    if (this.backUrl()) {
      this._router.navigate([this.backUrl()]);
    }
  }
}
