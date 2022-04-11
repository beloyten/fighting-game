const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Background({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Shop({
  position: {
    x: 1200,
    y: 295
  },
  imageSrc: './img/shop.png',
  scale: 4,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0, 
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 280
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 3.5,
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 500,
      y: 0
    },
    width: 160,
    height: 50
  }
});

player.draw();

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -400,
    y: 300
  },
  color: 'blue',
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 3.5,
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    }
  },
  attackBox: {
    offset: {
      x: 460,
      y: 20
    },
    width: 150,
    height: 50
  }
})

enemy.draw();

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  }
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastkey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastkey === 'd') {
    player.switchSprite('run');
    player.velocity.x = 5
  } else {
    player.switchSprite('idle');
  }

  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }
  
  //Enemy movement
  if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run');
  } else if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  //enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  //detect for collision
  if (rectangularCollison({
    rectangle1: player,
    rectangle2: enemy
  }) && player.isAttacking) {
    console.log('ax');
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + "%";
  }

  if (rectangularCollison({
    rectangle1: enemy,
    rectangle2: player
  }) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + "%";
  }

  //end game base on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener('keydown', (event) => {
  console.log(event.key)
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastkey = 'd';
      break;
    case 'a': 
      keys.a.pressed = true;
      player.lastkey = 'a';
      break;
    case 'w': 
      player.velocity.y = -20;
      break;
    case ' ': 
      console.log('player', player);
      console.log('enemy', enemy);
      player.attack();
      break;
    case 'ArrowRight': 
      keys.ArrowRight.pressed = true;
      enemy.lastkey = 'ArrowRight';
      break;
    case 'ArrowLeft': 
      keys.ArrowLeft.pressed = true;
      enemy.lastkey = 'ArrowLeft';
      break;
    case 'ArrowUp': 
      enemy.velocity.y = -20;
      break;
    case 'ArrowDown': 
      enemy.attack();
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'w':
      player.velocity.y = 0;
      break;
  }

  //enemy
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowUp':
      enemy.velocity.y = 0;
      break;
  }
});

