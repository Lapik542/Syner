document.addEventListener("DOMContentLoaded", function() {
    const { Engine, Render, Runner, Bodies, Mouse, MouseConstraint, World, Events } = Matter;

    const sectionWidth = document.querySelector('.matter-section').offsetWidth;
    const sectionHeight = document.querySelector('.matter-section').offsetHeight;

    const engine = Engine.create();
    const render = Render.create({
        canvas: document.getElementById('matterCanvas'),
        engine: engine,
        options: {
            width: sectionWidth,
            height: sectionHeight,
            wireframes: false
        }
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

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

    World.add(engine.world, mouseConstraint);

    render.mouse = mouse;

    const bodies = [];
    const elements = document.querySelectorAll('.draggable');

    elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();

        const body = Bodies.rectangle(
            Math.max(rect.left + rect.width / 6, rect.width / 4),  // Початкова позиція x
            Math.max(rect.top + rect.height / 6, rect.height / 4),   // Початкова позиція y
            rect.width,
            rect.height,
            {
                restitution: 0.8,
                frictionAir: 0.1,
                render: {
                    fillStyle: element.classList.contains('background-1') ? '#000' : 'transparent',
                    strokeStyle: '#000',
                    lineWidth: 1
                }
            }
        );

        bodies.push(body);
        World.add(engine.world, body);

        element.style.position = 'absolute';
        function updateElementPosition() {
            const pos = body.position;
            // Обмежуємо позицію елементів в межах секції .matter-section
            const maxX = sectionWidth - rect.width / 2;
            const maxY = sectionHeight - rect.height / 2;
            element.style.left = `${Math.min(Math.max(pos.x - rect.width / 2, rect.width / 2), maxX)}px`;
            element.style.top = `${Math.min(Math.max(pos.y - rect.height / 2, rect.height / 2), maxY)}px`;
        }
        Events.on(engine, 'afterUpdate', updateElementPosition);

        element.addEventListener('mousedown', function(event) {
            event.preventDefault();
            mouseConstraint.body = body;
            mouseConstraint.constraint.pointA = { x: event.offsetX, y: event.offsetY };
        });

        element.addEventListener('mouseup', function(event) {
            mouseConstraint.body = null;
            mouseConstraint.constraint.pointA = null;
        });

        element.addEventListener('mouseleave', function(event) {
            mouseConstraint.body = null;
            mouseConstraint.constraint.pointA = null;
        });

        element.addEventListener('mousemove', function(event) {
            if (mouseConstraint.body === body) {
                mouseConstraint.constraint.pointA = { x: event.offsetX, y: event.offsetY };
            }
        });
    });

    Engine.run(engine);
});
