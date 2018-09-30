let imagen;
const archivoInput = document.querySelector('#archivoinput');
const caja = document.querySelector('#caja');

caja.addEventListener("dragenter", e => {
    e.preventDefault();
});

caja.addEventListener("dragover", e => {
     e.preventDefault();
});

caja.addEventListener("drop", e =>{
    e.preventDefault();
    imagen = e.dataTransfer.files[0]; 
    if(imagen){
        resize(imagen); 
    }
});

archivoInput.addEventListener('change', e =>{
    imagen = e.target.files[0];
    if(imagen){
        resize(imagen); 
    }
});


async function resize(imagen){
    const config = {
        img: imagen,
        maxSize: 600
    };
    try{
      const resizeImg = await resizeImage(config);   
       console.log(`Resize ${resizeImg}`);
    }catch (e){
        console.log(`Error ${e}`);
    };
    
}


let resizeImage = async (settings) => {
 
    let file = settings.img;
    let maxSize = settings.maxSize;
    let fileReader = new FileReader();
    let image = new Image();
    let canvas = document.createElement('canvas');

    let resize = function () {
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
    };

    return new Promise(function (ok, error) {
        if (!file.type.match(/^image\//)) {
            error(new Error("No es una imagen"));
            return;
        }
        fileReader.onload = function (e) {
            image.onload = function () { return ok(resize()); };
            image.src = e.target.result;
            
        };
        fileReader.readAsDataURL(file);
    });
};
