// Define uma classe FormSubmit
class FormSubmit {
  constructor(settings) {
    // O construtor recebe um objeto de configurações
    this.settings = settings;
    this.form = document.querySelector(settings.form); // Seleciona o elemento do formulário
    this.formButton = document.querySelector(settings.button); // Seleciona o botão do formulário
    if (this.form) {
      this.url = this.form.getAttribute("action"); // Obtém a URL de ação do formulário
    }
    this.sendForm = this.sendForm.bind(this); // Liga o método `sendForm` ao contexto da instância
  }

  // Exibe uma mensagem de sucesso no formulário
  displaySuccess() {
    this.form.innerHTML = this.settings.success;
  }

  // Exibe uma mensagem de erro no formulário
  displayError() {
    this.form.innerHTML = this.settings.error;
  }

  // Obtém os valores dos campos do formulário e retorna um objeto
  getFormObject() {
    const formObject = {};
    const fields = this.form.querySelectorAll("[name]");
    fields.forEach((field) => {
      formObject[field.getAttribute("name")] = field.value;
    });
    return formObject;
  }

  // Manipulador para a submissão do formulário
  onSubmission(event) {
    event.preventDefault();
    event.target.disabled = true;
    event.target.innerText = "Enviando solicitação...";
  }

  // Envia o formulário via AJAX
  async sendForm(event) {
    try {
      this.onSubmission(event); // Chama a função para preparar a submissão
      await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(this.getFormObject()), // Envia os dados do formulário como JSON
      });
      this.displaySuccess(); // Exibe uma mensagem de sucesso
    } catch (error) {
      this.displayError(); // Exibe uma mensagem de erro
      throw new Error(error);
    }
  }

  // Inicializa a classe e adiciona um ouvinte de evento ao botão do formulário
  init() {
    if (this.form) this.formButton.addEventListener("click", this.sendForm);
    return this;
  }
}

// Cria uma instância da classe FormSubmit com configurações
const formSubmit = new FormSubmit({
  form: "[data-form]", // Seletor do formulário
  button: "[data-button]", // Seletor do botão de envio do formulário
  success: "<div class='sucesso'> <h1 class='success'>Solicitação enviada!</h1> <p class='response'>Em caso de solicitação faltando dados, a solicitação não será acatada!</p> <a class='back-index back' href='../index.html'><i class='uil uil-arrow-left'></i>Voltar</a></h1><a class='back' </div>", // Mensagem de sucesso
  error: "<h1 class='error'>Não foi possível enviar sua mensagem.  <a class='back' href='../index.html'>Voltar</a></h1>", // Mensagem de erro
});

formSubmit.init(); // Inicializa a instância da classe FormSubmit

// Validação de CPF
document.getElementById("CPF:").addEventListener("input", function () {
  const cpfInput = this.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  const formattedCPF = formatCPF(cpfInput); // Formata o CPF com pontos e traço

  this.value = formattedCPF; // Atualiza o valor do campo de CPF com o valor formatado
});

// Função para formatar o CPF com pontos e traço
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

// Ouve os eventos de alteração nos campos e valida o formulário em tempo real
document.querySelector("[data-form]").addEventListener("input", function (event) {
  const targetField = event.target;

  // Se o campo é um dos campos que requerem remoção de caracteres especiais
  if (targetField && ["Número da ADE:", "Banco Dígitado:", "Banco:", "Conta:", "Agência:"].includes(targetField.name)) {
    // Remove apenas caracteres especiais do valor atual do campo
    targetField.value = targetField.value.replace(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/\\]/g, '');
  }

  validateForm(); // Chama a função para validar os campos sempre que houver uma alteração
});

// window.addEventListener("load", function () {
//   exibirAlerta("Por favor, preencha os campos corretamente!")
// });

// // Alert customizado:
// function exibirAlerta(mensagem) {
//   const modal = document.getElementById("customAlert");
//   const alertMessage = document.getElementById("alertMessage");

//   alertMessage.innerHTML = mensagem;
//   modal.style.display = "block";
// }

// // Fechar alert customizado
// function fecharAlerta() {
//   const modal = document.getElementById("customAlert");
//   modal.style.animation = "fadeOut 0.5s ease-in-out";
//   setTimeout(() => {
//     modal.style.display = "none";
//     modal.style.animation = "";
//   }, 500);
// }