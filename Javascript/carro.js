const rodaGeometry = new THREE.CylinderGeometry(5, 5,33,12);
const rodaMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

const config = {
    showHitZones: false,
    shadows: true, // Use shadow
    trees: true, // Add trees to the map
    curbs: true, // Show texture on the extruded geometry
    grid: false // Show grid helper
};

function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);
  
    context.fillStyle = "#333333";
    context.fillRect(8, 8, 49, 24);
  
    return new THREE.CanvasTexture(canvas);
  }

  function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 30;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);
  
    return new THREE.CanvasTexture(canvas);
  }

  function HitZone() {
    const hitZone = new THREE.Mesh(
      new THREE.CylinderGeometry(20, 20, 60, 30),
      new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    hitZone.position.z = 25;
    hitZone.rotation.x = Math.PI / 2;
  
    scene.add(hitZone);
    return hitZone;
  }

  function Roda() {
    const roda = new THREE.Mesh(rodaGeometry, rodaMaterial);
    roda.position.z = 3;
    roda.castShadow = false;
    roda.receiveShadow = false;
    return roda;
  }

function Car() {
  const car = new THREE.Group();

  var loader= new THREE.TextureLoader();

  var nome;

  const rand = Math.floor(Math.random() * 7) + 1;

  console.log(rand);

  if(rand == 0){
    nome = "./imagens/carros/azul.jpg";
  }
  else if(rand == 1){
    nome = "./imagens/carros/vermelho.jpg";
  }
  else if(rand == 2){
    nome = "./imagens/carros/green.jpg";
  }
  else if(rand == 3){
    nome = "./imagens/carros/gold.jpg";
  }
  else if(rand == 4){
    nome = "./imagens/carros/roxo.jpg";
  }
  else if(rand == 5){
    nome = "./imagens/carros/cyan.jpg";
  }
  else if(rand == 6){
    nome = "./imagens/carros/laranja.jpg";
  }
  else{
    nome = "./imagens/carros/preto.jpg";
  }

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 30, 15),

    new THREE.MeshLambertMaterial({ map: loader.load(nome.toString()) }),

  );
  main.position.z = 12;
  main.castShadow = true;
  main.receiveShadow = true;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();
  carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
  carFrontTexture.rotation = Math.PI / 2;

  const carBackTexture = getCarFrontTexture();
  carBackTexture.center = new THREE.Vector2(0.5, 0.5);
  carBackTexture.rotation = -Math.PI / 2;

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.flipY = false;

  const carRightSideTexture = getCarSideTexture();

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 24, 12), [
    new THREE.MeshLambertMaterial({ map: carFrontTexture }),
    new THREE.MeshLambertMaterial({ map: carBackTexture }),
    new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
    new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
    new THREE.MeshLambertMaterial({ color: 0xffffff }) // bottom
  ]);
  cabin.position.x = -6;
  cabin.position.z = 25.5;
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  car.add(cabin);

  const backroda = new Roda();
  backroda.position.x = -18;
  car.add(backroda);

  const frontroda = new Roda();
  frontroda.position.x = 18;
  car.add(frontroda);

  if (config.showHitZones) {  
    car.userData.hitZone1 = HitZone();
    car.userData.hitZone2 = HitZone();
  }  
  return car;
}

  