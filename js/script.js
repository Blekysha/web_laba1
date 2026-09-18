document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
      navigation.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const form = document.querySelector("#contact-form");
  if (!form) return;

  const fields = {
    name: document.querySelector("#name"),
    email: document.querySelector("#email"),
    phone: document.querySelector("#phone"),
    message: document.querySelector("#message"),
    agreement: document.querySelector("#agreement")
  };

  const status = document.querySelector("#form-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^[+()\-\s\d]{7,20}$/;

  const setError = (fieldName, message) => {
    const field = fields[fieldName];
    const error = document.querySelector(`#${fieldName}-error`);

    if (field && field.type !== "checkbox") {
      field.classList.toggle("is-invalid", Boolean(message));
      field.setAttribute("aria-invalid", String(Boolean(message)));

      if (message) {
        field.setAttribute("aria-describedby", `${fieldName}-error`);
      } else {
        field.removeAttribute("aria-describedby");
      }
    }

    if (error) error.textContent = message;
  };

  const validateName = () => {
    const value = fields.name.value.trim();
    if (!value) {
      setError("name", "Введите имя.");
      return false;
    }
    if (value.length < 2) {
      setError("name", "Имя должно содержать минимум 2 символа.");
      return false;
    }
    setError("name", "");
    return true;
  };

  const validateEmail = () => {
    const value = fields.email.value.trim();
    if (!value) {
      setError("email", "Введите e-mail.");
      return false;
    }
    if (!emailPattern.test(value)) {
      setError("email", "Введите e-mail в формате name@example.com.");
      return false;
    }
    setError("email", "");
    return true;
  };

  const validatePhone = () => {
    const value = fields.phone.value.trim();
    if (value && !phonePattern.test(value)) {
      setError("phone", "Проверьте формат номера телефона.");
      return false;
    }
    setError("phone", "");
    return true;
  };

  const validateMessage = () => {
    const value = fields.message.value.trim();
    if (!value) {
      setError("message", "Напишите сообщение.");
      return false;
    }
    if (value.length < 10) {
      setError("message", "Сообщение должно содержать минимум 10 символов.");
      return false;
    }
    setError("message", "");
    return true;
  };

  const validateAgreement = () => {
    if (!fields.agreement.checked) {
      setError("agreement", "Подтвердите согласие.");
      return false;
    }
    setError("agreement", "");
    return true;
  };

  fields.name.addEventListener("blur", validateName);
  fields.email.addEventListener("blur", validateEmail);
  fields.phone.addEventListener("blur", validatePhone);
  fields.message.addEventListener("blur", validateMessage);
  fields.agreement.addEventListener("change", validateAgreement);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateMessage(),
      validateAgreement()
    ].every(Boolean);

    status.className = "form-status";

    if (!isValid) {
      status.textContent = "Проверьте поля формы и исправьте ошибки.";
      status.classList.add("error");

      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.textContent = "Форма заполнена корректно. В учебной версии данные никуда не отправляются.";
    status.classList.add("success");
    form.reset();

    Object.keys(fields).forEach((fieldName) => setError(fieldName, ""));
  });
});
