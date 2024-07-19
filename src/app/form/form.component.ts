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
  select: string = 'from-500'; // Default value
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

    if (!this.username || !this.email || !this.select || !this.project) {
      return;
    }

    const postData = {
      name: this.username,
      email: this.email,
      select: this.select,
      project: this.project
    };

    console.log('Data being sent to the server:', postData);

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
          console.log('Server response:', response);
          alert('You have successfully registered!');
          this.resetForm();
        },
        error: error => {
          console.error('Error:', error);
          alert('An error occurred: ' + error.message);
        }
      }
    );
  }

  resetForm(): void {
    this.username = '';
    this.email = '';
    this.select = 'from-500'; // Reset to default value
    this.project = '';
  }
}
