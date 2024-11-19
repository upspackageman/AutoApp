import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormControl,  FormGroup,  FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { Router } from '@angular/router';
import { AdminAuthService } from '../_services/admin-auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm:FormGroup | any;
  modelLogin: any = {};
  hide = signal(true);

  
  errorMessage = signal('');

  constructor(private fb: FormBuilder,private router: Router,private adminAuthService:AdminAuthService){
    this.loginForm = this.fb.group({
      login: new FormControl('', [Validators.required, Validators.minLength(1)]),
      password: new FormControl('', [Validators.required, Validators.minLength(1)])
    });
    merge(
      this.loginForm.get('login')!.statusChanges,
      this.loginForm.get('login')!.valueChanges,
      this.loginForm.get('password')!.statusChanges,
      this.loginForm.get('password')!.valueChanges
    )
  }


  updateErrorMessage() {
    
    const loginControl = this.loginForm.get('login');
    const passwordControl = this.loginForm.get('password');

    if (loginControl?.hasError('minlength') || loginControl?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (passwordControl?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else {
      this.errorMessage.set('');
    }
  }


  login() {
    this.modelLogin.login = this.loginForm.value.login;
    this.modelLogin.password = this.loginForm.value.password;
    this.adminAuthService.login(this.modelLogin).subscribe(_ => {
      
      this.redirect();
    }, error => {
      console.error(error);
    })
  }

  async redirect() {
    await this.router.navigate(['admin']);
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
