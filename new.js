/**
 * Copyright (c) 2019 
 * Bruno Novo & João Valente
 */

// Tamanho dos cubos para o jogo
var UNITWIDTH = 90,
    UNITHEIGHT = 45,
    backgroundColor = 0xe0e0e0,
    groundColor = 0x663300,
    viewAngle = 40,
    near = 1,
    far = 2000,
    PLAYERSPEED = 200, // How fast the player moves
    direcaoBloco = 0,
    collidableObjects = [],
    PLAYERCOLLISIONDISTANCE = 20,
    Largura_campo=500,
    Comprimento_campo=1000,
    score1=0,
    score2=0,
    cube1,
    cube2;

// Flags to determine which direction the player is moving
var moveLeft = false;
var moveRight = false;

//scoreBoard = document.getElementById('scoreBoard');


var camara, cena, renderer, fundo, direita, esquerda, player1, player2, cubo, relogio, delta, controlos;
var velocidadeBloco = new THREE.Vector3(0,0,0);

// Setup do jogo
init();
animate();


function init() {
  relogio = new THREE.Clock();
  // Criar a cena
  cena = new THREE.Scene();

  // Definir render
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(backgroundColor);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Render para o container
  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  // Definir a posiçao da camara
  camara = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 2, 10000 );
  camara.position.z = 900;
  camara.position.y = 100;
  camara.rotation.y = 120 * Math.PI / 180;

  //point camera on scene
  camara.lookAt(velocidadeBloco);

  cena.add(camara);


  var geometry = new THREE.PlaneBufferGeometry( Largura_campo, Comprimento_campo );
  var texture = new THREE.CanvasTexture( generateTexture() );
  for ( var i = 0; i < 15; i ++ ) {
    var material = new THREE.MeshBasicMaterial( {
      color: new THREE.Color().setHSL( 0.3, 0.75, ( i / 15 ) * 0.4 + 0.1 ),
      map: texture,
      depthTest: false,
      depthWrite: false,
      transparent: true
    } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = i * 0.40;
    mesh.rotation.x = - Math.PI / 2;
    cena.add( mesh );
  }
  cena.children.reverse();

  controls = new THREE.PointerLockControls(camara);
  cena.add(controls.getObject());

  // Add the walls(cubes) of the maze
  criarFundo();
  criarParedes();
  Cubo();
 
  listenTeclasPressionadas();

  // Add lights to the scene
  luzes();

  // Listen for if the window changes sizes and adjust
  window.addEventListener('resize', onWindowResize, false);

}




function generateTexture() {
  var canvas = document.createElement( 'canvas' );
  canvas.width = 512;
  canvas.height = 512;
  var context = canvas.getContext( '2d' );
  for ( var i = 0; i < 60000; i ++ ) {
    context.fillStyle = 'hsl(0,0%,' + ( Math.random() * 50 + 50 ) + '%)';
    context.beginPath();
    context.arc( Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
    context.fill();
  }
  context.globalAlpha = 0.075;
  context.globalCompositeOperation = 'lighter';
  return canvas;
}


//movimento do computador(jogador)
function computador_jogador() {
if(player1.position.x - 100 > cubo.position.x) {
   player1.position.x -= Math.min(player1.position.x - cubo.position.x, 4);
 }else if(player1.position.x - 100 < cubo.position.x) {
   player1.position.x += Math.min(cubo.position.x - player1.position.x, 4);
 }
 if(player1.position.x== player1.position.x){
  player1.position.x += 5 ;
 }
}

// Add lights to the scene
function luzes() {
  var luz = new THREE.DirectionalLight(0xffffff, 1.2);
  luz.position.set(1, 2, 1);
  cena.add(luz);

}

//  Criar o fundo do jogo
function criarFundo() {
    var fundoGeometria = new THREE.BoxGeometry(Largura_campo, 1, Comprimento_campo),
        fundoMaterial = new THREE.MeshPhongMaterial({color: groundColor}),
        fundo = new THREE.Mesh(fundoGeometria, fundoMaterial);
    fundo.position.set(0,0,0);
    cena.add(fundo);
}





function paredeTraseira() {
    var fundoGeometria = new THREE.BoxGeometry(Largura_campo+40, 250, 1),
        fundoMaterial = new THREE.MeshPhongMaterial({color: groundColor}),
        fundo = new THREE.Mesh(fundoGeometria, fundoMaterial);
    fundo.position.set(-5,140,-Comprimento_campo/2);
    cena.add(fundo);
   
}

function criarParedes() {
    var fundoGeometria = new THREE.BoxGeometry(20, 20, Comprimento_campo),
        fundoMaterial = new THREE.MeshPhongMaterial({color: groundColor}),
        esquerda = new THREE.Mesh(fundoGeometria, fundoMaterial),
        direita = new THREE.Mesh(fundoGeometria, fundoMaterial);
    esquerda.position.set(-Largura_campo/2-10,10,0);
    direita.position.set(Largura_campo/2+10,10,0);
    cena.add(direita);
    cena.add(esquerda);
}

function sliders() {
    var playersGeometria = new THREE.BoxGeometry(100, 20, 10),
    playersMaterial = new THREE.MeshPhongMaterial({color: 0x15ea9c});
    player1 = new THREE.Mesh(playersGeometria, playersMaterial);
    player2 = new THREE.Mesh(playersGeometria, new THREE.MeshPhongMaterial({color: 0xeaa615}));
    player1.position.set(0,10,-Comprimento_campo/2 + 20);
    player2.position.set(0,10,Comprimento_campo/2 - 20);
    cena.add(player1);
    cena.add(player2);
    collidableObjects.push(player1);
    collidableObjects.push(player2);
}

function Cubo() {
  var cuboGeometria = new THREE.SphereGeometry(10,10,10),
      cuboMaterial = new THREE.MeshPhongMaterial({color: backgroundColor});
  cubo = new THREE.Mesh(cuboGeometria,cuboMaterial);
  cubo.position.set(0,5,0);
  cena.add(cubo);
  collidableObjects.push(cubo);
}



function Bloqueio(){

  var cubeGeometry = new THREE.BoxGeometry(30, 30, 30);
  var cubeMaterial =  new THREE.MeshPhongMaterial({color: groundColor});
  var cu = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cu.position.set(RandomXCube(), 10, RandomYCube());
  cube1=cu;
  cena.add(cube1);
 
}

function Bloqueio2(){

  var cubeGeometry = new THREE.BoxGeometry(30, 30, 30);
  var cubeMaterial =  new THREE.MeshPhongMaterial({color: groundColor});
  var cu = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cu.position.set(RandomXCube(), 10, RandomYCube());
  cube2=cu;
  cena.add(cube2);
 
}

function RandomXCube() {
  return Math.random() * ((Largura_campo/2-50) - (-Largura_campo/2+50)) + (-Largura_campo/2+50) ;
}

function RandomYCube() {
  return Math.random() * ((Comprimento_campo/2-200) - (-Comprimento_campo/2+200)) + (-Comprimento_campo/2+200);
  
}


function listenTeclasPressionadas() {
  // Tecla pressionada

  var teclaPressionada = function(event) {
    switch (event.which) {
      case 37: Esquerda();
        break;
      case 39: Direita();
        break;
      case 32:
        reset()
        break;
    }
  };

  // Tecla solta
  var teclaSolta = function(event) {
  switch (event.which) {
    case 37:  
    //player2.position.x -=20;
      break;
   case 39: 
   //player2.position.x += 20;
      break;
  }
};

// Add event listeners for when movement keys are pressed and released
document.addEventListener('keydown', teclaSolta, false);
document.addEventListener('keyup', teclaPressionada, false);
}

function Direita(){
    //player2.position.x += 10;
}
function Esquerda(){
    //player2.position.x -= 10;
}

function controlarCubo() {

  
  if(!cubo.$velocity){
    comecarMovimentoCubo();
  }
  atualizarPosicaoCubo();
  if(cubo.position.z == player2.position.z && (cubo.position.x < player2.position.x+ 50 && cubo.position.x > player2.position.x - 50 ) ){
    cubo.$velocity.x = (cubo.position.x - player2.position.x) / 3;
    cubo.$velocity.z *= -1;
  }
  if(cubo.position.z == player1.position.z && (cubo.position.x < player1.position.x+ 50 && cubo.position.x > player1.position.x - 50 ) ){
    cubo.$velocity.x = (cubo.position.x - player1.position.x) / 3;
    cubo.$velocity.z *= -1;
  }
  
  if(cubo.position.z > player2.position.z+ 1000 ){
    score1= score1+1;
    updateScoreBoard();
    reset();
  }
  if(cubo.position.z < player1.position.z -1000){
    score2= score2+1;
    updateScoreBoard();
    reset();
  }

 

  if(isSideCollision()) {
    cubo.$velocity.x *= -1;   console.log("reset");

  }


 if(cubo.position.x < cube1.position.x+15 && cubo.position.x > cube1.position.x-15 && cubo.position.z < cube1.position.z+15 && cubo.position.z > cube1.position.z-15){
    cubo.$velocity.x *= -1;
    cubo.$velocity.z *= -1;

  }

 if(cubo.position.x < cube2.position.x+15 && cubo.position.x > cube2.position.x-15 && cubo.position.z < cube2.position.z+15 && cubo.position.z > cube2.position.z-15){
  cubo.$velocity.x *= -1;
  cubo.$velocity.z *= -1;

}
}


// Ajuste do tamanho do ecra
function onWindowResize() {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animar o jogo
function animate() {
  render();
  // Keep updating the renderer
  requestAnimationFrame(animate);
  controlarCubo();
  //computador_jogador();

}

// Parar cubo
function pararCubo() {
  cubo.$stoped = true;
}

// Reset do Jogo
function reset() {
  console.log("reset");
  cubo.position.set(0,10,0);
  cubo.$velocity= null;
  //player1.position.x=0;
  //player2.position.x=0;
}

// Começao movimento do cubo 
function comecarMovimentoCubo() {
  var direcao = Math.random() > 0.5 ? -1 : 1;
  cubo.$velocity = {
    x: 0,
    z: direcao * 20
  };
}

//Atualizar a posição do cubo
function atualizarPosicaoCubo() {
  var cuboPos = cubo.position;
  cuboPos.x += cubo.$velocity.x;
  cuboPos.z += cubo.$velocity.z;

}



// Render the scene
function render() {
  //requestAnimationFrame(render);
  var time = Date.now() / 6000;
				camara.position.x = 800 * Math.cos( time );
				camara.position.z = 800 * Math.sin( time );
				camara.lookAt( cena.position );
				for ( var i = 0, l = cena.children.length; i < l; i ++ ) {
					var mesh = cena.children[ i ];
					mesh.position.x = Math.sin( time * 4 ) * i * i * 0.005;
					mesh.position.z = Math.cos( time * 6 ) * i * i * 0.005;
				}
  renderer.render(cena, camara);
}

// Converts degrees to radians
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Converts radians to degrees
function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}


function isSideCollision() {
  var cuboX = cubo.position.x,
      metade = Largura_campo / 2;
  return cuboX - 5 < -metade ||cuboX + 5 > metade;
}


  
function updateScoreBoard() {
  scoreBoard.innerHTML = 'PC-' + score1 + '  vs  ' + score2+ '-Jogador' ;
}