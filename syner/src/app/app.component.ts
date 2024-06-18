import { NgClass } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwiperOptions, Swiper } from 'swiper';
import { SwiperModule } from 'swiper/angular';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SwiperModule, NgClass],
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

  @ViewChild('swiper') swiper: Swiper | undefined;
  activeSlideIndex: number = 0;
  swiperConfig: SwiperOptions = {};

  constructor() {}

  ngOnInit() {
    this.swiperConfig = {
      slidesPerView: 3,
      spaceBetween: 40,
      pagination: { clickable: true },
      on: {
        slideChange: () => {
          this.activeSlideIndex = this.swiper?.activeIndex || 0;
        }
      },
    };
  }

  onSwiper(swiper: Swiper) {
    this.swiper = swiper;
  }

  goToSlide(index: number) {
    if (this.swiper) {
      this.swiper.slideTo(index);
    }
  }

  scrollToActiveRectangle() {
    const activeRect = document.getElementById(`rect${this.activeSlideIndex + 1}`);
    if (activeRect) {
      activeRect.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
}