import { Component, OnInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import Matter from 'matter-js';

@Component({
  selector: 'app-matter',
  templateUrl: './matter.component.html',
  styleUrls: ['./matter.component.scss']
})
export class MatterComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
        const Engine = Matter.Engine,
              Render = Matter.Render,
              Runner = Matter.Runner,
              Body = Matter.Body,
              Composite = Matter.Composite,
              Bodies = Matter.Bodies,
              MouseConstraint = Matter.MouseConstraint,
              Mouse = Matter.Mouse;

        const engine = Engine.create();
        const world = engine.world;
        engine.world.gravity.y = 1;

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

        const runner = Runner.create();
        Runner.run(runner, engine);

        const draggableElements = Array.from(document.querySelectorAll('.draggable')) as HTMLElement[];
        const draggableBodies: { body: Matter.Body, element: HTMLElement }[] = [];

        draggableElements.forEach(el => {
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

          el.addEventListener('mousedown', (event) => startDrag(event, el, body, containerWidth, containerHeight));
          el.addEventListener('touchstart', (event) => startDrag(event, el, body, containerWidth, containerHeight), { passive: false });

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

        Matter.Events.on(engine, 'afterUpdate', () => {
            draggableBodies.forEach(item => {
                const body = item.body;
                const el = item.element;

                el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
                el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
                el.style.transform = `rotate(${body.angle}rad)`;
            });
        });

        function startDrag(event: MouseEvent | TouchEvent, el: HTMLElement, body: Matter.Body, containerWidth: number, containerHeight: number) {
            event.preventDefault();
            const clientX = ('touches' in event) ? event.touches[0].clientX : event.clientX;
            const clientY = ('touches' in event) ? event.touches[0].clientY : event.clientY;

            el.style.position = 'absolute';
            el.style.userSelect = 'none';
            el.style.cursor = 'pointer';
            el.style.zIndex = '1000';

            (el as any).isDragging = true;
            body.isStatic = true;
            (el as any).dragStartX = clientX;
            (el as any).dragStartY = clientY;
            (el as any).bodyStartX = body.position.x;
            (el as any).bodyStartY = body.position.y;

            const onMouseMove = (moveEvent: MouseEvent) => moveElement(moveEvent, el, body, containerWidth, containerHeight);
            const onTouchMove = (moveEvent: TouchEvent) => moveElement(moveEvent, el, body, containerWidth, containerHeight);

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', onTouchMove, { passive: false });

            const endDrag = () => {
                if ((el as any).isDragging) {
                    el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
                    el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
                    el.style.zIndex = '';
                    (el as any).isDragging = false;
                    body.isStatic = false;

                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('touchmove', onTouchMove);
                }
            };

            document.addEventListener('mouseup', endDrag, { once: true });
            document.addEventListener('touchend', endDrag, { once: true });
        }

        function moveElement(event: MouseEvent | TouchEvent, el: HTMLElement, body: Matter.Body, containerWidth: number, containerHeight: number) {
            const clientX = ('touches' in event) ? event.touches[0].clientX : event.clientX;
            const clientY = ('touches' in event) ? event.touches[0].clientY : event.clientY;

            const deltaX = clientX - (el as any).dragStartX;
            const deltaY = clientY - (el as any).dragStartY;
            let newX = (el as any).bodyStartX + deltaX;
            let newY = (el as any).bodyStartY + deltaY;

            newX = Math.max(Math.min(newX, containerWidth - el.offsetWidth), 0);
            newY = Math.max(Math.min(newY, containerHeight - el.offsetHeight), 0);

            Body.setPosition(body, { x: newX, y: newY });
        }
        function setElementToAbsolute(el: HTMLElement, randomX: number, randomY: number) {
          el.style.position = 'absolute';
          el.style.left = `${randomX}px`;
          el.style.top = `${randomY}px`;
          el.style.userSelect = 'none';
          el.style.cursor = 'pointer';
      }
    }
}
