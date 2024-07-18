import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, ViewChild, OnInit, AfterViewInit, Inject, PLATFORM_ID, Renderer2, NgZone } from '@angular/core';
import { SwiperOptions, Swiper } from 'swiper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {


  setActiveSection(section: string) {
    this.currentSection = section;
    this.scrollToSection(section);
  }

  isBrowser: boolean;
  swiperConfig: SwiperOptions = {};
  portfolioSwiperConfig: SwiperOptions = {};
  currentSection: string = 'home';
  activeSlideIndex: number = 0;
  @ViewChild('swiper') swiper: Swiper | undefined;

  private aboutUsSection: HTMLElement | null = null;
  private aboutUsTexts: NodeListOf<HTMLElement> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private renderer: Renderer2,
  private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const isMobile = window.innerWidth < 833;
      const isTablet = window.innerWidth > 833 && window.innerWidth < 1511;

      this.swiperConfig = {
        slidesPerView: 3,
        spaceBetween: 0,
        pagination: { clickable: true },
        on: {
          slideChange: () => {
            if (this.isBrowser && this.swiper) {
              this.activeSlideIndex = this.swiper.activeIndex || 0;
            }
          }
        },
      };

      this.portfolioSwiperConfig = {
        slidesPerView: isMobile ? 1 : 3,
        spaceBetween: 40,
        pagination: { clickable: true },
        breakpoints: {
          833: { slidesPerView: 3 },
          0: { slidesPerView: 1 },
        },
        on: {
          slideChange: () => {
            if (this.isBrowser && this.swiper) {
              this.activeSlideIndex = this.swiper.activeIndex || 0;
            }
          }
        },
      };
    }
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.updateCurrentSection();
      this.handleScroll();
    }
  }

  updateCurrentSection() {
    if (this.isBrowser) {
      const sections = document.querySelectorAll('section');
      let current = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 76) {
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

  isOpen: boolean = false;

  toggleForm() {
    this.isOpen = !this.isOpen; // змінено на toggle значення
  }
}
