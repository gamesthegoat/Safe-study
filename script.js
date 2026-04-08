const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let currentGame = null;

// Load game list
fetch("games.json")
  .then(res => res.json())
  .then(games => {
    const gameList = document.getElementById("gameList");
    games.forEach(game => {
      const btn = document.createElement("button");
      btn.textContent = game.name;
      btn.onclick = () => loadGame(game.id);
      gameList.appendChild(btn);
    });
  });

// Load selected game
function loadGame(gameId) {
  currentGame = gameId;
  if (gameId === "flappy") startFlappy();
  if (gameId === "snake") startSnake();
  if (gameId === "platformer") startPlatformer();
  if (gameId === "brickbreaker") startBrickBreaker();
  if (gameId === "tictactoe") startTicTacToe();
  if (gameId === "memory") startMemory();
  if (gameId === "catchfall") startCatchFalling();
  if (gameId === "dodgegame") startDodgeGame();
  if (gameId === "pacman") startPacMan();
  if (gameId === "geometrydash") startGeometryDash();
}

//////////////////////////////////////////////////
// Flappy Bird
function startFlappy() {
  let y = 200, velocity = 0;
  document.onclick = () => velocity = -8;
  function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    velocity += 0.5; y += velocity;
    ctx.fillStyle="yellow"; ctx.fillRect(50,y,20,20);
    requestAnimationFrame(loop);
  }
  loop();
}

//////////////////////////////////////////////////
// Snake
function startSnake() {
  let snake = [{x:200, y:200}], dx=20, dy=0;
  document.onkeydown = e => {
    if(e.key==="ArrowUp"){ dx=0; dy=-20; }
    if(e.key==="ArrowDown"){ dx=0; dy=20; }
    if(e.key==="ArrowLeft"){ dx=-20; dy=0; }
    if(e.key==="ArrowRight"){ dx=20; dy=0; }
  };
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let head = {x:snake[0].x+dx, y:snake[0].y+dy};
    snake.unshift(head); snake.pop();
    ctx.fillStyle="lime"; snake.forEach(s=>ctx.fillRect(s.x,s.y,20,20));
    requestAnimationFrame(loop);
  }
  loop();
}

//////////////////////////////////////////////////
// Platformer
function startPlatformer() {
  let player = {x:50, y:300, vy:0};
  document.onkeydown = e => { if(e.key===" ") player.vy=-10; };
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player.vy += 0.5; player.y += player.vy;
    if(player.y>300){ player.y=300; player.vy=0; }
    ctx.fillStyle="red"; ctx.fillRect(player.x,player.y,30,30);
    ctx.fillStyle="green"; ctx.fillRect(0,330,400,20);
    requestAnimationFrame(loop);
  }
  loop();
}

//////////////////////////////////////////////////
// Brick Breaker
function startBrickBreaker() {
  let ball={x:200,y:350,dx:2,dy:-2,radius:10};
  let paddle={x:160,width:80,height:10};
  let bricks=[]; let rows=3,cols=5,brickWidth=70,brickHeight=20;
  for(let r=0;r<rows;r++){ bricks[r]=[]; for(let c=0;c<cols;c++){ bricks[r][c]={x:c*(brickWidth+10)+35,y:r*(brickHeight+10)+30,status:1}; } }
  document.onmousemove=e=>{ paddle.x=e.clientX-canvas.getBoundingClientRect().left-paddle.width/2; }
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="yellow"; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="lime"; ctx.fillRect(paddle.x,canvas.height-paddle.height,paddle.width,paddle.height);
    for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ if(bricks[r][c].status===1){ ctx.fillStyle="red"; ctx.fillRect(bricks[r][c].x,bricks[r][c].y,brickWidth,brickHeight); } } }
    ball.x+=ball.dx; ball.y+=ball.dy;
    if(ball.x+ball.radius>canvas.width||ball.x-ball.radius<0) ball.dx=-ball.dx;
    if(ball.y-ball.radius<0) ball.dy=-ball.dy;
    if(ball.y+ball.radius>canvas.height-paddle.height && ball.x>paddle.x && ball.x<paddle.x+paddle.width) ball.dy=-ball.dy;
    for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ let b=bricks[r][c]; if(b.status===1 && ball.x>b.x && ball.x<b.x+brickWidth && ball.y>b.y && ball.y<b.y+brickHeight){ ball.dy=-ball.dy; b.status=0; } } }
    requestAnimationFrame(loop);
  }
  loop();
}

//////////////////////////////////////////////////
// Tic-Tac-Toe
function startTicTacToe() {
  const size=3; let board=Array(size).fill().map(()=>Array(size).fill("")); let player="X";
  document.onclick=e=>{
    const rect=canvas.getBoundingClientRect();
    const x=Math.floor((e.clientX-rect.left)/(canvas.width/size));
    const y=Math.floor((e.clientY-rect.top)/(canvas.height/size));
    if(board[y][x]===""){ board[y][x]=player; player=player==="X"?"O":"X"; drawBoard(); }
  };
  function drawBoard(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w=canvas.width/size,h=canvas.height/size;
    ctx.strokeStyle="white";
    for(let i=1;i<size;i++){ ctx.beginPath(); ctx.moveTo(i*w,0); ctx.lineTo(i*w,canvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i*h); ctx.lineTo(canvas.width,i*h); ctx.stroke(); }
    ctx.fillStyle="yellow"; ctx.font=`${w/2}px Arial`; ctx.textAlign="center"; ctx.textBaseline="middle";
    for(let r=0;r<size;r++){ for(let c=0;c<size;c++){ ctx.fillText(board[r][c],c*w+w/2,r*h+h/2); } }
  }
  drawBoard();
}

//////////////////////////////////////////////////
// Memory Game
function startMemory() {
  const rows=2,cols=4; let cards=[],flipped=[]; const cardSize=80,padding=20;
  let values=["🍎","🍌","🍇","🍒"]; values=values.concat(values); values.sort(()=>Math.random()-0.5);
  for(let r=0;r<rows;r++){ cards[r]=[]; for(let c=0;c<cols;c++){ cards[r][c]={value:values[r*cols+c],flipped:false}; } }
  document.onclick=e=>{
    const rect=canvas.getBoundingClientRect();
    const x=Math.floor((e.clientX-rect.left)/(cardSize+padding));
    const y=Math.floor((e.clientY-rect.top)/(cardSize+padding));
    if(cards[y] && cards[y][x] && !cards[y][x].flipped){ cards[y][x].flipped=true; flipped.push({y,x});
      if(flipped.length===2){ if(cards[flipped[0].y][flipped[0].x].value!==cards[flipped[1].y][flipped[1].x].value){ setTimeout(()=>{ cards[flipped[0].y][flipped[0].x].flipped=false; cards[flipped[1].y][flipped[1].x].flipped=false; flipped=[]; },500); }else{flipped=[];} }
      drawCards();
    }
  };
  function drawCards(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ const card=cards[r][c]; const x=c*(cardSize+padding); const y=r*(cardSize+padding);
      ctx.fillStyle=card.flipped?"orange":"grey"; ctx.fillRect(x,y,cardSize,cardSize);
      if(card.flipped){ ctx.fillStyle="black"; ctx.font="40px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(card.value,x+cardSize/2,y+cardSize/2); }
    } }
  }
  drawCards();
}

//////////////////////////////////////////////////
// Catch the Falling Object
function startCatchFalling() {
  let basket={x:170,width:60}, items=[], score=0;
  document.onmousemove=e=>{ basket.x=e.clientX-canvas.getBoundingClientRect().left-basket.width/2; }
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(Math.random()<0.02) items.push({x:Math.random()*380,y:0});
    items.forEach((item,i)=>{ item.y+=3; ctx.fillStyle="red"; ctx.fillRect(item.x,item.y,20,20);
      if(item.y>380 && item.x>basket.x && item.x<basket.x+basket.width){ score++; items.splice(i,1); } else if(item.y>400) items.splice(i,1);
    });
    ctx.fillStyle="green"; ctx.fillRect(basket.x,390,basket.width,10);
    ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,20);
    requestAnimationFrame(loop);
  }
  loop();
}

//////////////////////////////////////////////////
// Dodge Game
function startDodgeGame(){
  let player={x:180,y:360,width:40,height:40}, blocks=[], speed=2, score=0;
  document.onmousemove=e=>{ player.x=e.clientX-canvas.getBoundingClientRect().left-player.width/2; }
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(Math.random()<0.02) blocks.push({x:Math.random()*360,y:0,width:40,height:40});
    blocks.forEach((b,i)=>{
      b.y+=speed; ctx.fillStyle="red"; ctx.fillRect(b.x,b.y,b.width,b.height);
      if(b.y+b.height>player.y && b.x<player.x+player.width && b.x+b.width>player.x && b.y<player.y+player.height){ ctx.fillStyle="white"; ctx.font="40px Arial"; ctx.fillText("Game Over",100,200); blocks=[]; score=0; return; }
      if(b.y>400){ blocks.splice(i,1); score++; }
    });
    ctx.fillStyle="blue"; ctx.fillRect(player.x,player.y,player.width,player.height);
    ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,20);
    requestAnimationFrame(loop);
  }
  loop();
}

//////////////////////////////////////////////////
// Pac-Man
function startPacMan() {
  const tileSize=20;
  const map=[
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,0,1],
    [1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];
  let pac={x:1,y:1}, score=0;
  document.onkeydown=e=>{
    let nx=pac.x,ny=pac.y;
    if(e.key==="ArrowUp") ny--;
    if(e.key==="ArrowDown") ny++;
    if(e.key==="ArrowLeft") nx--;
    if(e.key==="ArrowRight") nx++;
    if(map[ny] && map[ny][nx]===0){ pac.x=nx; pac.y=ny; score++; map[ny][nx]=2; }
  };
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let y=0;y<map.length;y++){ for(let x=0;x<map[y].length;x++){ if(map[y][x]===1){ ctx.fillStyle="blue"; ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize); } if(map[y][x]===0){ ctx.fillStyle="yellow"; ctx.beginPath(); ctx.arc(x*tileSize+tileSize/2,y*tileSize+tileSize/2,4,0,Math.PI*2); ctx.fill(); } } }
    ctx.fillStyle="orange"; ctx.beginPath(); ctx.arc(pac.x*tileSize+tileSize/2,pac.y*tileSize+tileSize/2,tileSize/2-2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,20);
    requestAnimationFrame(loop);
  }
  loop();
}

//////////////////////////////////////////////////
// Geometry Dash
function startGeometryDash() {
  let cube={x:50,y:300,vy:0,width:30,height:30};
  let obstacles=[]; let speed=3; let gravity=0.5; let jump=-10; let score=0;
  document.onkeydown=e=>{ if(e.key===" ") cube.vy=jump; }
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    cube.vy+=gravity; cube.y+=cube.vy; if(cube.y>370){ cube.y=370; cube.vy=0; }
    ctx.fillStyle="red"; ctx.fillRect(cube.x,cube.y,cube.width,cube.height);
    if(Math.random()<0.02) obstacles.push({x:400,y:370,width:30,height:30});
    obstacles.forEach((obs,i)=>{
      obs.x-=speed; ctx.fillStyle="blue"; ctx.fillRect(obs.x,obs.y,obs.width,obs.height);
      if(cube.x<obs.x+obs.width && cube.x+cube.width>obs.x && cube.y<obs.y+obs.height && cube.y+cube.height>obs.y){
        ctx.fillStyle="white"; ctx.font="30px Arial"; ctx.fillText("Game Over",100,200); obstacles=[]; cube.y=300; score=0; return;
      }
      if(obs.x+obs.width<0){ obstacles.splice(i,1); score++; }
    });
    ctx.fillStyle="white"; ctx.font="20px Arial"; ctx.fillText("Score: "+score,10,20);
    requestAnimationFrame(loop);
  }
  loop();
}
