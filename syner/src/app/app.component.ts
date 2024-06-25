import { NgClass } from '@angular/common';
import { Component, HostListener, ViewChild, OnInit, AfterViewInit } from '@angular/core';
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
export class AppComponent implements OnInit, AfterViewInit {
  currentSection: string = 'home';
  renderer: any;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateCurrentSection();
    this.handleScroll();
  }

  @ViewChild('swiper') swiper: Swiper | undefined;
  activeSlideIndex: number = 0;
  swiperConfig: SwiperOptions = {};

  private aboutUsSection: HTMLElement | null = null;
  private aboutUsTexts: NodeListOf<HTMLElement> | null = null;

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

  ngAfterViewInit() {
    this.aboutUsSection = document.querySelector('.about-us-section');
    if (this.aboutUsSection) {
      this.aboutUsTexts = this.aboutUsSection.querySelectorAll('div');
      this.handleScroll(); // Виклик handleScroll для встановлення початкового стану
    }
  }

  updateCurrentSection() {
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

  handleScroll() {
    if (!this.aboutUsSection || !this.aboutUsTexts) return;

    const sectionTop = this.aboutUsSection.getBoundingClientRect().top;
    const sectionHeight = this.aboutUsSection.offsetHeight;
    const windowHeight = window.innerHeight;

    if (sectionTop <= windowHeight / 2 && sectionTop + sectionHeight >= windowHeight / 2) {
      this.aboutUsTexts.forEach((text) => {
        text.classList.add('scrolled');
      });
    } else {
      this.aboutUsTexts.forEach((text) => {
        text.classList.remove('scrolled');
      });
    }
  }

  scrollToSection(section: string) {
    document.getElementById(section)!.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSwiperDragMove() {
    if (this.swiper) {
      const activeIndex = this.swiper.activeIndex;
      if (activeIndex !== undefined && activeIndex !== null) {
        this.activeSlideIndex = activeIndex;
      }
    }
  }

  onSwiper(swiper: Swiper) {
    this.swiper = swiper;
  }

  goToSlide(index: number) {
    if (this.swiper) {
      this.swiper.slideTo(index);
      this.activeSlideIndex = index;
    }
  }

  scrollToActiveRectangle() {
    const activeRect = document.getElementById(`rect${this.activeSlideIndex + 1}`);
    if (activeRect) {
      activeRect.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  isOpen = false;

  toggleForm() {
    this.isOpen = !this.isOpen;
    this.renderer.removeClass(document.body, 'no-scroll');
  }
}
