import { NgClass, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, ViewChild, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwiperOptions, Swiper } from 'swiper';
import { SwiperModule } from 'swiper/angular';

import * as Matter from 'matter-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SwiperModule, NgClass],
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
  isOpen = false;
  renderer: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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

    // MATTER
    document.addEventListener('DOMContentLoaded', function() {
      const Matter = (window as any).Matter,
            Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Body = Matter.Body,
            Composite = Matter.Composite,
            Bodies = Matter.Bodies,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse;

      const engine = Engine.create(),
            world = engine.world;

      engine.world.gravity.y = 4;

      let containerWidth = window.innerWidth * 1.01;
      let containerHeight = 439;

      if (window.innerWidth < 1919 && window.innerWidth > 1511) {
          containerHeight = 400;
      }

      if (window.innerWidth < 1511 && window.innerWidth > 833) {
          containerHeight = 400;
      }

      if (window.innerWidth < 833) {
          containerHeight = 450;
      }

      const matterContainer = document.querySelector('.matter') as HTMLElement;
      const matterRect = matterContainer.getBoundingClientRect();

      const render = Render.create({
          element: matterContainer,
          engine: engine,
          canvas: document.getElementById('matterCanvas') as HTMLCanvasElement,
          options: {
              width: containerWidth,
              height: containerHeight,
              wireframes: false,
              background: 'transparent'
          }
      });

      Render.run(render);

      const runner = Runner.create();
      Runner.run(runner, engine);

      const draggableBodies: { body: Matter.Body, element: HTMLElement }[] = [];
      const draggableElements = Array.from(document.querySelectorAll('.draggable')) as HTMLElement[];

      function setElementToAbsolute(el: HTMLElement, randomX: number, randomY: number) {
          el.style.position = 'absolute';
          el.style.left = `${randomX}px`;
          el.style.top = `${randomY}px`;
          el.style.userSelect = 'none';
          el.style.cursor = 'pointer';
      }

      draggableElements.forEach(function(el) {
          const rect = el.getBoundingClientRect();
          const randomX = Math.random() * (containerWidth - rect.width);
          const randomY = Math.random() * (containerHeight - rect.height);

          const body = Bodies.rectangle(
              randomX,
              randomY,
              rect.width,
              rect.height,
              {
                  isStatic: false,
                  render: {
                      fillStyle: el.classList.contains('background-1') ? '#000' : 'transparent',
                      strokeStyle: '#000',
                      lineWidth: 1
                  }
              }
          );

          setElementToAbsolute(el, randomX, randomY);

          el.addEventListener('mousedown', onMouseDown);
          el.addEventListener('touchstart', onTouchStart, { passive: false });

          function onMouseDown(event: MouseEvent) {
              event.preventDefault();
              startDrag(event.clientX, event.clientY);
          }

          function onTouchStart(event: TouchEvent) {
              event.preventDefault();
              const touch = event.touches[0];
              startDrag(touch.clientX, touch.clientY);
          }

          function startDrag(clientX: number, clientY: number) {
              (el as any).isDragging = true;
              body.isStatic = true;
              (el as any).dragStartX = clientX;
              (el as any).dragStartY = clientY;
              (el as any).bodyStartX = body.position.x;
              (el as any).bodyStartY = body.position.y;
              el.style.zIndex = '1000';

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('touchmove', onTouchMove, { passive: false });
          }

          function onMouseMove(event: MouseEvent) {
              if ((el as any).isDragging) {
                  moveElement(event.clientX, event.clientY);
              }
          }

          function onTouchMove(event: TouchEvent) {
              if ((el as any).isDragging) {
                  const touch = event.touches[0];
                  moveElement(touch.clientX, touch.clientY);
              }
          }

          function moveElement(clientX: number, clientY: number) {
              const deltaX = clientX - (el as any).dragStartX;
              const deltaY = clientY - (el as any).dragStartY;
              let newX = (el as any).bodyStartX + deltaX;
              let newY = (el as any).bodyStartY + deltaY;

              newX = Math.max(Math.min(newX, containerWidth - rect.width), 0);
              newY = Math.max(Math.min(newY, containerHeight - rect.height), 0);

              Body.setPosition(body, { x: newX, y: newY });
          }

          document.addEventListener('mouseup', onMouseUp);
          document.addEventListener('touchend', onTouchEnd);

          function onMouseUp() {
              if ((el as any).isDragging) {
                  endDrag();
              }
          }

          function onTouchEnd() {
              if ((el as any).isDragging) {
                  endDrag();
              }
          }

          function endDrag() {
              el.style.position = 'absolute';
              el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
              el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
              el.style.zIndex = '';
              (el as any).isDragging = false;

              body.isStatic = false;

              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('touchmove', onTouchMove);
          }

          Composite.add(world, body);
          draggableBodies.push({ body: body, element: el });
      });

      const ground = Bodies.rectangle(containerWidth / 2, containerHeight + 30, containerWidth, 60, { isStatic: true });
      const leftWall = Bodies.rectangle(-30, containerHeight / 2, 60, containerHeight, { isStatic: true });
      const rightWall = Bodies.rectangle(containerWidth + 30, containerHeight / 2, 60, containerHeight, { isStatic: true });
      const ceiling = Bodies.rectangle(containerWidth / 2, -30, containerWidth, 60, { isStatic: true });

      Composite.add(world, [ground, leftWall, rightWall, ceiling]);

      const mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

      Composite.add(world, mouseConstraint);
      render.mouse = mouse;

      Matter.Events.on(engine, 'afterUpdate', function() {
          draggableBodies.forEach(function(item) {
              const body = item.body;
              const el = item.element;

              el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
              el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
              el.style.transform = `rotate(${body.angle}rad)`;
          });
      });

      Render.lookAt(render, Composite.allBodies(world));

      function endDrag() {
          draggableBodies.forEach(function(item) {
              const body = item.body;
              const el = item.element;

              if ((el as any).isDragging) {
                  setTimeout(function() {
                      el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
                      el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
                      el.style.transform = `rotate(${body.angle}rad)`;
                      (el as any).isDragging = false;
                  }, 0);
              }
          });
      }

      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    });
    // MATTER
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

  toggleForm() {
    if (this.isBrowser) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.renderer.addClass(document.body, 'no-scroll');
      } else {
        this.renderer.removeClass(document.body, 'no-scroll');
      }
    }
  }
}
