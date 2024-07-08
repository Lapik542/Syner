document.addEventListener('DOMContentLoaded', function() {
  var Matter = window.Matter,
      Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse;

  // створення двигуна
  var engine = Engine.create(),
      world = engine.world;

  // Встановлення сильнішої гравітації
  engine.world.gravity.y = 3; // Збільште це значення, щоб зробити гравітацію сильнішою

  // Константи для розмірів контейнера
  var containerWidth = window.innerWidth * 1.01;
  var containerHeight = 439;

  if (window.innerWidth < 1919 && window.innerWidth > 1511) {
      containerHeight = 400;
  }

  if (window.innerWidth < 1511 && window.innerWidth > 833) {
      containerHeight = 400;
  }

  if (window.innerWidth < 833) {
      containerHeight = 450;
  }

  // отримання контейнера Matter
  var matterContainer = document.querySelector('.matter');
  var matterRect = matterContainer.getBoundingClientRect();

  // створення рендерера
  var render = Render.create({
      element: matterContainer,
      engine: engine,
      canvas: document.getElementById('matterCanvas'),
      options: {
          width: containerWidth,
          height: containerHeight,
          wireframes: false,
          background: 'transparent'
      }
  });

  Render.run(render);

  // створення ранера
  var runner = Runner.create();
  Runner.run(runner, engine);

  // створення порожнього масиву для зберігання тіл, які можна перетягувати
  var draggableBodies = [];

  // отримання всіх перетягуваних елементів
  var draggableElements = Array.from(document.querySelectorAll('.draggable'));

  // функція для встановлення позиції елемента на абсолютну
  function setElementToAbsolute(el, randomX, randomY) {
      el.style.position = 'absolute';
      el.style.left = `${randomX}px`;
      el.style.top = `${randomY}px`;
      el.style.userSelect = 'none'; // запобігає вибору тексту
      el.style.cursor = 'pointer'; // курсор перетягування
  }

  // створення тіл для кожного перетягуваного елемента
  draggableElements.forEach(function(el, index) {
      var rect = el.getBoundingClientRect();
      var randomX = Math.random() * (containerWidth - rect.width);
      var randomY = Math.random() * (containerHeight - rect.height);

      var body = Bodies.rectangle(
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

      // робимо елемент перетягуваним
      setElementToAbsolute(el, randomX, randomY);

      // запобігаємо вибору тексту при натисканні миші та дотику
      el.addEventListener('mousedown', onMouseDown);
      el.addEventListener('touchstart', onTouchStart, { passive: false });

      function onMouseDown(event) {
          event.preventDefault();
          startDrag(event.clientX, event.clientY);
      }

      function onTouchStart(event) {
          event.preventDefault();
          var touch = event.touches[0];
          startDrag(touch.clientX, touch.clientY);
      }

      function startDrag(clientX, clientY) {
          // Встановлюємо прапорець перетягування для цього елемента
          el.isDragging = true;
          // Вимкнути гравітацію на перетягуваному тілі для плавного руху
          body.isStatic = true;
          // Зберігаємо відсоток початкового положення відносно вікна
          el.dragStartX = clientX;
          el.dragStartY = clientY;
          // Зберігаємо початкове положення тіла
          el.bodyStartX = body.position.x;
          el.bodyStartY = body.position.y;
          // Підняти елемент вгору
          el.style.zIndex = 1000;

          // додати слухачів руху миші та дотику на документ
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('touchmove', onTouchMove, { passive: false });
      }

      function onMouseMove(event) {
          if (el.isDragging) {
              moveElement(event.clientX, event.clientY);
          }
      }

      function onTouchMove(event) {
          if (el.isDragging) {
              var touch = event.touches[0];
              moveElement(touch.clientX, touch.clientY);
          }
      }

      function moveElement(clientX, clientY) {
          var deltaX = clientX - el.dragStartX;
          var deltaY = clientY - el.dragStartY;
          var newX = el.bodyStartX + deltaX;
          var newY = el.bodyStartY + deltaY;

          // Обмежуємо newX та newY в межах контейнера
          newX = Math.max(Math.min(newX, containerWidth - rect.width), 0);
          newY = Math.max(Math.min(newY, containerHeight - rect.height), 0);

          Body.setPosition(body, { x: newX, y: newY });
      }

      // обробник mouseup та touchend на документі
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchend', onTouchEnd);

      function onMouseUp(event) {
          if (el.isDragging) {
              endDrag();
          }
      }

      function onTouchEnd(event) {
          if (el.isDragging) {
              endDrag();
          }
      }

      function endDrag() {
          // Відновлюємо абсолютну позицію
          el.style.position = 'absolute';
          el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
          el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
          el.style.zIndex = ''; // Відновлюємо z-index
          el.isDragging = false;

          // Відновлюємо фізику для тіла
          body.isStatic = false;

          // видаляємо слухачів руху миші та дотику з документа
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('touchmove', onTouchMove);
      }

      // додати тіло в світ
      Composite.add(world, body);

      // зберегти тіло та елемент у масив draggableBodies
      draggableBodies.push({ body: body, element: el });
  });

  // додавання стін (щоб утримувати елементи у межах контейнера)
  var ground = Bodies.rectangle(containerWidth / 2, containerHeight + 30, containerWidth, 60, { isStatic: true });
  var leftWall = Bodies.rectangle(-30, containerHeight / 2, 60, containerHeight, { isStatic: true });
  var rightWall = Bodies.rectangle(containerWidth + 30, containerHeight / 2, 60, containerHeight, { isStatic: true });
  var ceiling = Bodies.rectangle(containerWidth / 2, -30, containerWidth, 60, { isStatic: true });

  Composite.add(world, [ground, leftWall, rightWall, ceiling]);

  // додавання керування мишею
  var mouse = Mouse.create(render.canvas),
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

  // синхронізація миші з рендером
  render.mouse = mouse;

  // оновлення позицій div елементів
  Matter.Events.on(engine, 'afterUpdate', function() {
      draggableBodies.forEach(function(item) {
          var body = item.body;
          var el = item.element;

          // Оновити позицію елемента та його обертання
          el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
          el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
          el.style.transform = `rotate(${body.angle}rad)`;
      });
  });

  // налаштування видимості рендера до сцени
  Render.lookAt(render, Composite.allBodies(world));

  // слухач для mouseup та touchend для завершення перетягування
  function endDrag(event) {
      // Закінчити перетягування для всіх елементів
      draggableBodies.forEach(function(item) {
          var body = item.body;
          var el = item.element;

          if (el.isDragging) {
              // Відновлюємо абсолютну позицію
              setTimeout(function() {
                  el.style.position = 'absolute';
                  el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
                  el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
                  el.style.zIndex = ''; // Відновлюємо z-index
                  el.isDragging = false;

                  // Відновлюємо фізику для тіла
                  body.isStatic = false;
              }, 0); // setTimeout з затримкою 0 для виконання після поточного циклу подій
          }
      });
  }

  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  // Забезпечення абсолютного позиціювання при завантаженні сторінки та зміні розміру
  function ensureAbsolutePositioning() {
      draggableBodies.forEach(function(item) {
          var el = item.element;
          var body = item.body;
          setElementToAbsolute(el, body.position.x - el.offsetWidth / 2, body.position.y - el.offsetHeight / 2);
      });
  }

  ensureAbsolutePositioning();
  window.addEventListener('resize', ensureAbsolutePositioning);
});
