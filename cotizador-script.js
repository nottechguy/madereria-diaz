document.addEventListener('DOMContentLoaded', function() {
    // ===== DATOS Y VARIABLES =====
    var initialProducts = [
        { id: 1, name: 'Tabla 30cm x 2.5mts 3/4" (Primera)', price: 280.00 }, { id: 2, name: 'Tabla 25cm x 2.5mts 3/4" (Primera)', price: 235.00 }, { id: 3, name: 'Tabla 20cm x 2.5mts 3/4" (Primera)', price: 185.00 }, { id: 4, name: 'Tabla 15cm x 2.5mts 3/4" (Primera)', price: 140.00 }, { id: 5, name: 'Tabla 10cm x 2.5mts 3/4" (Primera)', price: 95.00 }, { id: 6, name: 'Fajilla 5cm x 2.5mts 3/4" (Primera)', price: 50.00 }, { id: 7, name: 'Tabla 30cm x 2.5mts 3/4" (Segunda)', price: 220.00 }, { id: 8, name: 'Tabla 25cm x 2.5mts 3/4" (Segunda)', price: 185.00 }, { id: 9, name: 'Tabla 20cm x 2.5mts 3/4" (Segunda)', price: 150.00 }, { id: 10, name: 'Tabla 15cm x 2.5mts 3/4" (Segunda)', price: 110.00 }, { id: 11, name: 'Tabla 10cm x 2.5mts 3/4" (Segunda)', price: 75.00 }, { id: 12, name: 'Fajilla 5cm x 2.5mts 3/4" (Segunda)', price: 40.00 }, { id: 13, name: 'Tabla 30cm x 2.5mts 3/4" (Tercera)', price: 180.00 }, { id: 14, name: 'Tabla 25cm x 2.5mts 3/4" (Tercera)', price: 150.00 }, { id: 15, name: 'Tabla 20cm x 2.5mts 3/4" (Tercera)', price: 120.00 }, { id: 16, name: 'Tabla 15cm x 2.5mts 3/4" (Tercera)', price: 90.00 }, { id: 17, name: 'Tabla 10cm x 2.5mts 3/4" (Tercera)', price: 60.00 }, { id: 18, name: 'Triplay 18mm x 1.22 x 2.44mts', price: 780.00 }, { id: 19, name: 'Triplay 15mm x 1.22 x 2.44mts', price: 640.00 }, { id: 20, name: 'Barrote de segunda 5cm x 10cm 2.5mts', price: 150.00 }, { id: 21, name: 'Polin de segunda 10cm x 10cm 2.5mts', price: 300.00 }
    ];
    var products = [];
    var quoteItems = [];
    var get = function(id) { return document.getElementById(id); };

    // ===== FUNCIONES PRINCIPALES =====
    var formatCurrency = function(amount) {
        var formattedAmount = parseFloat(amount || 0).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return '$' + formattedAmount;
    };

    function numeroALetras(num) {
        if (num === null || num === undefined) {
            return "Cero pesos 00/100 M.N.";
        }

        var numero = parseFloat(num).toFixed(2);
        var [entero, decimales] = numero.split('.');

        var unidades = ["", "un ", "dos ", "tres ", "cuatro ", "cinco ", "seis ", "siete ", "ocho ", "nueve "];
        var decenas = ["diez ", "once ", "doce ", "trece ", "catorce ", "quince ", "dieciséis ", "diecisiete ", "dieciocho ", "diecinueve "];
        var veintenas = ["", "", "veinte ", "treinta ", "cuarenta ", "cincuenta ", "sesenta ", "setenta ", "ochenta ", "noventa "];

        var convertirCentenas = function(n) {
            var centenas = "";
            if (n > 99) {
                if (n == 100) centenas = "cien ";
                else {
                    var c = Math.floor(n / 100);
                    centenas = ["", "ciento ", "doscientos ", "trescientos ", "cuatrocientos ", "quinientos ", "seiscientos ", "setecientos ", "ochocientos ", "novecientos "][c];
                }
            }
            return centenas;
        };

        // ✨ FUNCIÓN CORREGIDA ✨
        var convertirDecenas = function(n) {
            n = n % 100;
            if (n === 0) return "";
            if (n < 10) return unidades[n];
            if (n < 20) return decenas[n - 10];
            
            // Corrección para la veintena
            if (n > 20 && n < 30) {
                return "veinti" + unidades[n % 10];
            }

            var d = Math.floor(n / 10);
            var u = n % 10;
            // Para 20, 30, 40, etc., y números compuestos como 31, 42...
            return veintenas[d] + (u > 0 ? "y " + unidades[u] : "");
        };

        var convertirMiles = function(n) {
            if (n < 1000) return convertirCentenas(n) + convertirDecenas(n);
            var miles = Math.floor(n / 1000);
            var resto = n % 1000;
            var milesTexto = "";

            if (miles === 1) {
                milesTexto = "mil ";
            } else {
                milesTexto = convertirCentenas(miles) + convertirDecenas(miles) + "mil ";
            }

            var restoTexto = convertirCentenas(resto) + convertirDecenas(resto);
            return milesTexto + restoTexto;
        };

        var enteroLetras = "cero";
        if (parseInt(entero) > 0) {
            enteroLetras = convertirMiles(parseInt(entero));
        }
        
        var resultado = enteroLetras.trim() + " pesos " + decimales + "/100 M.N.";
        return resultado.charAt(0).toUpperCase() + resultado.slice(1);
    }

    var loadProductsFromLocalStorage = function() {
        var stored = localStorage.getItem('madereria_products');
        products = stored && JSON.parse(stored).length > 0 ? JSON.parse(stored) : initialProducts;
    };

    // ===== FUNCIONES DE RENDERIZADO =====
    var renderViews = function() {
        renderMaterialList();
        renderPdfTable();
        renderProductSelector();
        var accionesFinales = document.querySelector('.acciones-finales');
        if (quoteItems.length > 0) {
            accionesFinales.classList.remove('hidden');
        } else {
            accionesFinales.classList.add('hidden');
        }
    };

    var renderMaterialList = function() {
        var listContainer = get('cotizacion-list');
        listContainer.innerHTML = '';
        var total = 0;
        quoteItems.forEach(function(item) {
            var product = products.find(function(p) { return p.id == item.id; });
            if (!product) return;
            var subtotal = item.quantity * product.price;
            total += subtotal;
            var listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.dataset.id = item.id;
            listItem.innerHTML = `
                <div class="item-main">
                    <div class="item-text">
                        <span class="text-primary">${product.name}</span>
                        <span class="text-secondary">
                            Cantidad: <input type="number" value="${item.quantity}" min="1" class="cantidad-input-list"> @ ${formatCurrency(product.price)}
                        </span>
                    </div>
                    <div class="item-subtotal">${formatCurrency(subtotal)}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-delete-item" title="Quitar producto">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                </div>`;
            listContainer.appendChild(listItem);
        });
        get('total-cotizacion-list').textContent = formatCurrency(total);
        get('total-en-letra').textContent = numeroALetras(total);
    };

    var renderPdfTable = function() {
    };

    var renderProductSelector = function() {
        var select = get('producto-select');
        select.innerHTML = '<option value="">-- Seleccione un producto --</option>';
        products.forEach(function(p) { select.innerHTML += `<option value="${p.id}">${p.name} - ${formatCurrency(p.price)}</option>`; });
    };

    // ===== EVENT LISTENERS =====
    get('cotizacion-list').addEventListener('input', function(e) {
        if (e.target.classList.contains('cantidad-input-list')) {
            var listItem = e.target.closest('.list-item');
            if (!listItem) return;

            var id = listItem.dataset.id;
            var newQuantity = parseInt(e.target.value, 10) || 0;

            // 1. Actualiza los datos en el array
            var item = quoteItems.find(function(q) { return q.id == id; });
            var product = products.find(function(p) { return p.id == id; });
            
            if (!item || !product) return;
            item.quantity = newQuantity;

            // 2. Actualiza solo el subtotal de la fila actual, sin redibujar todo
            var subtotal = item.quantity * product.price;
            var subtotalElement = listItem.querySelector('.item-subtotal');
            if (subtotalElement) {
                subtotalElement.textContent = formatCurrency(subtotal);
            }

            // 3. Recalcula y actualiza el total general
            var grandTotal = 0;
            quoteItems.forEach(function(quoteItem) {
                var associatedProduct = products.find(function(p) { return p.id == quoteItem.id; });
                if (associatedProduct) {
                    grandTotal += quoteItem.quantity * associatedProduct.price;
                }
            });
            get('total-cotizacion-list').textContent = formatCurrency(grandTotal);
            get('total-en-letra').textContent = numeroALetras(grandTotal);

            // 4. Mantiene la tabla oculta del PDF sincronizada (esto es seguro)
            renderPdfTable();
        }
    });

    get('cotizacion-list').addEventListener('click', function(e) {
        var deleteButton = e.target.closest('.btn-delete-item');
        if (deleteButton) {
            var id = deleteButton.closest('.list-item').dataset.id;
            quoteItems = quoteItems.filter(function(item) { return item.id != id; });
            renderViews();
        }
    });

    get('btn-agregar-producto').addEventListener('click', function() {
        var productId = get('producto-select').value;
        if (!productId) return;
        var existing = quoteItems.find(function(item) { return item.id == productId; });
        if (existing) { existing.quantity++; } 
        else { quoteItems.push({ id: productId, quantity: 1 }); }
        renderViews();
    });

    get('btn-limpiar-cotizacion').addEventListener('click', function() {
        if (confirm('¿Limpiar la cotización actual?')) {
            quoteItems = [];
            renderViews();
        }
    });

    get('btn-exportar-pdf').addEventListener('click', async function() {
        // Función auxiliar para cargar una imagen y convertirla a Base64
        function loadImageAsDataURL(url) {
            return new Promise(function(resolve, reject) {
                var img = new Image();
                img.onload = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = this.naturalWidth;
                    canvas.height = this.naturalHeight;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(this, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = function() {
                    reject(new Error('No se pudo cargar la imagen: ' + url));
                };
                img.src = url;
            });
        }

        try {
            // --- 1. Carga el logo primero ---
            var logoBase64 = await loadImageAsDataURL('logo.png');
            
            // --- 2. Recopila los datos del formulario ---
            var nombreCliente = get('cliente-nombre').value;
            var domicilioCliente = get('cliente-domicilio').value;
            var lugarCliente = get('cliente-lugar').value;
            var rfcCliente = get('cliente-rfc').value;
            
            // --- 3. Construye el PDF pieza por pieza ---
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF('p', 'mm', 'a4');

            var xOffset = 15; // Margen izquierdo
            var yPosition = 20;
            var lineHeight = 7;

            // Dibuja el logo
            doc.addImage(logoBase64, 'PNG', xOffset, yPosition - 10, 30, 30, 15); // Ajusta tamaño y posición

            // Dibuja el encabezado de la empresa
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.text("MADERERÍA DÍAZ", xOffset + 35, yPosition);

            // ... (El resto de la lógica programática que ya teníamos) ...
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            yPosition += lineHeight;
            doc.text("TABLAS - TABLONES - BARROTES - POLIN - TRIPLAY - FAJILLAS", xOffset + 35, yPosition);
            doc.text("Bulevard de las Naciones 2029 local 3, Playa Diamante, Acapulco Diamante, C.P. 39897", xOffset + 35, yPosition + 5);
            doc.text("R.F.C. DIRR850320F24 | Tel: 742-120-24-02 / 744-265-44-30", xOffset + 35, yPosition + 10);
            doc.text("Fecha: " + (new Date().toISOString().slice(0, 10)), xOffset + 35, yPosition + 15);

            yPosition += lineHeight * 4;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Datos del Cliente", xOffset, yPosition);
            doc.line(xOffset, yPosition + 2, 195, yPosition + 2);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            yPosition += lineHeight;
            doc.text("Nombre: " + nombreCliente, xOffset, yPosition);
            doc.text("Domicilio: " + domicilioCliente, xOffset, yPosition + 5);
            doc.text("Lugar: " + lugarCliente, xOffset, yPosition + 10);
            doc.text("R.F.C: " + rfcCliente, xOffset, yPosition + 15);

            yPosition += lineHeight * 3;
            doc.setFont("helvetica", "bold");
            doc.text("Cant.", xOffset, yPosition);
            doc.text("Descripción", xOffset + 20, yPosition);
            doc.text("P. Unit.", xOffset + 130, yPosition, { align: 'right' });
            doc.text("Importe", xOffset + 175, yPosition, { align: 'right' });
            doc.line(xOffset, yPosition + 2, 195, yPosition + 2);

            yPosition += lineHeight;
            doc.setFont("helvetica", "normal");
            var total = 0;
            var hasNomenclatura = false;

            quoteItems.forEach(function(item) {
                var product = products.find(function(p) { return p.id == item.id; });
                hasNomenclatura = /\(Primera|Segunda|Tercera\)/g.test(product.name);

                if (!product) return;

                var subtotal = item.quantity * product.price;
                total += subtotal;
                var descriptionLines = doc.splitTextToSize(product.name, 90);

                doc.text(String(item.quantity), xOffset + 5, yPosition, { align: 'center' });
                doc.text(descriptionLines, xOffset + 20, yPosition);
                doc.text(formatCurrency(product.price), xOffset + 130, yPosition, { align: 'right' });
                doc.text(formatCurrency(subtotal), xOffset + 175, yPosition, { align: 'right' });

                yPosition += (descriptionLines.length * 5) + 3;
            });

            doc.line(xOffset, yPosition, 195, yPosition);
            yPosition += lineHeight;

            if (hasNomenclatura) {
                doc.setFont("helvetica");
                doc.text("Nomenclatura:", xOffset, yPosition, { align: 'left' });
                doc.text("- (Primera): Madera de primera", xOffset, yPosition + 5, { align: 'left' });
                doc.text("- (Segunda): Madera de segunda", xOffset, yPosition + 10, { align: 'left' });
                doc.text("- (Tercera): Madera de tercera", xOffset, yPosition + 15, { align: 'left' });
            }

            doc.setFont("helvetica", "bold");
            doc.text("TOTAL:", xOffset + 130, yPosition, { align: 'right' });
            doc.text(formatCurrency(total), xOffset + 175, yPosition, { align: 'right' });
            doc.text("(" + numeroALetras(total) + ")", xOffset + 175, yPosition + 5, { align: 'right' });

            doc.save('cotizacion-madereria-diaz-' + new Date().toISOString().slice(0, 10) + '.pdf');

        } catch (error) {
            console.error("Error al generar el PDF:", error);
            alert("No se pudo generar el PDF. Asegúrate de que la ruta al logo es correcta.");
        }
    });

    // ===== INICIALIZACIÓN =====
    var init = function() {
        loadProductsFromLocalStorage();
        renderViews();
    };

    init();
});
