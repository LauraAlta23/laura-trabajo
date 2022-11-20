const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded', e => { cargarData() });
cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnAumentarDisminuir(e) })


const cargarData = () => {
   let data =  [{
        "precio": 15000,
        "id": 1,
        "titulo": "Cartel Lona Front",
        "imagen": "../img/cfront.jpg"
    },
    {
        "precio": 30000,
        "id": 2,
        "titulo": "Cartel Backlight",
        "imagen": "../img/cartelrojo.jpg"
    },
    {
        "precio": 25000,
        "id": 3,
        "titulo": "Cartel Tipo Marquesina",
        "imagen": "../img/marquesina2.jpg"
    },
    {
        "precio": 14999,
        "id": 4,
        "titulo": "Letras Corporeas de Polyfan",
        "imagen": "../img/letrasp.jpg"
    },
    {
        "precio": 22555,
        "id": 5,
        "titulo": "Letras Corporeas con Led",
        "imagen": "../img/letraled.jpg"
    },
    {
        "precio": 35150,
        "id": 6,
        "titulo": "Letras Corporeas de Acero Inoxidable",
        "imagen": "../img/LetrasC.jpg"
    },
    {
        "precio": 6399,
        "id": 7,
        "titulo": "Vinilo de Corte Impreso",
        "imagen": "../img/vinilo.jpg"
    },
    {
        "precio": 9990,
        "id": 8,
        "titulo": "Vinilo Microperforado",
        "imagen": "../img/vinilomicroimpreso.jpg"
    }
    ]

    pintarCards(data);

}


const pintarCards = data => {
    data.forEach(item => {

        const {id,titulo,precio,imagen} = item;

        templateCard.querySelector('h5').textContent = titulo
        templateCard.querySelector('p').textContent = precio
        templateCard.querySelector('button').dataset.id = id
        templateCard.querySelector('img').setAttribute("src", imagen)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
        agregarNotificacion("Producto agregado",2000);
    }
    e.stopPropagation()
}



const setCarrito = item => {    

    const producto = new Producto(
            item.querySelector('button').dataset.id,
            item.querySelector('h5').textContent,
            item.parentElement.firstElementChild.attributes.src,
            item.querySelector('p').textContent,            
            
            )
       
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto }

    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        const{id,titulo,cantidad,precio} = producto

        let frament = generarCard(id,titulo,cantidad,precio);
        items.appendChild(fragment);

    })

    pintarFooter();
}

const generarCard = (id,titulo,cantidad,precio)=>{
    
        templateCarrito.querySelector('th').textContent = id
        templateCarrito.querySelectorAll('td')[0].textContent = titulo
        templateCarrito.querySelectorAll('td')[1].textContent = cantidad
        templateCarrito.querySelector('span').textContent = precio * cantidad

        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = id
        templateCarrito.querySelector('.btn-danger').dataset.id = id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)

        return fragment;
    

}

const pintarFooter = () => {
    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
        `
        mostrarAlert("carrito vacio",2000);
        return
    }

 
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)


    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const btnAumentarDisminuir = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id];                

            } else {
                carrito[e.target.dataset.id] = {...producto }
            }
        pintarCarrito()
    }
    e.stopPropagation()
}



const mostrarAlert = (mensaje,duracion)=>{    


    Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: mensaje,
        showConfirmButton: false,
        timer: duracion
      })


};

const agregarNotificacion = (mensaje,duracion)=>{ 
    Toastify({
         text: mensaje,            
         duration: duracion
            
        }).showToast();
            
};