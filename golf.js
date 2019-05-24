/**
 * Copyright (c) 2019 
 * Bruno Novo & João Valente
 */

var backgroundColor = 0xe0e0e0,
    groundColor = 0x663300,
    viewAngle = 90,
    near = 1,
    far = 2000,
    PLAYERSPEED = 200, // How fast the player moves
    Largura_campo=1000,
    Comprimento_campo=1500
    bola;

init();
animate();

function init(){
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
    camara = new THREE.PerspectiveCamera( viewAngle, window.innerWidth / window.innerHeight, near, far );
    camara.position.z = 900;
    camara.position.y = 300 * Math.cos( 100 );
    camara.lookAt(cena.position);
    cena.add(camara);
    camara.lookAt( cena.position );
    

    var relvaGeo = new THREE.PlaneBufferGeometry( Largura_campo, Comprimento_campo );
    var relvaText = new THREE.CanvasTexture( generateTexture() );
    for ( var i = 0; i < 15; i ++ ) {
        var relvaMat = new THREE.MeshBasicMaterial( {
        color: new THREE.Color().setHSL( 0.3, 0.75, ( i / 15 ) * 0.4 + 0.1 ),
        map: relvaText,
        depthTest: false,
        depthWrite: false,
        transparent: true
        } );
        var relva = new THREE.Mesh( relvaGeo, relvaMat );
        relva.position.y = i * 0.25;
        relva.rotation.x = - Math.PI / 2;
        cena.add( relva );
    }
    bola();
    luzes();
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

  function luzes() {
    var luz = new THREE.DirectionalLight(0xffffff, 1.2);
    luz.position.set(1, 2, 1);
    cena.add(luz);
  
  }

  function bola() {
    var bolaGeometria = new THREE.SphereGeometry(10,10,10),
        bolaMaterial = new THREE.MeshPhongMaterial({color: backgroundColor});
    bola = new THREE.Mesh(bolaGeometria,bolaMaterial);
    bola.position.set(0,0,800);
    cena.add(bola);
  }

  function onWindowResize() {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    render();
    // Keep updating the renderer
    requestAnimationFrame(animate);;
  
  }

  // Render the scene
function render() {
    //requestAnimationFrame(render);
    renderer.render(cena, camara);
  }