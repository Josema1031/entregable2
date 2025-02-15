/* llamar /abrir y cerrar carrito */
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cerrar");

cartIcon.addEventListener('click', () => {
    cart.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cart.classList.remove('active');
});




document.addEventListener('DOMContentLoaded', function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    function updateCart() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        if (cartContainer && cartTotal) {
            cartContainer.innerHTML = '';
            let total = 0;

            for (const productoId in cart) {
                if (cart.hasOwnProperty(productoId)) {
                    const item = cart[productoId];
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        ${item.name} - Cantidad: 
                        <input type="number" class="cantidad-input" data-producto-id="${productoId}" value="${item.cantidad}" min="1">
                        - Precio: $${item.precio * item.cantidad}
                        <button class="remove-from-cart" data-producto-id="${productoId}">Eliminar</button>
                    `;
                    cartContainer.appendChild(listItem);
                    total += item.precio * item.cantidad;

                }
            }

            cartTotal.textContent = `Total: $${total}`;
            localStorage.setItem('cart', JSON.stringify(cart));

            // Añadir event listeners para los campos de cantidad
            const cantidadInputs = document.querySelectorAll('.cantidad-input');
            cantidadInputs.forEach(input => {
                input.addEventListener('input', (event) => {
                    const productoId = event.target.getAttribute('data-producto-id');
                    const nuevaCantidad = parseInt(event.target.value);
                    if (nuevaCantidad > 0) {
                        cart[productoId].cantidad = nuevaCantidad;
                        updateCart(); // Actualizar el carrito nuevamente
                    }
                });
            });

            // Añadir event listeners para el boton de eliminar
            const removeButtons = document.querySelectorAll('.remove-from-cart');
            removeButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const productoId = event.target.getAttribute('data-producto-id');
                    delete cart[productoId];
                    updateCart(); // Actualizar el carrito nuevamente
                });
            });
        }
    }



    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const productoId = button.getAttribute('data-producto-id');
            const nombreProducto = card.querySelector('h3').textContent;
            const productprecioText = card.querySelector('p:nth-of-type(3)').textContent;
            const productprecio = parseFloat(productprecioText.replace('Precio: $', ''));
            const cantidad = parseInt(card.querySelector('input[type="number"]').value, 10);

            if (!cart[productoId]) {
                cart[productoId] = { name: nombreProducto, precio: productprecio, cantidad: 0 };
            }

            cart[productoId].cantidad += cantidad;

            alert(`Producto añadido al carrito. Cantidad total: ${cart[productoId].cantidad}`);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });

    // Solo actualiza el carrito si estamos en la página del carrito
    if (document.getElementById('cart-items')) {
        updateCart();
    }

    //BOTON PARA ENVIAR MSJ DE TEXTO VIA WHATSAPP PARA HACER EL PEDIDO DE LA BURGER
    if (document.getElementById('hacercompra')) {
        document.getElementById('hacercompra').addEventListener('click', () => {
            let mesaje = 'Hola Marvel, me gustaría hacer el siguiente pedido:\n\n';
            let total = 0;

            for (const productoId in cart) {
                if (cart.hasOwnProperty(productoId)) {
                    const item = cart[productoId];
                    mesaje += `${item.name} 
                    Cantidad: ${item.cantidad}
                    Precio: $${item.precio * item.cantidad}\n`;
                    total += item.precio * item.cantidad;
                }
            }

            mesaje += `\nTotal: $${total}`;

            const phoneNumber = '5493415326060'; // Mi número de WhatsApp 
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(mesaje)}`;

            window.open(whatsappUrl, '_blank');
            cart = {};
            localStorage.removeItem('cart');
            updateCart();
        });
    }
    //BOTON PARA CANCELAR LA COMPRA DE LA BURGER
    if (document.getElementById('cancel')) {
        document.getElementById('cancel').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cancelar la compra?')) {
                cart = {};
                updateCart();
                alert('Compra cancelada.');
                localStorage.removeItem('cart');
            }
        });
    }


    //BOTON PARA PARA HACER UN RECLAMO DEL PEDIDO A TRAVEZ DE UN MSJ DE WHATSAPP
    if (document.getElementById('reclamo-pedido')) {
        document.getElementById('reclamo-pedido').addEventListener('click', () => {
            const reclamomesaje = 'Hola, me gustaría hacer un reclamo:\n\n';
            const phoneNumber = '5493415326060'; // Mi número de WhatsApp en formato internacional
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(reclamomesaje)}`;

            window.open(whatsappUrl, '_blank');
        });
    }

    if (document.getElementById('cart-items')) {
        document.getElementById('cart-items').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-cart')) {
                const productoId = e.target.getAttribute('data-producto-id');
                delete cart[productoId];
                updateCart();
            }
        });
    }

    // Obtener los elementos del DOM
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    // Abrir la ventana modal automáticamente al cargar la página
    window.onload = function () {
        modal.style.display = "block";
    }

    // Cuando el usuario hace clic en la X, cierra la ventana modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Cuando el usuario hace clic fuera de la ventana modal, cierra la ventana modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Obténcion de la ventana modal
    var modal = document.getElementById("myModal");

    // Obténcion de la imagen del modal
    var modalImage = document.getElementById("modal-image");

    // Obténcion del el botón de cerrar
    var span = document.getElementsByClassName("close")[0];

    // Función para obtener la imagen correspondiente al día de la semana, para las ofertas del dia a dia
    function getImageForDay() {
        var day = new Date().getDay(); // Obténcion del día de la semana (0 - Domingo, 6 - Sábado)
        var images = [
            "imagenes/DOMINGO.jpg",   // Domingo
            "imagenes/LUNES.jpg",     // Lunes
            "imagenes/MARTES.jpg",    // Martes
            "imagenes/MIERCOLES.jpg", // Miércoles
            "imagenes/JUEVES.jpg",    // Jueves
            "imagenes/VIERNES.jpg",   // Viernes
            "imagenes/SABADO.jpg"     // Sábado
        ];
        return images[day];
    }

    // Establece la imagen en el modal
    modalImage.src = getImageForDay();

    // Cuando el usuario haga clic en el botón de cerrar, cierra el modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Cuando el usuario haga clic en cualquier parte fuera del modal, cierra el modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


    updateCart();
});




