
const maxWidth = document.querySelector('#maxWidth');
const redimensionar = document.querySelector('#redimensionar');
const archivoInput = document.querySelector('#archivoinput');
const caja = document.querySelector('#caja');
const valorRango = document.querySelector('#valorRango'); 
let archivoImg;
let imagen = new Image();
let size = valorRango.value;

redimensionar.addEventListener('click',ejecutar,false);

caja.addEventListener("dragenter", e => {
    e.preventDefault();
});

caja.addEventListener("dragover", e => {
     e.preventDefault();
});

caja.addEventListener("drop", e =>{
    e.preventDefault();
    archivoImg = e.dataTransfer.files[0]; 
    convertir(archivoImg);
});

maxWidth.addEventListener('change', e =>{
    valorRango.value = maxWidth.value; 
    size = valorRango.value;
});


archivoInput.addEventListener('change', e =>{
    archivoImg = e.target.files[0];
    convertir(archivoImg);
});


function ejecutar(e){
    e.preventDefault();
    document.querySelector('#thumb-template').innerHTML='';
    if(archivoImg){
       
        resize(imagen,size)
       
    }
    
}

async function resize(imagen,ancho){
    const config = {
        img: imagen,
        maxSize: ancho
    };
    try{
      const resizeImg = await resizeImage(config);
      document.querySelector('#thumb-template').innerHTML= `<img id="img-resized"  src ="${resizeImg}">`;
      document.querySelector('#txtbase64').innerHTML = resizeImg;
      document.querySelector('#rchar').innerHTML = resizeImg.length ;
      const i = document.querySelector('#img-resized');

         i.onload = () => {
            fetch(i.src)
            .then(resp => resp.blob())
            .then(blob => {
              document.querySelector('#rsize').innerHTML = blob.size;
             });
        } 
     
       
    }catch (e){
        console.log(`Error ${e}`);
    };
    
}

const  convertir = async (file) =>{
    if (file && file.type.match(/^image\//)) {
      
        let fileReader= new FileReader();
        fileReader.readAsDataURL(file);
        
        fileReader.addEventListener("load", function(e) {
        imagen.src = e.target.result;
    
        document.querySelector('#thumb').innerHTML='';
        document.querySelector('#thumb').innerHTML= `<img id="img" src ="${e.target.result}">`;
        document.querySelector('#txtoriginal').innerHTML= e.target.result;
        document.querySelector('#osize').innerHTML = file.size;
        document.querySelector('#ochar').innerHTML = e.target.result.length;  
        }); 
      }else{
        let template = '';
        if(file){
          template =`<p><strong>El archivo seleccionado no es una imagen, es de tipo: ${file.type}</strong></p>`;
        }
        
        document.querySelector('#thumb').innerHTML = template;
        document.querySelector('#thumb-template').innerHTML= '';
        document.querySelector('#txtoriginal').innerHTML = '';
        document.querySelector('#txtbase64').innerHTML = '';
        document.querySelector('#osize').innerHTML = '0';
        document.querySelector('#ochar').innerHTML = '0';
        document.querySelector('#rsize').innerHTML = '0';
        document.querySelector('#rchar').innerHTML = '0';
        
      }

    }     

const resizeImage =  (settings) =>{
    let image = new Image();
    let maxSize = settings.maxSize;
    image.src = settings.img.src;
    let canvas = document.createElement('canvas');
    let width = image.width;
    let height = image.height;
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;   
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL();
        return dataUrl;
    
}
