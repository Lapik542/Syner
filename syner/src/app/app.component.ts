import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  

  
}

export class AppComponent implements AfterViewInit {

  ngAfterViewInit() {
    document.addEventListener('DOMContentLoaded', () => {
      const Engine = Matter.Engine;
      const Render = Matter.Render;
      const World = Matter.World;
      const Bodies = Matter.Bodies;
      const Mouse = Matter.Mouse;
      const MouseConstraint = Matter.MouseConstraint;

      // Створення двигуна та світу
      const engine = Engine.create();
      const world = engine.world;

      // Створення рендеру
      const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          wireframes: false,
          background: '#fff'
        }
      });

      Render.run(render);

      // Створення обмеження миші
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

      World.add(world, mouseConstraint);

      // Додавання елементів
      const elements = document.querySelectorAll('.draggable');

      elements.forEach((element: HTMLElement, index) => {
        const rect = element.getBoundingClientRect();

        const body = Bodies.rectangle(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          rect.width,
          rect.height,
          { restitution: 0.5, friction: 0.2 }
        );

        World.add(world, body);

        element.style.position = 'absolute';

        Matter.Events.on(engine, 'afterUpdate', () => {
          element.style.left = `${body.position.x - rect.width / 2}px`;
          element.style.top = `${body.position.y - rect.height / 2}px`;
          element.style.transform = `rotate(${body.angle}rad)`;
        });
      });

      // Запуск двигуна
      Engine.run(engine);
    });
  }
}