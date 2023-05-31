const { Swal } = require("./libraries/sweetAlert")

const URL_API_SERVER = "http://localhost:3000/api"


const addProductToCart = async (id) =>{
    const objProductId = {
            productId:  id,
    }
    try {
     const {ok} = await  fetch(`${URL_API_SERVER}/cart/addProduct`,{method: "POST",
    body: JSON.stringify(objProductId),
    headers:{
        'Content-Type':'application/json'
    }
    })
    Swal.fire({
        title:ok ? "Producto agregado al carrito" : "Ups",
        icon: ok ? "Success" : "warning",
        showConfirmButton:false,
        timer:800
    })
}
     catch (error) {
        console.log(error);
    }
}