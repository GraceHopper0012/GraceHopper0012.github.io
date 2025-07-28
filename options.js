export class Option {
    static IDs = [];
    constructor(type = "checkbox", name, id, hover_description, options = {}, custom_classes = [], defaultValue = false) {
        if (Option.IDs.includes(id)) {
            return false;
        }
        this.id = id;
        Option.IDs.push(id);
        this.type = type;
        this.name = name;
        this.hover_description = hover_description;
        this.value = defaultValue;
        this.options = options;
        this.custom_classes = custom_classes;
    }

    render() {
        const container = document.createElement("div");
        container.innerText = this.name;

        const input = document.createElement("input");
        input.type = this.type;
        input.value = this.value;
        input.classList.add(this.custom_classes);
        input.addEventListener("input", () => {
            this.value = input.value;
        });

        container.appendChild(input);
        return container;
    }
}