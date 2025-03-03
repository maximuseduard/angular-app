import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RequestDestroyHook } from '@services/request-destroy-hook/request-destroy-hook.service';
import { UserService } from '@services/user/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs';
import { TokenService } from '@services/token/token.service';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl<string>('john@gmail.com', [
      Validators.required,
      Validators.email,
      Validators.maxLength(100),
    ]),
    password: new FormControl<string>('123@sadASD##', [
      Validators.required,
      Validators.maxLength(50),
    ]),
  });

  constructor(
    private readonly _requestDestroyHook: RequestDestroyHook,
    private readonly _router: Router,
    private readonly _tokenService: TokenService,
    private readonly _userService: UserService
  ) {}

  login() {
    const { email, password } = this.loginForm.value;

    console.log({ email, password });

    if (!email || !password) return;

    this._userService
      .login(email, password)
      .pipe(takeUntil(this._requestDestroyHook.destroy$))
      .subscribe({
        next: ({ accessToken }) => {
          this._tokenService.setAuthToken(accessToken);

          this._router.navigate(['/orders']);
        },
      });
  }
}
