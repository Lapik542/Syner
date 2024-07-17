import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { error } from 'console';
import { of, switchMap } from 'rxjs';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  // standalone: true,
  // imports: [
  //   FormsModule,
  //   NgClass,
  //   HttpClientModule
  // ],
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  username: string = '';
  email: string = '';
  select: string = '';
  project: string = '';

  @Input() isOpen: boolean = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) {
    this.http.post('http://localhost:3000', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .pipe(
      switchMap((response: any) => {
        return of()
      })
    ).subscribe(
        {
          next: (response: any) => {
            console.log('Відповідь сервера:', response);
            alert('Користувач зареєстрований!');
            this.resetForm();
          },
          error: error => {
            console.error('Помилка:', error);
            alert('Сталася помилка: ' + error.message);
          }
        }
      );
  }

  toggleForm() {
    this.isOpen = !this.isOpen;
    this.toggle.emit();
  }

  registerUser(event: Event): void {
    event.preventDefault();

    const postData = {
      name: this.username,
      email: this.email,
      select: this.select,
      project: this.project
    };

    console.log('Дані, що надсилаються на сервер:', postData);


  }

  resetForm(): void {
    this.username = '';
    this.email = '';
    this.select = '';
    this.project = '';
  }
}
