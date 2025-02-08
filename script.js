const c = document.getElementById("c");

const WIDTH  = c.width  = 160;
const HEIGHT = c.height = 144;
const MOUSESPEED = 0.005;
const SNOW_Q = 10000;
const SNOW_DIST = 250;
const WALKSPEED = 1;
const FOV_DEPTH_CONST = 75;
const FDELAY = 1000 / 24;

const ctx = c.getContext("2d");
ctx.mozImageSmoothingEnabled    = false;
ctx.oImageSmoothingEnabled      = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled     = false;
ctx.imageSmoothingEnabled       = false;


const player = {
	x: 0,
	y: 0,
	ha: 0,
	va: 0
}

const WORLD = [];
const PARTICLES = [];

const KEYS = {
	up: 0,
	left: 0,
	right: 0,
	down: 0,
	click: 0,
	insp: 0,
  reload: 0
};
const bob = {
	x: 0,
	y: 0
}

const IMGS = {};
let limgs = document.getElementsByClassName("limg");
for(var i = 0; i < limgs.length; i++) {
	IMGS[limgs[i].id] = limgs[i];
}

const DEFAULT_GETDEPTH = (me) => {
	let rx = me.x - player.x,
	    ry = me.y - player.y;
	let depth = ry * Math.cos(player.ha) + rx * Math.sin(player.ha)
	depth /= FOV_DEPTH_CONST;
	return depth;
};

const DEFAULT_COLLIDE = (dist) => (me) => {
	let cdist = Math.hypot(me.x - player.x, me.y - player.y)
	if(cdist < dist) {
		player.x = me.x + (player.x - me.x) * (dist / cdist);
		player.y = me.y + (player.y - me.y) * (dist / cdist);
	}
}

let gdtext = document.getElementById("gamedata").innerHTML.trim();
for(let line of gdtext.split("\n")) {
	line = line.trim().split(",");
	console.log(line);
	switch(line[0]){
		case "pillartest":
			WORLD.push({
					x: parseInt(line[1]),
					y: parseInt(line[2]),
					r: parseInt(line[3]) / 180 * Math.PI,
					getDepth: DEFAULT_GETDEPTH,
					collide: DEFAULT_COLLIDE(25),
					render: (me, x, y, depth) => {
						if(depth <= 0)
							return;

						let localAngle = player.ha - Math.atan2(depth * FOV_DEPTH_CONST * 2, (x - WIDTH / 2) * depth);
						// localAngle = player.ha - Math.atan2(depth * FOV_DEPTH_CONST * 2, (x - WIDTH / 2) * depth);

						console.log(Math.round((localAngle - me.r + Math.PI * 4) / (Math.PI / 8)) % 4)

						ctx.drawImage(
							IMGS.pillartest,
							0,
							Math.round((localAngle - me.r + Math.PI * 4) / (Math.PI / 8)) % 4 * 160,
							160,
							160,
							x - 160 / depth / 2,
							y - 160 / depth / 2,
							160 / depth,
							160 / depth
						);
					}
				});
			break;
		case "car":
			WORLD.push({
					x: parseInt(line[1]),
					y: parseInt(line[2]),
					r: parseInt(line[3]) / 180 * Math.PI,
					getDepth: DEFAULT_GETDEPTH,
					collide: DEFAULT_COLLIDE(50),
					render: (me, x, y, depth) => {
						if(depth <= 0)
							return;

						let localAngle = player.ha - Math.atan2(depth * FOV_DEPTH_CONST * 2, (x - WIDTH / 2) * depth);

						ctx.drawImage(
							IMGS.car,
							0,
							Math.round((localAngle - me.r + Math.PI * 4) / (Math.PI / 8)) % 16 * 160,
							160,
							160,
							x - 160 / depth / 2,
							y - 160 / depth / 2,
							160 / depth,
							160 / depth
						);
					}
				});
			break;
		case "bigtower":
			WORLD.push({
					x: parseInt(line[1]),
					y: parseInt(line[2]),
					r: parseInt(line[3]) / 180 * Math.PI,
					getDepth: DEFAULT_GETDEPTH,
					collide: DEFAULT_COLLIDE(30),
					render: (me, x, y, depth) => {
						if(depth <= 0)
							return;

						let localAngle = player.ha - Math.atan2(depth * FOV_DEPTH_CONST * 2, (x - WIDTH / 2) * depth);

						ctx.drawImage(
							IMGS.bigtower,
							0,
							Math.round((localAngle - me.r + Math.PI * 4) / (Math.PI / 8)) % 4 * 300,
							80,
							300,
							x - 80 / depth / 2,
							y - 220 / depth,
							80 / depth,
							300 / depth
						);
					}
				});
			break;
		case "turbine":
			WORLD.push({
					x: parseInt(line[1]),
					y: parseInt(line[2]),
					frame: 0,
					getDepth: DEFAULT_GETDEPTH,
					collide: DEFAULT_COLLIDE(40),
					render: (me, x, y, depth) => {
						me.frame = (me.frame + 1) % 8;
						if(depth <= 0)
							return;

						ctx.drawImage(
							IMGS.turbine,
							0,
							Math.floor(me.frame / 2) * 600,
							80,
							600,
							x - 80 / depth / 2,
							y - 520 / depth,
							80 / depth,
							600 / depth
						);
					}
				});
			break;
	}
}

// for(var i = 0; i < 500; i++) {
// 	WORLD.push({
// 		x: Math.random() * 2000 - 1000,
// 		y: Math.random() * 2000 - 1000,
// 		r: Math.random() * Math.PI * 2,
// 		getDepth: DEFAULT_GETDEPTH,
// 		render: (me, x, y, depth) => {
// 			if(depth <= 0)
// 				return;
//
// 			let localAngle = player.ha - Math.atan2(depth * FOV_DEPTH_CONST, (x - WIDTH / 2) * depth);
//
// 			ctx.drawImage(
// 				IMGS.pillartest,
// 				0,
// 				Math.floor((localAngle - me.r + Math.PI * 4) % (Math.PI / 2) / (Math.PI / 8)) * 160,
// 				160,
// 				160,
// 				x - 160 / depth / 2,
// 				y - 160 / depth / 2,
// 				160 / depth,
// 				160 / depth
// 			);
// 		}
// 	});
// }

// for(var i = 0; i < 10; i++) {
// 	WORLD.push({
// 		x: Math.random() * 2000 - 1000,
// 		y: Math.random() * 2000 - 1000,
// 		r: Math.random() * Math.PI * 2,
// 		getDepth: DEFAULT_GETDEPTH,
// 		render: (me, x, y, depth) => {
// 			if(depth <= 0)
// 				return;
//
// 			let localAngle = player.ha - Math.atan2(depth * FOV_DEPTH_CONST, (x - WIDTH / 2) * depth);
//
// 			ctx.drawImage(
// 				IMGS.car,
// 				0,
// 				Math.floor((localAngle - me.r + Math.PI * 4) % (Math.PI * 2) / (Math.PI / 8)) * 160,
// 				160,
// 				160,
// 				x - 160 / depth / 2,
// 				y - 160 / depth / 2,
// 				160 / depth,
// 				160 / depth
// 			);
// 		}
// 	});
// }

// for(var i = 0; i < 20; i++) {
// 	WORLD.push({
// 		x: Math.random() * 2000 - 1000,
// 		y: Math.random() * 2000 - 1000,
// 		r: Math.random() * Math.PI * 2,
// 		getDepth: DEFAULT_GETDEPTH,
// 		render: (me, x, y, depth) => {
// 			if(depth <= 0)
// 				return;
//
// 			ctx.drawImage(
// 				IMGS.thingv1,
//         x - 160 / 2 / depth,
// 				y - 160 / 2 / depth,
// 				160 / depth,
// 				160 / depth
// 			);
// 		}
// 	});
// }

for(var i = 0; i < SNOW_Q; i++) {
	let r = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * SNOW_DIST;
	WORLD.push({
		x: Math.cos(r) * d,
		y: Math.sin(r) * d,
		z: Math.random() * HEIGHT * 1.5 - HEIGHT / 2,
		getDepth: DEFAULT_GETDEPTH,
		render: (me, x, y, depth,) => {
			if(me.z < -HEIGHT / 2) {
				let r = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * SNOW_DIST;
				me.x = player.x + Math.cos(r) * d;
				me.y = player.y + Math.sin(r) * d;
				me.z = HEIGHT * 1;
			}
			if(Math.hypot(me.x - player.x, me.y - player.y) > SNOW_DIST) {
				let d = Math.hypot(me.x - player.x, me.y - player.y);
				me.x = player.x - (me.x - player.x) / d * SNOW_DIST * (2 - d / SNOW_DIST);
				me.y = player.y - (me.y - player.y) / d * SNOW_DIST * (2 - d / SNOW_DIST);
			}

			me.x += Math.random();
			me.y += Math.random();
			me.z -= 2;

			if(depth <= 0.0)
				return;

			let size = Math.min(4, Math.ceil(1 / depth));

			ctx.fillStyle = "white";
			ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2 - me.z / depth), size, size);

      // let size = Math.min(64, Math.ceil(32 / depth));
			//
      // ctx.drawImage(
  		// 	IMGS.snowtex,
  		// 	Math.round(x - size / 2),
  		// 	Math.round(y - size / 2 - me.z / depth),
      //   size,
      //   size
  		// );
		}
	});
}

WORLD.push({
	x: 0,
	y: 0,
  reload: 0,
	getDepth: me => {
		return 0.2;
	},
	render: (me, x, y, depth) => {
    if(KEYS.reload && !me.reload) {
      me.reload = 1;
      KEYS.reload = 0;
    } else if (me.reload) {
      me.reload += 0.5;
      me.reload %= 13;
    }
		bob.x = Math.max(-4, bob.x * 0.8);
		bob.y = Math.max(-4, bob.y * 0.8);
		ctx.drawImage(IMGS.shotgun, 0, Math.floor(me.reload) * 144, 160, 144, 4 + Math.round(bob.x), 4 + Math.round(bob.y), 160, 144);
	}
});

WORLD.push({
	x: 0,
	y: 0,
  shoot: 0,
	getDepth: me => {
		return 0.21;
	},
	render: (me, x, y, depth) => {
    if(KEYS.click && !me.shoot) {
      me.shoot = 1;
      KEYS.click = 0;
			bob.x += 16;
			bob.y += 16;
    } else if (me.shoot) {
      me.shoot += 1;
      me.shoot %= 11;
    }
		if(me.shoot == 0)
			return;
		ctx.drawImage(IMGS.gunshot, 0, (me.shoot - 1) * 144, 160, 144, 4, 4, 160, 144);
	}
});

var mouseLocked = false;

c.addEventListener("click", () => {
	c.requestPointerLock();
});

c.onmousemove = e => {
	if(mouseLocked) {
		player.ha = (player.ha + Math.PI * 2 + e.movementX * MOUSESPEED) % (Math.PI * 2);
		player.va = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, player.va + e.movementY * MOUSESPEED));
		bob.x -= e.movementX * MOUSESPEED * 4;
		bob.y -= e.movementY * MOUSESPEED * 4;
	}
}

window.onkeydown = e => {
	if(e.code == "ArrowUp" || e.code == "KeyW")
		KEYS.up = 1;
	if(e.code == "ArrowLeft" || e.code == "KeyA")
		KEYS.left = 1;
	if(e.code == "ArrowRight" || e.code == "KeyD")
		KEYS.right = 1;
	if(e.code == "ArrowDown" || e.code == "KeyS")
		KEYS.down = 1;
  if(e.code == "KeyE")
		KEYS.insp = 1;
  if(e.code == "KeyR")
		KEYS.reload = 1;
}

window.onkeyup = e => {
	if(e.code == "ArrowUp" || e.code == "KeyW")
		KEYS.up = 0;
	if(e.code == "ArrowLeft" || e.code == "KeyA")
		KEYS.left = 0;
	if(e.code == "ArrowRight" || e.code == "KeyD")
		KEYS.right = 0;
	if(e.code == "ArrowDown" || e.code == "KeyS")
		KEYS.down = 0;
	if(e.code == "KeyE")
		KEYS.insp = 0;
  if(e.code == "KeyR")
		KEYS.reload = 0;
}

window.onmousedown = e => {
	KEYS.click = 1;
}

window.onmouseup = e => {
	KEYS.click = 0;
}

document.onpointerlockchange = e => {
	mouseLocked = !!document.pointerLockElement;
}

var ls = 0;
var lf = 0;
function render(ts) {
	requestAnimationFrame(render);

	var delta = (ts - ls);
	ls = ts;
	lf += delta;
	delta /= 16;

	let nw = Math.min(window.innerWidth, window.innerHeight / HEIGHT * WIDTH);
	c.style.width = nw + "px";
	c.style.left = (window.innerWidth - nw) / 2 + "px";
	c.style.top = (window.innerHeight - nw / WIDTH * HEIGHT) / 2 + "px";

	if(KEYS.up) {
		player.x += Math.sin(player.ha) * WALKSPEED * delta;
		player.y += Math.cos(player.ha) * WALKSPEED * delta;
	}
	if(KEYS.left) {
		player.x -= Math.cos(player.ha) * WALKSPEED * delta;
		player.y += Math.sin(player.ha) * WALKSPEED * delta;
	}
	if(KEYS.right) {
		player.x += Math.cos(player.ha) * WALKSPEED * delta;
		player.y -= Math.sin(player.ha) * WALKSPEED * delta;
	}
	if(KEYS.down) {
		player.x -= Math.sin(player.ha) * WALKSPEED * delta;
		player.y -= Math.cos(player.ha) * WALKSPEED * delta;
	}

	if(lf >= FDELAY) {
		lf %= FDELAY

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		for(let obj of WORLD) {
			if(obj.collide) {
				obj.collide(obj);
			}
		}

		for(let obj of WORLD) {
			obj.depth = obj.getDepth(obj);
		}

		WORLD.sort((a, b) => {
			return b.depth - a.depth;
		});

		for(let obj of WORLD) {
			let rx = obj.x - player.x,
			    ry = obj.y - player.y;
			depth = obj.depth;
			// obj.render(obj, WIDTH / 2 + rx / 2, HEIGHT / 2 + ry / 2, 2, player.ha);
			obj.render(obj, WIDTH / 2 + (rx * Math.cos(player.ha) - ry * Math.sin(player.ha)) / depth, HEIGHT / 2 - player.va * 180 / Math.PI, depth);
		}
	}
}
render(ls = performance.now());
