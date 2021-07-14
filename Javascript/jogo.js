var camaraFlag = 1;

//Colisoes entre edificios e nitro/carro
var ObjetosPredios = [];
var LightPredios = [];
var edificio;
var flag = 0;

var ObjNitro;
var flagNitro = 0;

var totalincre = 0;
var flagBaixo = false;

//Variáveis
var objeto;
var objetoImportado;
var estrada;
rotacao = 0.0005;
var velocidadeS = 0.00005;
var velocidadeW = 0;
var velocidadeNitro = 0.006;
var espaço=6.28/36
var travou = "false";

var nitro=0;
var objetosNitro=[];
//--------------- relogio ---------------
let seconds = 0;
let minutes = 0;
let hours = 0;

let displaySeconds = 0;
let displayMinutes = 0;
let displayHours = 0;

let interval = null;

let status = "stopped";

// Luzes

var LightCarros = [];
var LightNitros = [];
var LightMoto;

//Luzes Modo Noite Moto
var lightf;
var lightt;

//--------------------

//Variáveis para verificar colisão
var perdeu = false;
var ganhou = false;
var objetosColisao=[];

var ModoNoite = false;

//Criar Cena
var cena = new THREE.Scene();
var camara = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var camara2= new THREE.OrthographicCamera(window.innerWidth / - 400, window.innerWidth / 400, window.innerHeight / 400, window.innerHeight / -400,0.1,1000 );
camara2.position.set(0,10,0);
camara2.rotation.x = Math.PI/-8;

var renderer = new THREE.WebGLRenderer( { alpha: true } ); 
renderer.setClearColor( 0xffffff, 0 ); 

renderer.setSize(window.innerWidth -15, window.innerHeight-15);

document.body.appendChild(renderer.domElement);

window.onload=function(){
    document.getElementById("AlternarCamaras").addEventListener("click", function() {
        if(camaraFlag  == 2){
            camaraFlag = 1;
        }else{
            camaraFlag = 2;
        }
    })

    document.getElementById("ModoNoite").addEventListener("click", function() {
        if(ModoNoite == false){
           LigarLuzesModoNoite();
           ModoNoite = true;
        }
        else{
            DesligarLuzesModoNoite();
            ModoNoite = false;
        }
    })
}

document.addEventListener('DOMContentLoaded', Start);

function Start(){
    CriarEstrada();

    addMoto();

    LuzesNoiteMoto();

    camara.position.z = 6.5;
    camara.position.y = 2.5;

    camara2.position.z = 6.5;
    camara2.position.y = 2.7;

    startStop();
    document.getElementById("relogio").style.display="block";
    document.getElementById("myProgress").style.display="block";
    document.getElementById("NitroText").style.display="block";
    requestAnimationFrame(update);
}

function CriarEstrada(){
    var loader= new THREE.TextureLoader();
    var geometria = new THREE.SphereGeometry(20,100,100);
    var material = new THREE.MeshLambertMaterial( {map: loader.load('./imagens/estrada.jpg')} );
    estrada= new THREE.Mesh(geometria, material);
    estrada.rotation.z = Math.PI/2;
    estrada.rotation.x = Math.PI/0.92;
    estrada.position.y=-18;
    cena.add(estrada);

    //Adicionar carros numa metade da esfera
    for (var i = 0; i < 20; i++) {
        do{
            objeto = addcarro(0);

        }while(ColisaoEntreCarros(objeto) == 1);
    }

    //Adicionar carros na outra metade da esfera
    for (var i = 0; i < 20; i++) {
        do{
            objeto = addcarro(1);
        }while(ColisaoEntreCarros(objeto) == 1);
    }

    //Adicionar nitros numa metade da esfera
    for (var i = 0; i < 15; i++) {
        do{
            ObjNitro = GerarNitro(0);
            flagNitro = ColisaoEntreCarrosN(ObjNitro);
        }while(flagNitro == 1);
    }

    //Adicionar nitros na outra metade da esfera
    for (var i = 0; i < 15; i++) {
        do{
            ObjNitro = GerarNitro(1);
            flagNitro = ColisaoEntreCarrosN(ObjNitro);
        }while(flagNitro == 1);
    }

    for (var i = 0; i < 15; i++) {
        do{
            edificio = GerarEdificios(0);
            flag = ColisaoEntreEdificios(edificio);
        }while(flag == 1);
    }

    //Adicionar nitros na outra metade da esfera
    for (var i = 0; i < 15; i++) {
        do{
            edificio = GerarEdificios(1);
            flag = ColisaoEntreEdificios(edificio);
        }while(flag == 1);
    }
}

function addMoto()
{
    relogio= new THREE.Clock();
    var importer= new THREE.FBXLoader();
    importer.load('./Objetos/oldmoto.fbx',function(moto){
        mixerAnimacao=new THREE.AnimationMixer(moto);
        var action=mixerAnimacao.clipAction(moto.animations[0]);
        action.play();
        moto.traverse(function(child){
            if(child.isMesh){
                child.castShadow=true;
                child.receiveShadow=true;
            }
        });
        //Alterar tamanho e posição da moto
        moto.scale.x=0.003
        moto.scale.y=0.003;
        moto.scale.z=0.003;

        moto.position.x=0;
        moto.position.y=1.9;
        moto.position.z=5.1;

        moto.rotation.y=Math.PI;
        moto.rotation.x=Math.PI/12;
        objetoImportado=moto;	

        //Adicionar Luz à moto
        LuzMoto();	
        //Adicionar a moto à cena
        cena.add(moto);
    })
}

function addcarro(face)
{
    var carro = new Car();
    //Alterar tamanho e posição da moto
    carro.scale.x=0.025;
    carro.scale.y=0.025;
    carro.scale.z=0.025;

    var i = Math.random();
    var pista;

    if(i >= 0 && i < 0.25)
    {
        pista = -1.5;
    }
    else if(i >= 0.25 && i < 0.5)
    {
        pista = -0.5;
    }
    else if(i >= 0.5 && i < 0.75)
    {
        pista = 0.5;
    }
    else{
        pista = 1.5;
    }

    var x= randomPosNeg(19.8);
    var y= pista;
    var z= 0;

    if(face == 0){
        z= ObterZ(x,y);
    }
    else{
        z= -ObterZ(x,y);
    }
    
    var point = new THREE.Vector3( x, y, z );
    carro.lookAt(point);

    carro.position.x = x;
    carro.position.y = y;
    carro.position.z = z;

    return carro;
}

function LuzMoto(){
    LightMoto = new THREE.AmbientLight("#ffffff",0.5);
    LightMoto.position.y=5;
    LightMoto.position.z=10;
    LightMoto.lookAt(objetoImportado.position);
    cena.add(LightMoto);
}

function LuzCarros(x,y,z,car){
    var light = new THREE.PointLight("#ffffff",1,3);
    light.position.x=x+0.4;
    light.position.y=y+0.4;
    light.position.z=z+0.4;
    light.lookAt(car.position);
    LightCarros.push(light);
    estrada.add(light);
}

function update(){

    /*if(camaraAndar != null){
        camara.position.x += camaraAndar.x;
        camara.position.z += camaraAndar.z;
    }*/

    if(objetoImportado!=null && camaraAndar!=null)
    {	
        objetoImportado.position.x+=camaraAndar.x;		
    }

    if(objetosNitro != null){
        if(flagBaixo == false)
        {
            objetosNitro.forEach(function(n) {
                if(n.position.z >= 0){
                    n.position.z -= 0.002;
                }
                else{
                    n.position.z += 0.002;
                }
            });
            totalincre = totalincre + 0.002;
            if(totalincre > 0.2){
                flagBaixo = true;
            }
        }
        else{
            objetosNitro.forEach(function(n) {
                if(n.position.z >= 0){
                    n.position.z += 0.002;
                }
                else{
                    n.position.z -= 0.002;
                }
            });
            totalincre = totalincre - 0.002;
            if(totalincre <= 0.002){
                flagBaixo = false;
            }
        }

    }

    if(estrada.rotation.x > 9.6 ){
        ganhou = true;
        status = "started";
        startStop();
        document.getElementById("TempoGasto").innerHTML = "Tempo gasto: " +displayHours + ":" + displayMinutes + ":" + displaySeconds;
        var TempoRecorde = recorde();
        document.getElementById("Recorde").innerHTML = "Recorde: " +TempoRecorde.toString();

        document.getElementById('ModoNoite').style.display = 'none';
        document.getElementById('AlternarCamaras').style.display = 'none';
        document.getElementById('relogio').style.display = 'none';
        document.getElementById('NitroText').style.display = 'none';
        document.getElementById('myProgress').style.display = 'none';
        
        document.getElementById('popup2').style.display = 'block';
    }

    if(objetoImportado!=null)
    {	
        if(detetarColisao() == 1){

            perdeu = true;

            document.getElementById('ModoNoite').style.display = 'none';
            document.getElementById('AlternarCamaras').style.display = 'none';
            document.getElementById('relogio').style.display = 'none';
            document.getElementById('NitroText').style.display = 'none';
            document.getElementById('myProgress').style.display = 'none';

            document.getElementById('popup').style.display = 'block';
        }

        if(detetarColisaoNitro() == 1)
        {
            var aumento = 20;
            var NitroBar = document.getElementById('myBar').style.width.toString();

            var aux = NitroBar.split('%');
            var aux1 = parseFloat(aux[0]);

            if(NitroBar == ""){
                NitroBar = 20;
            }
            else if(aux1 <= 80){
                aux1 = +parseFloat(aux[0]) + aumento;
                NitroBar = aux1;
            }
            else if(aux1 < 100){
                NitroBar = 100;
            }

            document.getElementById('myBar').style.width = NitroBar.toString() +"%";
        }
    }


    if(perdeu == false && ganhou == false)
    {
        estrada.rotation.x += rotacao;
    }
    
    camaraAndar = {x:0, y:0, z:0};

    if(camaraFlag == 1)
    {
        renderer.render( cena, camara);
    }
    else
    {
        renderer.render( cena, camara2);
    }

    if(perdeu == true || ganhou == true){
        document.getElementById("relogio").style.display="none";
        document.getElementById("AlternarCamaras").style.display="none";
        document.getElementById("botaoModoNoite").style.display="none";
    }
    requestAnimationFrame(update);
}

var camaraAndar = { x:0, y:0, z:0};

var velocidadeAndar = 0.05;

document.addEventListener('keydown',ev=>{

    if(perdeu == true){
        return 0;
    }

    if(ganhou == true){
        return 0;
    }

    var coords={
        x:0,
        y:-18,
        z:2,
    };
    
    // Movimentação da mota

    var posicao = 1.4;

    if(camaraFlag == 2){
        posicao = 1.9;
    }

    if(ev.keyCode==65 && objetoImportado.position.x >= -posicao) //A
    {
        coords.x-=velocidadeAndar;
        lightf.position.x-=velocidadeAndar;
        lightt.position.x-=velocidadeAndar;
    }
    
    if(ev.keyCode==68 && objetoImportado.position.x <= posicao) //D
    {
        coords.x+=velocidadeAndar;
        lightf.position.x+=velocidadeAndar;
        lightt.position.x+=velocidadeAndar; 
    }

    if(ev.keyCode==87) // W
    {
        if(velocidadeW < 0.002){
            velocidadeW = velocidadeW + 0.00005;
        }

		estrada.rotation.x += velocidadeW;
    }
    
    if(ev.keyCode==83) //S
    {
        estrada.rotation.x -= rotacao;
    }

    if(ev.keyCode==32) //SPACE -> NITRO
    {
        var auxNitro = document.getElementById('myBar').style.width.toString();
        var aux2 = auxNitro.split('%');
        var aux3 = parseFloat(aux2[0]);
        if(aux3 >= 0.2){
            estrada.rotation.x += velocidadeNitro;
            aux3 = aux3 - 0.2;
            document.getElementById('myBar').style.width = aux3.toString() +"%";
        }
    }

    if(ev.keyCode==49){
        LightCarros.forEach(function(light) {
            light.visible = true;
        });
    
        LightNitros.forEach(function(light) {
            light.visible = false;
        });
    
        LightPredios.forEach(function(light) {
            light.visible = false;
        });
    
        LightMoto.visible = false;

        lightf.visible = false;
        lightt.visible = false;
    }

    if(ev.keyCode==50){
        LightCarros.forEach(function(light) {
            light.visible = false;
        });
    
        LightNitros.forEach(function(light) {
            light.visible = true;
        });
    
        LightPredios.forEach(function(light) {
            light.visible = false;
        });
    
        LightMoto.visible = false;

        lightf.visible = false;
        lightt.visible = false;
    }

    if(ev.keyCode==51){
        LightCarros.forEach(function(light) {
            light.visible = false;
        });
    
        LightNitros.forEach(function(light) {
            light.visible = false;
        });
    
        LightPredios.forEach(function(light) {
            light.visible = true;
        });
    
        LightMoto.visible = false;

        lightf.visible = false;
        lightt.visible = false;
    }

    if(ev.keyCode==52){
        LightCarros.forEach(function(light) {
            light.visible = false;
        });
    
        LightNitros.forEach(function(light) {
            light.visible = false;
        });
    
        LightPredios.forEach(function(light) {
            light.visible = false;
        });
    
        LightMoto.visible = true;

        lightf.visible = false;
        lightt.visible = false;
    }

    if(ev.keyCode==53){
        LightCarros.forEach(function(light) {
            light.visible = true;
        });
    
        LightNitros.forEach(function(light) {
            light.visible = true;
        });
    
        LightPredios.forEach(function(light) {
            light.visible = true;
        });
    
        LightMoto.visible = true;

        lightf.visible = false;
        lightt.visible = false;
    }

    // Câmara
    if(ev.keyCode==81) //Q 
    {
        alternarCamara();
    }

    // Modo Noite
    if(ev.keyCode==78) //N
    {
        if(ModoNoite == false){
            LigarLuzesModoNoite();
            ModoNoite = true;
        }
        else{
            DesligarLuzesModoNoite();
            ModoNoite = false;
        }
    }


    camaraAndar = coords;
});

function alternarCamara()
{
    if(camaraFlag == 1)
    {
        camaraFlag = 2;
    }
    else
    {
        camaraFlag=1;
    }
}

function randomPosNeg(valor) {
    return (Math.random() * (Math.random() < 0.5 ? -1 : 1))*valor;
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function ObterZ(x,y){
    var z = Math.sqrt(400 - (x*x) - (y*y) );

    return z;
}

function detetarColisao() 
{
    var retorno = 0;

    cena.updateMatrixWorld();

    objetosColisao.forEach(function(obj) {

        var target = new THREE.Vector3(); 
        if(objetoImportado.position.distanceTo(obj.getWorldPosition(target)) < 0.8)
        {
            retorno = 1;
        }
    });

    return retorno;
}

function stopWatch(){

    seconds++;

    //Logic to determine when to increment next value
    if(seconds / 60 === 1){
        seconds = 0;
        minutes++;

        if(minutes / 60 === 1){
            minutes = 0;
            hours++;
        }

    }

    //If seconds/minutes/hours are only one digit, add a leading 0 to the value
    if(seconds < 10){
        displaySeconds = "0" + seconds.toString();
    }
    else{
        displaySeconds = seconds;
    }

    if(minutes < 10){
        displayMinutes = "0" + minutes.toString();
    }
    else{
        displayMinutes = minutes;
    }

    if(hours < 10){
        displayHours = "0" + hours.toString();
    }
    else{
        displayHours = hours;
    }

    //Display updated time values to user
    document.getElementById("relogio").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;

}



function startStop(){

    if(status === "stopped"){

        //Start the stopwatch (by calling the setInterval() function)
        interval = window.setInterval(stopWatch, 1000);
        status = "started";

    }
    else{

        window.clearInterval(interval);
        status = "stopped";

    }

}

function recorde() 
{
    var saved = null;
    try { 
      saved = localStorage.recorde.toString(); 
    } catch (e) { 
        console.log("Erro ao buscar a variavel em cache");
    }

    var recordeHoras;
    var recordeMinutos;
    var recordeSegundos;

    var AuxrecordeHoras;
    var AuxrecordeMinutos;
    var AuxrecordeSegundos;

    if(saved == null){
        localStorage.recorde =  displayHours + ":" + displayMinutes + ":" + displaySeconds;
        return localStorage.recorde.toString();
    }
    else{
    
        var TempoAtual = saved.split(':');
    
        AuxrecordeHoras = TempoAtual[0];
        AuxrecordeMinutos = TempoAtual[1];
        AuxrecordeSegundos = TempoAtual[2];
    }

    if(displayHours < AuxrecordeHoras){
        recordeHoras = displayHours;
        recordeMinutos = displayMinutes;
        recordeSegundos = displaySeconds;
        localStorage.recorde = recordeHoras + ":" + recordeMinutos + ":" + recordeSegundos;
    }
    else if(displayMinutes < AuxrecordeMinutos){
        recordeHoras = displayHours;
        recordeMinutos = displayMinutes;
        recordeSegundos = displaySeconds;
        localStorage.recorde = recordeHoras + ":" + recordeMinutos + ":" + recordeSegundos;
    }
    else if(displaySeconds < AuxrecordeSegundos){
        recordeHoras = displayHours;
        recordeMinutos = displayMinutes;
        recordeSegundos = displaySeconds;
        localStorage.recorde = recordeHoras + ":" + recordeMinutos + ":" + recordeSegundos;
    }
  
    return localStorage.recorde.toString();
}

function GerarNitro(face){

    const geometria = new THREE.SphereGeometry( 8, 32, 32 );
    const texture = new THREE.TextureLoader().load( 'imagens/textura_nitro.png' );
    // immediately use the texture for material creation
    const material = new THREE.MeshLambertMaterial( { map: texture } );
    esfera = new THREE.Mesh( geometria, material );

    //Alterar tamanho e posição da moto
    esfera.scale.x=0.025;
    esfera.scale.y=0.025;
    esfera.scale.z=0.025;

    var i = Math.random();
    var pista;

    if(i >= 0 && i < 0.25)
    {
        pista = -1.5;
    }
    else if(i >= 0.25 && i < 0.5)
    {
        pista = -0.5;
    }
    else if(i >= 0.5 && i < 0.75)
    {
        pista = 0.5;
    }
    else{
        pista = 1.5;
    }

    var x= randomPosNeg(19.8);
    var y= pista;
    var z= 0;

    if(face == 0){
        z= ObterZ(x,y);
        if(x>=0 && x< 5){
            z = z + 0.6;
        }
        else if(x>=5 && x< 10){
            z = z + 0.3; 
        }
        else if(x>=10 && x< 15)
        {
            z = z + 0.6; 
        }
        else if(x>=15 && x< 20)
        {
            z = z + 1;
        }

        if(x>=-20 && x < -15){
            z = z + 1; 
        }
        else if(x>=-15 && x< -10){
            z = z + 0.6; 
        }
        else if(x>=-10 && x< -5)
        {
            z = z + 0.5; 
        }
        else if(x>=-5 && x<= 0)
        {
            z = z + 0.5; 
        }
    }
    else{
        z= -ObterZ(x,y);

        if(x>=0 && x< 5){
            z = z - 0.7; 
        }
        else if(x>=5 && x< 10){
            z = z - 0.8; 
        }
        else if(x>=10 && x< 15)
        {
            z = z - 0.8; 
        }
        else if(x>=15 && x< 20)
        {
            z = z - 1; 
        }

        if(x>=-20 && x < -15){
            z = z - 0.9; 
        }
        else if(x>=-15 && x< -10){
            z = z - 0.8; 
        }
        else if(x>=-10 && x< -5)
        {
            z = z - 0.6; 
        }
        else if(x>=-5 && x<= 0)
        {
            z = z - 0.6; 
        }
    }

    esfera.position.x = x;
    esfera.position.y = y;
    esfera.position.z = z;

    return esfera;
}

function LuzNitros(x,y,z,esfera){
    light = new THREE.PointLight("#ffffff",0.5,6);
    light.position.x=x;
    light.position.y=y;
    light.position.z=z;
    light.lookAt(esfera.position);
    LightNitros.push(light);
    estrada.add(light);
}

function detetarColisaoNitro() 
{
    var retorno = 0;

    if(objetosNitro == null){
        return 0;
    }

    estrada.updateMatrixWorld();

    objetosNitro.forEach(function(obj) {

        var target = new THREE.Vector3(); 
        if(objetoImportado.position.distanceTo(obj.getWorldPosition(target)) < 0.3)
        {
            estrada.remove(obj);
            removerObj(objetosNitro,obj);
            retorno = 1;
        }
    });

    return retorno;
}

function removerObj(arr, item) {
    for (var i = arr.length; i--;) {
      if (arr[i] === item) arr.splice(i, 1);
    }
 }

function LuzesNoiteMoto(){

    lightf = new THREE.SpotLight("#ffffff",0.5);
    lightf.position.x=0;
    lightf.position.y=1.9;
    lightf.position.z=5.5;
    lightf.lookAt(0,2.1,5);
    lightf.visible = false;
    cena.add(lightf);

    lightt = new THREE.SpotLight("#ffffff",0.25);
    lightt.position.x=0;
    lightt.position.y=1.9;
    lightt.position.z=5.5;
    lightt.lookAt(0,1.9,5.7);
    lightt.visible = false;
    cena.add(lightt);
}

function LigarLuzesModoNoite(){
    LightCarros.forEach(function(light) {
        light.visible = false;
    });

    LightNitros.forEach(function(light) {
        light.visible = false;
    });

    LightPredios.forEach(function(light) {
        light.visible = false;
    });

    LightMoto.visible = false;

    lightf.visible = true;
    lightt.visible = true;
    
    document.body.style.backgroundImage = "url('./imagens/background2.jpg')"; 
}

function DesligarLuzesModoNoite(){
    LightCarros.forEach(function(light) {
        light.visible = true;
    });

    LightNitros.forEach(function(light) {
        light.visible = true;
    });

    LightPredios.forEach(function(light) {
        light.visible = true;
    });

    LightMoto.visible = true;

    lightf.visible = false;
    lightt.visible = false;
    document.body.style.backgroundImage = "url('./imagens/background.jpg')";
}

function ColisaoEntreCarros(carro){
    if(objetosColisao == null){
        //Adicionar Luz ao carro
        LuzCarros(carro.position.x,carro.position.y,carro.position.z,carro);	 

        objetosColisao.push(carro);

        estrada.add(carro);
        return 0;
    }

    objetosColisao.forEach(function(obj) {
        if(Math.abs(carro.position.z - obj.position.z) < 10)
        {
            return 1;
        }
    });

    //Adicionar Luz ao carro
    LuzCarros(carro.position.x,carro.position.y,carro.position.z,carro);	 

    objetosColisao.push(carro);

    estrada.add(carro);

    return 0;
}

function ColisaoEntreCarrosN(nitro){

    if(objetosNitro== null){
        //Adicionar Luz à esfera
        LuzNitros(nitro.position.x,nitro.position.y,nitro.position.z, nitro);	 
        objetosNitro.push(nitro);
        estrada.add(nitro);
        return 0;
    }

    objetosColisao.forEach(function(obj) {
        if(Math.abs(nitro.position.z - obj.position.z) < 10)
        {
            return 1;
        }
    });

    //Adicionar Luz à esfera
    LuzNitros(nitro.position.x,nitro.position.y,nitro.position.z, nitro);
    objetosNitro.push(nitro);
    estrada.add(nitro);

    return 0;
}

function GerarEdificios(face){
    var j = Math.random();
    const geometry = new THREE.BoxGeometry( 40,9,15,10,10,10 );
    let texture;
    if(j>=0 && j< 0.25){
        texture = new THREE.TextureLoader().load( 'imagens/texturaEdificio.jpg' );
    }
    else if(j>=0.25 && j< 0.5){
        texture = new THREE.TextureLoader().load( 'imagens/texturaEdificio2.jpg' );
    }
    else if(j>=0.5 && j< 0.75){
        texture = new THREE.TextureLoader().load( 'imagens/texturaEdificio3.jpg' );
    }
    else{
        texture = new THREE.TextureLoader().load( 'imagens/texturaEdificio4.jpg' );
    }
    const material = new THREE.MeshLambertMaterial( { map: texture } );
    const predio = new THREE.Mesh( geometry, material );

    //Alterar tamanho e posição da moto
    predio.scale.x=0.1;
    predio.scale.y=0.1;
    predio.scale.z=0.1;

    var i = Math.random();
    var pista;


    if(i >= 0 && i < 0.5)
    {
        pista = -3.5;
    }
    else{
        pista = 3.5;
    }

    var x= randomPosNeg(19.8);
    var y= pista;
    var z= 0;

    if(face == 0){
        z= ObterZ(x,y);
    }
    else{
        z= -ObterZ(x,y);
    }

    predio.position.x = x;
    predio.position.y = y;
    predio.position.z = z;

    var point = new THREE.Vector3( x, y, z );
    predio.lookAt(point);

    //predio.rotation.y = Math.PI/8;

    return predio;
}

function ColisaoEntreEdificios(predio){
    var retorno = 0;

    if(ObjetosPredios == null){
        ObjetosPredios.push(predio);
        LuzPredios(predio.position.x,predio.position.y,predio.position.z,predio);
        estrada.add(predio);
        return 0;
    }

    ObjetosPredios.forEach(function(obj) {
        if(predio.position.distanceTo(obj.position) < 2)
        {
            retorno = 1;
        }
    });

    if(retorno == 0){
        ObjetosPredios.push(predio);
        LuzPredios(predio.position.x,predio.position.y,predio.position.z,predio);
        estrada.add(predio);
    }

    return retorno;
}

function LuzPredios(x,y,z,predio)
{
    light = new THREE.PointLight("#ffffff",0.7,4);
    light.position.x=x;
    light.position.y=y+2;
    light.position.z=z;

    light.lookAt(predio.position);
    LightPredios.push(light);
    estrada.add(light);
}