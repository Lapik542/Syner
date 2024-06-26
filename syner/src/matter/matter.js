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

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // Set stronger gravity
    engine.world.gravity.y = 3; // Increase this value to make gravity stronger

    // Constants for container dimensions
    var containerWidth = 1758;
    if (window.innerWidth < 1919) {
        containerWidth = 1343;
    }
    var containerHeight = 439;
    if (window.innerWidth < 1919) {
        containerHeight = 400;
    }

    // get the matter container
    var matterContainer = document.querySelector('.matter');
    var matterRect = matterContainer.getBoundingClientRect();

    // create renderer
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

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // create an empty array to store draggable bodies
    var draggableBodies = [];

    // get all draggable elements
    var draggableElements = Array.from(document.querySelectorAll('.draggable'));

    // create bodies for each draggable element
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

        // make the element draggable
        el.style.position = 'absolute';
        el.style.left = `${randomX}px`;
        el.style.top = `${randomY}px`;
        el.style.userSelect = 'none'; // prevent text selection
        el.style.cursor = 'pointer'; // dragging cursor

        // prevent text selection on mouse down
        el.addEventListener('mousedown', function(event) {
            event.preventDefault();
            // Set dragging flag to this element
            el.isDragging = true;
            // Disable gravity on the body being dragged for smoother movement
            body.isStatic = true;
            // Store initial position offset relative to window
            el.dragStartX = event.clientX;
            el.dragStartY = event.clientY;
            // Store initial body position
            el.bodyStartX = body.position.x;
            el.bodyStartY = body.position.y;
            // Bring element to front
            el.style.zIndex = 1000;
        });

        // handle mouse move on document
        document.addEventListener('mousemove', function(event) {
            if (el.isDragging) {
                var deltaX = event.clientX - el.dragStartX;
                var deltaY = event.clientY - el.dragStartY;
                var newX = el.bodyStartX + deltaX;
                var newY = el.bodyStartY + deltaY;

                // Constrain newX and newY within container bounds
                newX = Math.max(Math.min(newX, containerWidth - rect.width), 0);
                newY = Math.max(Math.min(newY, containerHeight - rect.height), 0);

                Body.setPosition(body, { x: newX, y: newY });
            }
        });

        // add body to world
        Composite.add(world, body);

        // store the body and element in draggableBodies array
        draggableBodies.push({ body: body, element: el });
    });

    // add walls (to contain the elements within the container)
    var ground = Bodies.rectangle(containerWidth / 2, containerHeight + 30, containerWidth, 60, { isStatic: true });
    var leftWall = Bodies.rectangle(-30, containerHeight / 2, 60, containerHeight, { isStatic: true });
    var rightWall = Bodies.rectangle(containerWidth + 30, containerHeight / 2, 60, containerHeight, { isStatic: true });
    var ceiling = Bodies.rectangle(containerWidth / 2, -30, containerWidth, 60, { isStatic: true });

    Composite.add(world, [ground, leftWall, rightWall, ceiling]);

    // add mouse control
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

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // update the positions of the div elements
    Matter.Events.on(engine, 'afterUpdate', function() {
        draggableBodies.forEach(function(item) {
            var body = item.body;
            var el = item.element;

            // Update element position and rotation
            el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
            el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
            el.style.transform = `rotate(${body.angle}rad)`;
        });
    });

    // fit the render viewport to the scene
    Render.lookAt(render, Composite.allBodies(world));

    // Event listener for mouseup to end dragging
    document.addEventListener('mouseup', function(event) {
        // End dragging for all elements
        draggableBodies.forEach(function(item) {
            var body = item.body;
            var el = item.element;

            if (el.isDragging) {
                // Restore absolute position
                setTimeout(function() {
                    el.style.position = 'absolute';
                    el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
                    el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
                    el.style.zIndex = ''; // Restore z-index
                    el.isDragging = false;

                    // Re-enable physics on the body
                    body.isStatic = false;
                }, 0); // setTimeout with 0 delay to ensure it runs after current event loop
            }
        });
    });
});
