import { Component, EventEmitter, Input, input, Output } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  username: string = '';
  email: string = '';
  select: string = '';
  project: string = '';


  @Input() isOpen: boolean = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  toggleForm() {
    this.isOpen = !this.isOpen;
    this.toggle.emit();
  }

  // FORM

  registerUser(event: Event): void {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', this.username);
    formData.append('email', this.email);
    formData.append('select', this.select);
    formData.append('project', this.project);

    const postData = {
      name: this.username,
      email: this.email,
      select: this.select,
      project: this.project
    };

    console.log(postData);


    // this.http.post('http://localhost:3000/syner/users', postData)
    //   .subscribe(
    //     (response: any) => {
    //       alert('Користувач зареєстрований!');
    //       this.resetForm();
    //     },
    //     (error: any) => {
    //       alert('Сталася помилка: ' + error.message);
    //     }
    //   );
  }

  resetForm(): void {
    this.username = '';
    this.email = '';
    this.select = '';
    this.project = '';
  }
}
