import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  username: string = '';
  email: string = '';
  select: string = 'from-500'; // Встановлення значення за замовчуванням
  project: string = '';

  @Input() isOpen: boolean = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

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

    this.http.post<{ message: string }>('http://localhost:3000/syner/users', postData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .pipe(
      switchMap((response: any) => {
        return of(response);
      })
    ).subscribe(
      {
        next: (response: any) => {
          console.log('Відповідь сервера:', response);
          alert(response.message);
          this.resetForm(); // Очищення форми після успішної відправки
        },
        error: error => {
          console.error('Помилка:', error);
          alert('Сталася помилка: ' + error.message);
        }
      }
    );
  }

  resetForm(): void {
    this.username = '';
    this.email = '';
    this.select = 'from-500'; // Повернення значення за замовчуванням
    this.project = '';
  }
}
