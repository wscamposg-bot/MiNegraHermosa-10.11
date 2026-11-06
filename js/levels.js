// Validación y renderizado de cada candado.
function normalizeAnswer(value) {
    return value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function checkAnswer(level, input) {
    if (!level || input === null || input === undefined) return false;
    if (level.type === "number") return String(input).trim() === level.answers[0];
    const answer = normalizeAnswer(input);
    return level.answers.some((validAnswer) => answer.includes(normalizeAnswer(validAnswer)));
}

function renderLevel(levelIndex, handlers) {
    const level = LEVELS[levelIndex];
    const host = document.getElementById("level-content");
    const title = document.createElement("h2");
    title.className = "level-heading";
    title.id = "level-title";
    title.innerHTML = `<span class="level-emoji" aria-hidden="true">${level.emoji}</span>${level.title}`;

    const question = document.createElement("p");
    question.className = "question-copy";
    question.textContent = level.question;
    host.replaceChildren(title, question);

    if (level.type === "options") {
        const grid = document.createElement("div");
        grid.className = "options-grid";
        grid.setAttribute("role", "group");
        grid.setAttribute("aria-label", "Elige una respuesta");
        level.options.forEach((option) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "option-button";
            button.textContent = option;
            button.addEventListener("click", () => handlers.submit(option, button));
            grid.append(button);
        });
        host.append(grid);
        return;
    }

    const form = document.createElement("form");
    form.className = "answer-form";
    const input = document.createElement("input");
    input.className = "answer-input";
    input.type = level.type === "number" ? "text" : "text";
    input.inputMode = level.type === "number" ? "numeric" : "text";
    input.autocomplete = "off";
    input.placeholder = level.placeholder;
    input.setAttribute("aria-label", level.type === "number" ? "Fecha especial, cuatro dígitos" : "Tu respuesta");
    input.required = true;

    const button = document.createElement("button");
    button.className = "button button-primary";
    button.type = "submit";
    button.innerHTML = 'Abrir candado <span aria-hidden="true">→</span>';
    form.append(input, button);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        handlers.submit(input.value, button);
    });
    host.append(form);
    input.focus({ preventScroll: true });
}
