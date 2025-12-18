console.log("hola mundo.......")


document.addEventListener('DOMContentLoaded', () => {

    // 1. Datos de productos (Puse fotos de ejemplo, cámbialas por tus rutas ./img/...)
    const productos = [
        {
            id: 1, name: "Esmalte de uñas Condessa",
            precio: 5000, img: "./image/Product.1.1.jpg",
            desc: "Esmalte de uñas hipoalergenico con pincel de facil aplicacion."
        },
        { 
            id: 2, name: "Esmalte con efectos de cristales 3D - Crushed Crystals", 
            precio: 8500, img: "./image/Product.2.jpg", 
            desc: "Crushed Crystals - Esmalte con efecto de cristales 3D." 
        },
        { 
            id: 3, name: "Esmalte de uñas con efecto Gel Voluntad", 
            precio: 3200, img: "./image/Product.3.jpg", 
            desc: "Gel Voluntad de Vogue de excelente terminacion y larga duracion." 
        },
        { 
            id: 4, name: "Esmalte de uñas Gotas Dos Anjos", 
            precio: 12000, img: "./image/Product.4.jpg", 
            desc: "Gota Dos Anjos de Risque Care es hipoalergenico y de facil aplicacion." 
        }
    ];

    let carrito = JSON.parse(localStorage.getItem("carrito_final")) || [];

    const contenedor = document.getElementById("contenedor-productos");
    const listaCarrito = document.getElementById("lista-carrito-detallada");
    const contadorIcono = document.getElementById("contador-carrito");
    const totalPrecio = document.getElementById("total-precio");

    // 2. Función para dibujar los productos
    function mostrarCatalogo() {
        if (!contenedor) return;
        contenedor.innerHTML = "";

        productos.forEach(p => {
            const art = document.createElement("article");
            art.className = "product--section";
            art.innerHTML = `
                <img src="${p.img}" alt="${p.name}">
                <div class="product--section--text">
                    <h4>${p.name}</h4>
                    <p><strong>$${p.precio}</strong></p>
                    <button class="btn-desc" data-id="${p.id}" style="cursor:pointer">Ver Info</button>
                    <div id="info-${p.id}" class="info-extra">${p.desc}</div>
                    <br>
                    <button class="btn-add-final" data-id="${p.id}" style="background-color:#BBAB8C; padding:10px; border:none; cursor:pointer; font-weight:bold;">Agregar al Carrito</button>
                </div>
            `;
            contenedor.appendChild(art);
        });
    }

    // 3. Manejador de Clicks Global (Evita errores de consola)
    document.addEventListener('click', (e) => {
        // Botón Agregar
        if (e.target.classList.contains('btn-add-final')) {
            const id = parseInt(e.target.dataset.id);
            const existe = carrito.find(item => item.id === id);
            if (existe) {
                existe.cantidad++;
            } else {
                const prod = productos.find(p => p.id === id);
                carrito.push({ ...prod, cantidad: 1 });
            }
            actualizarCarrito();
        }

        // Botón Ver Descripción
        if (e.target.classList.contains('btn-desc')) {
            const id = e.target.dataset.id;
            document.getElementById(`info-${id}`).classList.toggle('visible');
        }

        // Botones + y - en el carrito
        if (e.target.classList.contains('btn-mas')) {
            const id = parseInt(e.target.dataset.id);
            carrito.find(i => i.id === id).cantidad++;
            actualizarCarrito();
        }

        if (e.target.classList.contains('btn-menos')) {
            const id = parseInt(e.target.dataset.id);
            const item = carrito.find(i => i.id === id);
            item.cantidad--;
            if (item.cantidad < 1) {
                carrito = carrito.filter(i => i.id !== id);
            }
            actualizarCarrito();
        }
    });

    // 4. Función de actualización (LocalStorage y DOM)
    function actualizarCarrito() {
        if (!listaCarrito) return;
        listaCarrito.innerHTML = "";

        let total = 0;
        let cantidadIcono = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p style="text-align: center; color: #888;">El carrito está vacío</p>';
        } else {
            carrito.forEach(item => {
                total += item.precio * item.cantidad;
                cantidadIcono += item.cantidad;

                const div = document.createElement("div");
                div.style.marginBottom = "15px";
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span><strong>${item.name}</strong> ($${item.precio})</span>
                        <div>
                            <button class="btn-qty btn-menos" data-id="${item.id}">-</button>
                            <span>${item.cantidad}</span>
                            <button class="btn-qty btn-mas" data-id="${item.id}">+</button>
                        </div>
                    </div>
                `;
                listaCarrito.appendChild(div);
            });
        }

        contadorIcono.innerText = cantidadIcono;
        totalPrecio.innerText = total;
        localStorage.setItem("carrito_final", JSON.stringify(carrito));
    }

    // Botón Vaciar
    const btnVaciar = document.getElementById("vaciar-carrito");
    if (btnVaciar) {
        btnVaciar.onclick = () => {
            carrito = [];
            actualizarCarrito();
        };
    }

    // Ejecución inicial
    mostrarCatalogo();
    actualizarCarrito();
});