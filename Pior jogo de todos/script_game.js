const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const score = document.querySelector('#scoreElement');
canvas.width = 1024
canvas.height = 576


class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 1

        const image = new Image()
        image.src = './img/canhao.png'
        image.onload = () => {
            const scale = 0.3
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }

    }
    draw() {
        
        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            player1.position.x + player1.width / 2,
            player1.position.y + player1.height / 2
        )

        c.rotate(this.rotation)

        c.translate(
            -player1.position.x - player1.width / 2,
            -player1.position.y - player1.height / 2
        )


        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height)

        c.restore()

    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {

        this.position = position
        this.velocity = velocity

        this.radius = 4
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#19fff7'
        c.fill()
        c.closePath()

    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Explosao {
    constructor({ position, velocity, radius, color }) {

        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()

    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.opacity -= 0.01

    }
}

class EnemyProjectile {
    constructor({ position, velocity }) {

        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }

    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Enemy {
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0


        const image = new Image()
        image.src = './img/nutella.png'
        image.onload = () => {
            const scale = 0.3
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }

    }
    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
    shoot(enemyProjectiles) {
        enemyProjectiles.push(new EnemyProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }

}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.enemy = []

        const linhas = Math.floor(Math.random() * 5 + 2)
        const colunas = Math.floor(Math.random() * 10 + 5)

        this.width = colunas * 50

        for (let x = 0; x < colunas; x++) {
            for (let y = 0; y < linhas; y++) {

                this.enemy.push(new Enemy({
                    position: {
                        x: x * 50,
                        y: y * 50
                    }
                })
                )
            }
        }


    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}


const player1 = new Player()
const projectiles = []
const grids = []
const enemyProjectiles = []
const explosoes = []

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}
let frames = 0
let randomIntervalo = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: true
}
let scoreContador = 0

function createExplosoes ({object, color}){
    for (let i = 0; i < 15; i++) {
        explosoes.push(new Explosao({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || 'yellow'

        })
        )
    }
}

function animate() {
    if(!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player1.update()

    explosoes.forEach((explosao, i) =>{
        if (explosao.opacity <= 0){
            setTimeout(()=> {
           explosoes.splice(i, 1)
            }, 0)
        } else {
            explosao.update()
        }
    })

    enemyProjectiles.forEach((enemyProjectile, index) => {
        if (
            enemyProjectile.position.y + enemyProjectile.height >=
            canvas.height
        ) {
            setTimeout(() => {
                enemyProjectiles.splice(index, 1)
            }, 0)
        } else enemyProjectile.update()
        // quando um projetil atinge o jogador
        if (
            enemyProjectile.position.y + enemyProjectile.height >= player1.position.y && enemyProjectile.position.x + enemyProjectile.width >= player1.position.x && enemyProjectile.position.x <= player1.position.x + player1.width
        ) {
            console.log('you lose');

            setTimeout(() => {
                enemyProjectiles.splice(index, 1)
                player1.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() => {
                game.active = false
            }, 2000)

         
          createExplosoes({
            object: player1,
            color: '#19fff7' 
        })
        }

    })

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }

    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        //spawn projeteis
        if (frames % 100 === 0 && grid.enemy.length > 0) {
            grid.enemy[Math.floor(Math.random() * grid.enemy.length)].shoot(enemyProjectiles)
        }

        grid.enemy.forEach((enemy, i) => {
            enemy.update({ velocity: grid.velocity })
            //projeteis que acertam os inimigos >
            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <= enemy.position.y + enemy.height && projectile.position.x + projectile.radius >= enemy.position.x && projectile.position.x - projectile.radius <= enemy.position.x + enemy.width && projectile.position.y + projectile.radius >= enemy.position.y) {



                    setTimeout(() => {

                        const enemyFound = grid.enemy.find((enemy2) => enemy2 === enemy
                        )

                        const projectileFound = projectiles.find(
                            projectile2 => projectile2 === projectile
                        )
                        //remover inimigo e projetil
                        if (enemyFound && projectileFound) {

                            scoreContador += 1
                            score.innerHTML = scoreContador

                            createExplosoes({
                                object: enemy, 
                            })

                            grid.enemy.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.enemy.length > 0) {
                                const firstEnemy = grid.enemy[0]
                                const lastEnemy = grid.enemy[grid.enemy.length - 1]

                                grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width
                                grid.position.x = firstEnemy.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })

    if (keys.a.pressed && player1.position.x >= 0) {
        player1.velocity.x = -7
        player1.rotation = -0.15
    } else if (keys.d.pressed &&
        player1.position.x + player1.width <= canvas.width) {
        player1.velocity.x = 7
        player1.rotation = 0.15
    } else {
        player1.velocity.x = 0
        player1.rotation = 0
    }
    //novos inimigos
    if (frames % randomIntervalo === 0) {
        grids.push(new Grid())
        randomIntervalo = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }


    frames++
}

animate()

addEventListener('keydown', ({ key }) => {
 if(game.over)return

    switch (key) {
        case 'a':
            //console.log('left')
            keys.a.pressed = true
            break

        case 'd':
            //console.log('right')
            keys.d.pressed = true
            break
        //space
        case ' ':
            //console.log('space')
            projectiles.push(new Projectile({
                position: {
                    x: player1.position.x + player1.width / 2,
                    y: player1.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            break
    }

})
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            console.log('left')

            keys.a.pressed = false
            break

        case 'd':
            console.log('right')
            keys.d.pressed = false;
            break
        //space
        case ' ':
            console.log('space')
            keys.space.pressed = false
            break
    }

})
