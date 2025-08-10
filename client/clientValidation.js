import { signupSchema, loginSchema } from "../shared/zodSchema.js";

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formType = form.getAttribute("data-type");

  const formData = {
    username: document.querySelector("#username")?.value,
    email: document.querySelector("#email")?.value,
    password: document.querySelector("#password")?.value,
  };

  let result;

  if (formType === "signup") {
    result = signupSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      alert(errors.join("\n"));
      return;
    }
    const fileInput = document.querySelector("#photo");
    const file = fileInput?.files[0];

    if (!file) {
      alert("Please upload an image.");
      return;
    }

  } else {
    result = loginSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      alert(errors.join("\n"));
      return;
    }
  }

  form.submit();
});

