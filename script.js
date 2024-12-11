document.addEventListener("DOMContentLoaded", () => {
    const previewButton = document.getElementById("preview");
    const downloadButton = document.getElementById("download");
    const addTextButton = document.getElementById("addText");
    const addImageButton = document.getElementById("addImage");
    const addButtonButton = document.getElementById("addButton");
    const emailPreview = document.getElementById("emailPreview");

    const textColorInput = document.getElementById("textColor");
    const fontSizeInput = document.getElementById("fontSize");
    const fontFamilyInput = document.getElementById("fontFamily");
    const blockBgColorInput = document.getElementById("blockBgColor");
    const imgWidthInput = document.getElementById("imgWidth");
    const imgHeightInput = document.getElementById("imgHeight");

    let selectedBlock = null; // Хранит текущий выбранный блок

    // Инициализация элементов с настройками по умолчанию
    const header = emailPreview.querySelector(".email-header");
    const body = emailPreview.querySelector(".email-body");

    header.contentEditable = "true";
    body.contentEditable = "true";
    header.style.color = textColorInput.value;
    header.style.fontSize = `${fontSizeInput.value}px`;
    header.style.fontFamily = fontFamilyInput.value;
    body.style.color = textColorInput.value;
    body.style.fontSize = `${fontSizeInput.value}px`;
    body.style.fontFamily = fontFamilyInput.value;

    // Обработчик выбора блока
    emailPreview.addEventListener("click", (e) => {
        if (e.target !== emailPreview && !e.target.classList.contains("menu")) {
            selectedBlock = e.target; // Устанавливаем выбранный блок
            document.querySelectorAll(".email-preview .selected").forEach((el) => el.classList.remove("selected"));
            selectedBlock.classList.add("selected");
        } else {
            selectedBlock = null; // Если кликнули вне блока, снимаем выбор
        }
    });

    // Применение фона только после выбора блока и настройки
    blockBgColorInput.addEventListener("input", () => {
        if (selectedBlock) {
            selectedBlock.style.backgroundColor = blockBgColorInput.value;
        }
    });

    // Изменение цвета текста
    textColorInput.addEventListener("input", () => {
        if (selectedBlock) {
            selectedBlock.style.color = textColorInput.value;
        }
    });

    // Изменение размера шрифта
    fontSizeInput.addEventListener("input", () => {
        if (selectedBlock) {
            selectedBlock.style.fontSize = `${fontSizeInput.value}px`;
        }
    });

    // Изменение шрифта
    fontFamilyInput.addEventListener("change", () => {
        if (selectedBlock) {
            selectedBlock.style.fontFamily = fontFamilyInput.value;
        }
    });

    // Предпросмотр
    previewButton.addEventListener("click", () => {
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head>
                    <title>Предпросмотр</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
                        .email-preview { border: 1px solid #ddd; max-width: 600px; margin: 0 auto; padding: 20px; background: #fefefe; }
                        .email-header, .email-footer { background: #eef6ff; padding: 10px 0; text-align: center; }
                        .email-body { padding: 10px; }
                    </style>
                </head>
                <body>${emailPreview.outerHTML}</body>
            </html>
        `);
        newWindow.document.close();
    });

    // Скачивание HTML
    downloadButton.addEventListener("click", () => {
        const emailHTML = emailPreview.innerHTML;
        const tableHTML = emailHTML.replace(/<div/g, "<td").replace(/<\/div>/g, "</td>");
        const blob = new Blob([tableHTML], { type: "text/html;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "email-template.html";
        link.click();
    });

    // Добавление текста
    addTextButton.addEventListener("click", () => {
        const textBlock = document.createElement("div");
        textBlock.contentEditable = "true";  
        textBlock.textContent = "Напишите сюда ваш текст...";
        textBlock.classList.add("draggable");
        textBlock.style.color = textColorInput.value;
        textBlock.style.fontSize = `${fontSizeInput.value}px`;
        textBlock.style.fontFamily = fontFamilyInput.value;

        // Выпадающее меню
        const menu = document.createElement("div");
        menu.classList.add("menu");
        menu.innerHTML = `
            <button class="delete">Удалить</button>
            <button class="move">Переместить</button>
        `;
        textBlock.appendChild(menu);

        // Кнопка удаления
        const deleteButton = menu.querySelector(".delete");
        deleteButton.addEventListener("click", () => {
            textBlock.remove();
        });

        textBlock.addEventListener("click", () => {
            menu.style.display = "block";
        });

        body.appendChild(textBlock);
        makeDraggable(textBlock);
    });

    // Добавление изображения
    addImageButton.addEventListener("click", () => {
        const imageBlock = document.createElement("div");
        const img = document.createElement("img");
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                img.src = event.target.result;
                img.style.maxWidth = "100%";
                img.style.height = "auto";
                img.style.width = `${imgWidthInput.value || 100}px`;
                img.style.height = `${imgHeightInput.value || 100}px`;
            };
            reader.readAsDataURL(file);
        });

        // Выпадающее меню
        const menu = document.createElement("div");
        menu.classList.add("menu");
        menu.innerHTML = `
            <button class="delete">Удалить</button>
            <button class="move">Переместить</button>
        `;
        imageBlock.appendChild(menu);

        const deleteButton = menu.querySelector(".delete");
        deleteButton.addEventListener("click", () => {
            imageBlock.remove();
        });

        imageBlock.appendChild(fileInput);
        body.appendChild(imageBlock);
        makeDraggable(imageBlock);
    });

    // Функция для перетаскивания элементов
    function makeDraggable(element) {
        element.setAttribute("draggable", true);
        element.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", element.outerHTML);
        });

        body.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        body.addEventListener("drop", (e) => {
            e.preventDefault();
            if (e.target === body) {
                body.appendChild(document.createElement("div")).innerHTML = e.dataTransfer.getData("text");
            }
        });
    }
});
