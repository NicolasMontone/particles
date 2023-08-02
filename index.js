const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const canvasGradient = ctx.createLinearGradient(
  canvas.width,
  canvas.height,
  0,
  0
)
canvasGradient.addColorStop(0, '#c2940a')
canvasGradient.addColorStop(0.5, 'magenta')
canvasGradient.addColorStop(1, 'darkblue')

ctx.fillStyle = canvasGradient
ctx.strokeStyle = 'white'

class Animation {
  constructor(canvas) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 300
    this.create()
  }

  create() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this))
    }
  }

  updateParticles(context) {
    for (const particle of this.particles) {
      particle.draw(context)
      particle.update()
    }
    this.connectParticles(context)
  }

  connectParticles(context) {
    const maxDistanceBetweenParticlesInPixels = 100
    // loop for each particle
    for (let i = 0; i < this.particles.length; i++) {
      // and compare it with all particles (note: we don't need to compare it with i-- since it was already compared)
      for (let a = i; a < this.particles.length; a++) {
        const firstParticle = this.particles[i]
        const secondParticle = this.particles[a]
        const distanceBetweenParticlesInXAxis =
          firstParticle.x - secondParticle.x
        const distanceBetweenParticlesInYAxis =
          firstParticle.y - secondParticle.y

        // square root of x ^ 2 + y ^ 2 is the actual distance of the particles
        const distance = Math.hypot(
          distanceBetweenParticlesInXAxis,
          distanceBetweenParticlesInYAxis
        )

        if (distance > maxDistanceBetweenParticlesInPixels) {
          continue
        }
        context.save()
        const lineOpacity = 1 - distance / maxDistanceBetweenParticlesInPixels
        context.globalAlpha = lineOpacity
        context.beginPath()
        context.moveTo(firstParticle.x, firstParticle.y)
        context.lineTo(secondParticle.x, secondParticle.y)
        context.stroke()
        context.restore()
      }
    }
  }
}

class Particle {
  constructor(effect) {
    this.effect = effect
    this.radius = Math.random() * 15 + 5
    // x particle will be number betwƒeen 0 and our effect
    this.x = Math.random() * (this.effect.width - this.radius * 2)
    this.y = Math.random() * (this.effect.height - this.radius * 2)
    this.velocityX = Math.random() * 1 - 0.5
    this.velocityY = Math.random() * 1 - 0.5
  }

  update() {
    this.x += this.velocityX
    if (this.x > this.effect.width - this.radius || this.x < this.radius) {
      this.velocityX *= -1
    }

    this.y += this.velocityY
    if (this.y > this.effect.height - this.radius || this.y < this.radius) {
      this.velocityY *= -1
    }
  }

  draw(context) {
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fill()
  }
}

const mainAnimation = new Animation(canvas)

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  mainAnimation.updateParticles(ctx)
  requestAnimationFrame(animate)
}

animate()
