
class FormSubmit {
    constructor(settings) {
      this.settings = settings;
      this.form = document.querySelector(settings.form);
      this.formButton = document.querySelector(settings.button);
      if (this.form) {
        this.url = this.form.getAttribute("action");
      }
      this.sendForm = this.sendForm.bind(this);
    }
  
    displaySuccess() {
      this.form.innerHTML = this.settings.success;
    }
  
    displayError() {
      this.form.innerHTML = this.settings.error;
    }
  
    getFormObject() {
      const formObject = {};
      const fields = this.form.querySelectorAll("[name]");
      fields.forEach((field) => {
        formObject[field.getAttribute("name")] = field.value;
      });
      return formObject;
    }
  
    onSubmission(event) {
      event.preventDefault();
      event.target.disabled = true;
      event.target.innerText = "Enviando solicitação...";
    }
  
    async sendForm(event) {
      try {
        this.onSubmission(event);
        await fetch(this.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(this.getFormObject()),
        });
        this.displaySuccess();
      } catch (error) {
        this.displayError();
        throw new Error(error);
      }
    }
  
    init() {
      if (this.form) this.formButton.addEventListener("click", this.sendForm);
      return this;
    }
  }

  const formSubmit = new FormSubmit({
    form: "[data-form]",
    button: "[data-button]",
    success: "<div class='sucesso'> <h1 class='success'>Solicitação enviada!</h1> <a class='back' href='../index.html'>Voltar</a> </div>",
    error: "<h1 class='error'>Não foi possível enviar sua mensagem. <a class='back' href='../index.html'>Voltar</a></h1>",
  });
  formSubmit.init();

  // Validar CPF
  document.getElementById("cpf").addEventListener("input", function () {
    const cpfInput = this.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const formattedCPF = formatCPF(cpfInput); // Formata o CPF com pontos e traço

    this.value = formattedCPF;
});

function formatCPF(cpf) {
    if (cpf.length <= 3) {
        return cpf;
    } else if (cpf.length <= 6) {
        return cpf.replace(/(\d{3})(\d{0,3})/, "$1.$2");
    } else if (cpf.length <= 9) {
        return cpf.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
    }
}