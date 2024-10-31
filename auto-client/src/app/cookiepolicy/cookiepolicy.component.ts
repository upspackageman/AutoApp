import { CommonModule } from '@angular/common';
import { Component, TemplateRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MessageService } from '../_services/message.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cookiepolicy',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './cookiepolicy.component.html',
  styleUrl: './cookiepolicy.component.css',
})
export class CookiepolicyComponent {
 
  private messageService = inject(MessageService);
  public dialog = inject(MatDialog);

  
  contactForm: FormGroup | any;
  subject = 'Cookie Policy';
  type = 'Cookie Policy Inquiry';
  contactUs: any = {};
  hide = signal(true);
  errorMessage = signal('');

  /**
   *
   */
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(1)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  
  }

  
  closeDialog(): void {
    this.dialog.closeAll();
  }




  formatPhoneNumber(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (input.length > 3 && input.length <= 6) {
      input = `(${input.slice(0, 3)}) ${input.slice(3)}`;
    } else if (input.length > 6) {
      input = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(
        6,
        10
      )}`;
    }
    this.contactForm.get('phone').setValue(input, { emitEvent: false });
  }

  emailFormatter(event: any) {
    let input = event.target.value;
    this.contactForm.get('email').setValue(input, { emitEvent: false });
  }

  messageFormatter(event: any) {
    let input = event.target.value;
    this.contactForm.get('message').setValue(input, { emitEvent: false });
  }

  firstNameFormatter(event: any) {
    let input = event.target.value;
    console.log(input);
    this.contactForm.get('firstName').setValue(input, { emitEvent: false });
  }

  lastNameFormatter(event: any) {
    let input = event.target.value;
    this.contactForm.get('lastName').setValue(input, { emitEvent: false });
  }

  formValid() {
    if (
      this.contactForm.get('firstName').valid &&
      this.contactForm.get('lastName').valid &&
      this.contactForm.get('email').valid &&
      this.contactForm.get('phone').valid &&
      this.contactForm.get('message').valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  send(templateRef: TemplateRef<any>) {
    this.messageService
      .sendPolicyMessage(
        this.contactForm.get('firstName').value,
        this.contactForm.get('lastName').value,
        this.contactForm.get('phone').value,
        this.contactForm.get('email').value,
        this.subject,
        this.type,
        this.contactForm.get('message').value
      )
      .subscribe({
        next: (response) =>{
          console.log('IP Logged Successfully:', response),
          this.contactForm.get('firstName').setValue('', { emitEvent: false }),
          this.contactForm.get('email').setValue('', { emitEvent: false }),
          this.contactForm.get('phone').setValue('', { emitEvent: false }),
          this.contactForm.get('lastName').setValue('', { emitEvent: false }),
          this.contactForm.get('firstName').setValue('', { emitEvent: false }),
          this.contactForm.get('message').setValue('', { emitEvent: false }),
          this.closeDialog(),
          this.thankYou(templateRef)

        },
        error: (error) => console.error('Error logging IP:', error),
      });
  }

  thankYou(templateRef: TemplateRef<any>){
    this.dialog.open(templateRef, {
      height: '400px',
      width: '600px',
      hasBackdrop: true,
      disableClose: false,
    });
  }

  contact(templateRef: TemplateRef<any>) {

    this.contactForm.get('firstName').setValue('', { emitEvent: false });
    this.contactForm.get('email').setValue('', { emitEvent: false });
    this.contactForm.get('phone').setValue('', { emitEvent: false });
    this.contactForm.get('lastName').setValue('', { emitEvent: false });
    this.contactForm.get('firstName').setValue('', { emitEvent: false });
    this.contactForm.get('message').setValue('', { emitEvent: false });

    this.dialog.open(templateRef, {
      width: '200%',
      height: '98%',
      hasBackdrop: true,
      disableClose: false,
    });
  }
}
