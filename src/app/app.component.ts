import { NgClass, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, ViewChild, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
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
    if (this.isBrowser) {
      this.updateCurrentSection();
      this.handleScroll();
    }
  }

  @ViewChild('swiper') swiper: Swiper | undefined;
  activeSlideIndex: number = 0;
  swiperConfig: SwiperOptions = {};

  private aboutUsSection: HTMLElement | null = null;
  private aboutUsTexts: NodeListOf<HTMLElement> | null = null;

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.swiperConfig = {
      slidesPerView: 3,
      pagination: { clickable: true },
      on: {
        slideChange: () => {
          if (this.isBrowser) {
            this.activeSlideIndex = this.swiper?.activeIndex || 0;
          }
        }
      },
    };
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.aboutUsSection = document.querySelector('.about-us-section');
      if (this.aboutUsSection) {
        this.aboutUsTexts = this.aboutUsSection.querySelectorAll('div');
        this.handleScroll();
      }
    }
  }

  updateCurrentSection() {
    if (this.isBrowser) {
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
  }

  handleScroll() {
    if (!this.isBrowser || !this.aboutUsSection || !this.aboutUsTexts) return;

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
    if (this.isBrowser) {
      document.getElementById(section)!.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSwiperDragMove() {
    if (this.isBrowser && this.swiper) {
      const activeIndex = this.swiper.activeIndex;
      if (activeIndex !== undefined && activeIndex !== null) {
        this.activeSlideIndex = activeIndex;
      }
    }
  }

  onSwiper(swiper: Swiper) {
    if (this.isBrowser) {
      this.swiper = swiper;
    }
  }

  goToSlide(index: number) {
    if (this.isBrowser && this.swiper) {
      this.swiper.slideTo(index);
      this.activeSlideIndex = index;
    }
  }

  scrollToActiveRectangle() {
    if (this.isBrowser) {
      const activeRect = document.getElementById(`rect${this.activeSlideIndex + 1}`);
      if (activeRect) {
        activeRect.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }

  isOpen = false;

  toggleForm() {
    if (this.isBrowser) {
      this.isOpen = !this.isOpen;
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }
}
