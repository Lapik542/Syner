import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwiperOptions, Swiper } from 'swiper';
import { SwiperModule } from 'swiper/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SwiperModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentSection: string = '';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 60) {
        current = section.getAttribute('id')!;
      }
    });

    this.currentSection = current;
  }

  scrollToSection(section: string) {
    document.getElementById(section)!.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };
}