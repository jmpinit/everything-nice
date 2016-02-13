"use strict";

requirejs(["svg"], function(svg) {
    let render = function(geometry) {
        let move = (pt) => `M ${pt[0]} ${pt[1]}`;
        let line = (pt) => `L ${pt[0]} ${pt[1]}`;

        let makePath = function(pts) {
            let car = pts[0];
            let cdr = pts.slice(1, pts.length);

            return [move(car)].concat(cdr.map((pt) => line(pt))).join(" ");
        }

        let container = svg.create("g");

        for (let obj of geometry) {
            let path;

            if (obj.length > 1) {
                path = svg.create("path", { d: makePath(obj) })
            } else {
                let [[x, y]] = obj;
                path = svg.create("circle", { cx: x, cy: y }); 
            }

            container.appendChild(path);
        }

        return container;
    };

    let geom = {
        pick: function(geometry, x, y, radius) {
            var points = [].concat.apply(null, geometry);

            return points.filter((pts, pt) => {
                let [px, py] = pt;
                let distance = function(x1, y1, x2, y2) {
                    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
                };

                return distance(x, y, px, py) < radius;
            });
        }
    }
    
    let geometry = [
        [[10, 10], [20, 10], [30, 10]],
        [[12, 10], [20, 18]],
        [[50, 50]]
    ];

    let root = svg.create("svg", { width: 100, height: 100 });
    root.appendChild(render(geometry));

    root.onclick = function(mouseEvent) {
        let x = mouseEvent.clientX;
        let y = mouseEvent.clientY;

        let sloppyPick = function(x, y) {
            const radius = 10;
            return geom.pick(geometry, x, y, radius);
        };

        if (false/* mouse on svg */) {
            // use tool on entity
            let handle = sloppyPick(x, y);
            console.log(handle);
            //tool.useOn(handle);
        }
    }

    document.body.appendChild(root);
});