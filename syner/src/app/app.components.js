const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;

// Створення двигуна
const engine = Engine.create();
const { world } = engine;

// Створення рендера
const render = Render.create({
  element: document.querySelector('.matter'),
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false,
    background: '#f0f0f0'
  }
});

Render.run(render);

// Створення реннера
const runner = Runner.create();
Runner.run(runner, engine);

// Функція для створення прямокутників з прозорим фоном і текстом
function createLabeledRectangle(x, y, width, height, radius, label) {
  const rect = Bodies.rectangle(x, y, width, height, {
    chamfer: { radius: radius },
    render: { fillStyle: 'transparent', strokeStyle: '#000000', lineWidth: 1 }
  });

  const labelDiv = document.createElement('div');
  labelDiv.className = 'rectangle-label';
  labelDiv.innerText = label;
  document.querySelector('.matter').appendChild(labelDiv);
  rect.labelDiv = labelDiv;

  return rect;
}

// Створення 12 прямокутників з мітками
const rectangles = [];
for (let i = 0; i < 12; i++) {
  const x = 150 + (i % 4) * 150; // Розташування по X
  const y = 100 + Math.floor(i / 4) * 100; // Розташування по Y
  const label = `Rect ${i + 1}`; // Мітка
  const rect = createLabeledRectangle(x, y, 100, 50, 16, label);
  rectangles.push(rect);
}

// Додавання прямокутників до світу
Composite.add(world, rectangles);

// Додавання землі (необов'язково)
const ground = Bodies.rectangle(400, 590, 810, 60, { isStatic: true });
Composite.add(world, ground);

// Оновлення позицій міток при русі
Events.on(engine, 'afterUpdate', function() {
  rectangles.forEach(rect => {
    const { x, y } = rect.position;
    rect.labelDiv.style.transform = `translate(${x - 50}px, ${y - 25}px)`;
  });
});

// Додавання подій миші для перетягування прямокутників
rectangles.forEach(rect => {
  Events.on(rect, 'mousedown', event => {
    const body = event.source;
    const mouse = event.mouse;
    const offset = {
      x: mouse.absolute.x - body.position.x,
      y: mouse.absolute.y - body.position.y
    };

    function mousemove(event) {
      const mouse = event.mouse;
      body.position.x = mouse.absolute.x - offset.x;
      body.position.y = mouse.absolute.y - offset.y;
    }

    function mouseup() {
      Events.off(render.canvas, 'mousemove', mousemove);
      Events.off(render.canvas, 'mouseup', mouseup);
    }

    Events.on(render.canvas, 'mousemove', mousemove);
    Events.on(render.canvas, 'mouseup', mouseup);
  });
});

// Додавання елементу canvas до контейнера matter
const canvas = render.canvas;
const matterContainer = document.querySelector('.matter');
matterContainer.appendChild(canvas);
