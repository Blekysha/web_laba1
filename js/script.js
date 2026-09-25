document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.querySelector(".main-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var opened = navigation.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(opened));
      menuButton.textContent = opened ? "Закрыть" : "Меню";
    });
  }

  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  function puppyCard(puppy) {
    var statusClass = "status-" + puppy.status;
    return `
      <article class="puppy-card">
        <img src="${puppy.image}" alt="Щенок по кличке ${puppy.name}">
        <div class="puppy-info">
          <h3>${puppy.name}</h3>
          <p class="puppy-full-name">${puppy.fullName}</p>
          <span class="status ${statusClass}">${puppy.statusText}</span>
          <p>${puppy.description}</p>
          <table>
            <tr><th>Пол</th><td>${puppy.sex}</td></tr>
            <tr><th>Дата рождения</th><td>${puppy.born}</td></tr>
            <tr><th>Окрас</th><td>${puppy.color}</td></tr>
            <tr><th>Отец</th><td><a href="dogs.html#${puppy.father.toLowerCase()}">${puppy.father}</a></td></tr>
            <tr><th>Мать</th><td><a href="dogs.html#${puppy.mother.toLowerCase()}">${puppy.mother}</a></td></tr>
          </table>
        </div>
      </article>`;
  }

  function renderList(containerId, status) {
    var container = document.getElementById(containerId);
    if (!container || typeof puppies === "undefined") return;

    var list = puppies.filter(function (p) { return p.status === status; });

    if (!list.length) {
      container.innerHTML = '<p class="empty-note">Сейчас в этом разделе нет щенков.</p>';
      return;
    }

    container.innerHTML = list.map(puppyCard).join("");
  }

  var featured = document.getElementById("featured-puppies");
  if (featured && typeof puppies !== "undefined") {
    var available = puppies.filter(function (p) { return p.status === "available"; });

    if (!available.length) {
      featured.innerHTML = '<p class="empty-note">В настоящий момент свободных щенков нет. Информация о новых помётах появится позже.</p>';
    } else {
      available = available.slice().sort(function () { return Math.random() - 0.5; });
      featured.innerHTML = available.slice(0, 3).map(puppyCard).join("");
    }
  }

  renderList("available-puppies", "available");
  renderList("reserved-puppies", "reserved");
  renderList("family-puppies", "family");

  var planned = document.getElementById("planned-litters");
  if (planned && typeof plannedLitters !== "undefined") {
    planned.innerHTML = plannedLitters.map(function (item) {
      return `
        <article class="planned-item">
          <strong>${item.period}</strong>
          <div>
            <p><b>Родители:</b> <a href="dogs.html#${item.father.toLowerCase()}">${item.father}</a> × <a href="dogs.html#${item.mother.toLowerCase()}">${item.mother}</a></p>
            <p>${item.note}</p>
          </div>
        </article>`;
    }).join("");
  }

  var form = document.getElementById("contact-form");
  if (!form) return;

  var nameInput = document.getElementById("name");
  var emailInput = document.getElementById("email");
  var phoneInput = document.getElementById("phone");
  var messageInput = document.getElementById("message");
  var agreementInput = document.getElementById("agreement");
  var statusBox = document.getElementById("form-status");

  function showError(field, message) {
    var error = document.getElementById(field.id + "-error");
    if (error) error.textContent = message;
    if (field.type !== "checkbox") field.classList.toggle("is-invalid", Boolean(message));
  }

  function validateName() {
    var value = nameInput.value.trim();
    if (value.length < 2) {
      showError(nameInput, "Введите имя (не менее 2 символов).");
      return false;
    }
    showError(nameInput, "");
    return true;
  }

  function validateEmail() {
    var value = emailInput.value.trim();
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!pattern.test(value)) {
      showError(emailInput, "Укажите корректный e-mail.");
      return false;
    }
    showError(emailInput, "");
    return true;
  }

  function validatePhone() {
    var value = phoneInput.value.trim();
    var pattern = /^[+()\-\s\d]{7,20}$/;
    if (value !== "" && !pattern.test(value)) {
      showError(phoneInput, "Проверьте номер телефона.");
      return false;
    }
    showError(phoneInput, "");
    return true;
  }

  function validateMessage() {
    var value = messageInput.value.trim();
    if (value.length < 10) {
      showError(messageInput, "Сообщение должно быть не короче 10 символов.");
      return false;
    }
    showError(messageInput, "");
    return true;
  }

  function validateAgreement() {
    var error = document.getElementById("agreement-error");
    if (!agreementInput.checked) {
      error.textContent = "Необходимо подтвердить согласие.";
      return false;
    }
    error.textContent = "";
    return true;
  }

  nameInput.addEventListener("blur", validateName);
  emailInput.addEventListener("blur", validateEmail);
  phoneInput.addEventListener("blur", validatePhone);
  messageInput.addEventListener("blur", validateMessage);
  agreementInput.addEventListener("change", validateAgreement);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var valid = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateMessage(),
      validateAgreement()
    ].every(Boolean);

    statusBox.className = "form-status";

    if (!valid) {
      statusBox.textContent = "Проверьте поля формы.";
      statusBox.classList.add("error");
      return;
    }

    statusBox.textContent = "Сообщение заполнено корректно.";
    statusBox.classList.add("success");
    form.reset();
  });
});
