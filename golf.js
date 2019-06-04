/**
 * Copyright (c) 2019 
 * Bruno Novo & João Valente
 */
'use strict';
    Physijs.scripts.worker = 'physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
    
var backgroundColor = 0xe0e0e0,
    groundColor = 0x663300,
    viewAngle = 90,
    near = 1,
    far = 2000,
    PLAYERSPEED = 200, // How fast the player moves
    Largura_campo=1000,
    Comprimento_campo=1500,
    bola,
    renderer,
    camara,
    perto,
    mesh,
    fundo,
    cena;

    init();
    animate();

Ammo().then( function( AmmoLib ) {

  Ammo = AmmoLib;

  init();
  animate();

} );
function init(){
  cena = new Physijs.Scene;
  cena.setGravity(new THREE.Vector3( 0, -30, 0 ));
  cena.addEventListener(
    'update',
    function() {
      applyForce();
      cena.simulate( undefined, 1 );
      physics_stats.update();
    }
  );

    // Definir render
    renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
    // Render para o container
    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Definir a posiçao da camara
    camara = new THREE.PerspectiveCamera( viewAngle, window.innerWidth / window.innerHeight, near, far );
    camara.position.z = 900;
    camara.position.y = 300 * Math.cos( 100 );
    cena.add(camara);
   
    criarFundo();
    Parede();
    bola();
    luzes();
    //criarBuraco();

    camara.lookAt( cena.position );
    window.addEventListener('resize', onWindowResize, false);
}

function criarBuraco(){

 /* var radius   = 50,
    segments = 100,
   // geometry= new THREE.SphereGeometry(50,0,50)
    material = new THREE.MeshPhongMaterial( { color: 0x000000 } ),
    geometry = new THREE.CircleGeometry( radius, segments );
    buraco=new THREE.LineLoop( geometry, material );
    buraco.rotation.x = - Math.PI / 2;
    buraco.position.y=1;
    buraco.position.z=-300;
*/
    var radius   = 50,
    segments = 100,
    geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength),
        material = new THREE.MeshPhongMaterial( { color: 0x000000 } ),
        buraco= new THREE.Mesh(geometry, material);

    cena.add( buraco);

// To get a closed circle use LineLoop instead (see also @jackrugile his comment):
    //cena.add(buraco);
}

function criarFundo() {
  var texture = new THREE.TextureLoader().load( 'relva.png' );
  var geometry = new THREE.BoxBufferGeometry(Largura_campo, 1, Comprimento_campo/2);
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  mesh = new THREE.Mesh( geometry, material );
  fundo = new THREE.Mesh(geometry, material);
  fundo.position.set(0,0,Comprimento_campo/4);
  mesh.position.set(0,0,-Comprimento_campo/4);
  cena.add(fundo);
  cena.add(mesh);

// To get a closed circle use LineLoop instead (see also @jackrugile his comment):
//cena.add(buraco);

}



  function luzes() {
    var luz = new THREE.DirectionalLight(0xffffff, 1.2);
    luz.position.set(1, 2, 1);
    cena.add(luz);
  
  }

  function bola() {
    var bolaGeometria = new THREE.SphereGeometry(15,15,15),
        bolaMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
    bola = new THREE.Mesh(bolaGeometria,bolaMaterial);
    bola.position.set(0,20,600);
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
    generateObject();
  }



function Parede(){


  
  var fundoGeometria = new THREE.BoxGeometry(Largura_campo+40, 40, 40),
  fundoMaterial = new THREE.MeshPhongMaterial({color: groundColor}),
  fundo = new THREE.Mesh(fundoGeometria, fundoMaterial);
  fundo.position.set(0,10,-Comprimento_campo/2);
  perto = new THREE.Mesh(fundoGeometria, fundoMaterial);
  perto.position.set(0,20,Comprimento_campo/2+10);
  cena.add(fundo);
  cena.add(perto);

  var fundoGeometria = new THREE.BoxGeometry(40, 40, Comprimento_campo),
        fundoMaterial = new THREE.MeshPhongMaterial({color: groundColor}),
        esquerda = new THREE.Mesh(fundoGeometria, fundoMaterial),
        direita = new THREE.Mesh(fundoGeometria, fundoMaterial);
    esquerda.position.set(-Largura_campo/2-10,10,0);
    direita.position.set(Largura_campo/2+10,10,0);
    cena.add(direita);
    cena.add(esquerda);

}




/////////////////Exemplo 
function generateObject() {

  var numTypes = 4;
  var objectType = Math.ceil( Math.random() * numTypes );

  var threeObject = null;
  var shape = null;

  var objectSize = 3;
  var margin = 0.05;

  switch ( objectType ) {

    case 1:
      // Sphere
      var radius = 1 + Math.random() * objectSize;
      threeObject = new THREE.Mesh( new THREE.SphereBufferGeometry( radius, 20, 20 ), createObjectMaterial() );
      shape = new Ammo.btSphereShape( radius );
      shape.setMargin( margin );
      break;
    case 2:
      // Box
      var sx = 1 + Math.random() * objectSize;
      var sy = 1 + Math.random() * objectSize;
      var sz = 1 + Math.random() * objectSize;
      threeObject = new THREE.Mesh( new THREE.BoxBufferGeometry( sx, sy, sz, 1, 1, 1 ), createObjectMaterial() );
      shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
      shape.setMargin( margin );
      break;
    case 3:
      // Cylinder
      var radius = 1 + Math.random() * objectSize;
      var height = 1 + Math.random() * objectSize;
      threeObject = new THREE.Mesh( new THREE.CylinderBufferGeometry( radius, radius, height, 20, 1 ), createObjectMaterial() );
      shape = new Ammo.btCylinderShape( new Ammo.btVector3( radius, height * 0.5, radius ) );
      shape.setMargin( margin );
      break;
    default:
      // Cone
      var radius = 1 + Math.random() * objectSize;
      var height = 2 + Math.random() * objectSize;
      threeObject = new THREE.Mesh( new THREE.ConeBufferGeometry( radius, height, 20, 2 ), createObjectMaterial() );
      shape = new Ammo.btConeShape( radius, height );
      break;

  }

  threeObject.position.set( ( Math.random() - 0.5 ) * terrainWidth * 0.6, terrainMaxHeight + objectSize + 2, ( Math.random() - 0.5 ) * terrainDepth * 0.6 );

  var mass = objectSize * 5;
  var localInertia = new Ammo.btVector3( 0, 0, 0 );
  shape.calculateLocalInertia( mass, localInertia );
  var transform = new Ammo.btTransform();
  transform.setIdentity();
  var pos = threeObject.position;
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
  var motionState = new Ammo.btDefaultMotionState( transform );
  var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
  var body = new Ammo.btRigidBody( rbInfo );

  threeObject.userData.physicsBody = body;

  threeObject.receiveShadow = true;
  threeObject.castShadow = true;

  scene.add( threeObject );
  dynamicObjects.push( threeObject );

  physicsWorld.addRigidBody( body );



}

function createObjectMaterial() {

  var c = Math.floor( Math.random() * ( 1 << 24 ) );
  return new THREE.MeshPhongMaterial( { color: c } );

}

function initPhysics() {

  // Physics configuration

  collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
  broadphase = new Ammo.btDbvtBroadphase();
  solver = new Ammo.btSequentialImpulseConstraintSolver();
  physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
  physicsWorld.setGravity( new Ammo.btVector3( 0, - 6, 0 ) );

  // Create the terrain body

  var groundShape = createTerrainShape();
  var groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  // Shifts the terrain, since bullet re-centers it on its bounding box.
  groundTransform.setOrigin( new Ammo.btVector3( 0, ( terrainMaxHeight + terrainMinHeight ) / 2, 0 ) );
  var groundMass = 0;
  var groundLocalInertia = new Ammo.btVector3( 0, 0, 0 );
  var groundMotionState = new Ammo.btDefaultMotionState( groundTransform );
  var groundBody = new Ammo.btRigidBody( new Ammo.btRigidBodyConstructionInfo( groundMass, groundMotionState, groundShape, groundLocalInertia ) );
  physicsWorld.addRigidBody( groundBody );

  transformAux1 = new Ammo.btTransform();

}
