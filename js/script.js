//setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight

const gradiant = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
);

gradiant.addColorStop(0, 'white');
gradiant.addColorStop(0.5, 'magenta');
gradiant.addColorStop(1, 'blue');
ctx.fillStyle = gradiant;
ctx.strokeStyle = 'white';

/**
 * Create the particle that would be seen moving around
 */
class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.random() * 5 + 2;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 3);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 5);
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
    }

    draw(context) {
        //Create a different fillStyle()
        // context.fillStyle = 'hsl('+ this.x * 0.5 +', 100%, 50%)';
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );
        context.fill();
        // context.stroke();
    }
    update() {
        this.x += this.vx;
        if(this.x > this.effect.width - this.radius || this.x < this.radius) this.vx *= -1;
        this.y += this.vy;
        if(this.y > this.effect.height - this.radius || this.y < this.radius) this.vy *= -1;
    }
}

/**
 * Make effect for our particles.
 */
class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 100;
        this.createParticles();
    }

    //Run once to create particle objects
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
        this.connectParticles(context);
    }

    connectParticles(context) {
        const maxDistance = 100;
        for (let a= 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                //Calculate distance
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                //Using hypotenuse
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    //Draw line
                    context.save();
                    context.globalAlpha = 1 - (distance / maxDistance);
                    context.beginPath();
                    context.moveTo(
                        this.particles[a].x,
                        this.particles[a].y,
                    );
                    context.lineTo(
                        this.particles[b].x,
                        this.particles[b].y,
                    );
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
}

const effect = new Effect(canvas);

/**
 * Make animation
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}

/**
 * Execute the animation
 */
animate();

canvas.addEventListener('click', () => {
   effect.numberOfParticles = 10;
   this.radius = Math.random() * 3;
   effect.createParticles();
   // animate();
   // console.log(effect.numberOfParticles += effect.numberOfParticles);
});