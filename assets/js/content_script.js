let auth_url = "";
let super_admin_email = "";
let super_admin_password = "";
let super_admin_iteration = "";

let admin_email = "";
let admin_password = "";
let admin_iteration = "";

let user_email = "";
let user_password = "";
let user_iteration = "";

let currentUrl = document.location.href.split("?")[0];

getCredentialsFromStorage();

function getCredentialsFromStorage() {
  chrome.storage.sync.get(["credentials"], (result) => {
    let credentials = {};
    if (result.credentials) {
      credentials = JSON.parse(result.credentials) || {};
    }

    auth_url =
      credentials?.auth_url || "https://ztn.revbits.net:4200/auth/login";
    super_admin_email = credentials?.super_admin_email || "superadmin@ztn.com";
    super_admin_password = credentials?.super_admin_password || "Pa$$W0rd@360";
    super_admin_iteration = credentials?.super_admin_iteration || "1000";
    admin_email = credentials?.admin_email || "admin@ztn.com";
    admin_password = credentials?.admin_password || "Pa$$W0rd@360";
    admin_iteration = credentials?.admin_iteration || "1000";
    user_email = credentials?.user_email || "admin@ztn.com";
    user_password = credentials?.user_password || "Pa$$W0rd@360";
    user_iteration = credentials?.user_iteration || "1000";

    renderButtons(auth_url);
  });
}

function renderButtons(auth_url) {
  const buttonsHtml = document.createElement("div");
  buttonsHtml.className = "quick-login-buttons-section";
  buttonsHtml.innerHTML = `
  <button class="quick-login-btn" data-type="super_admin">Super Admin Login</button>
  <button class="quick-login-btn" data-type="admin">Admin Login</button>
  <button class="quick-login-btn" data-type="user">User Login</button>
  <input type="text" id="quick-login-hidden-field">
  `;

  if (
    ![
      auth_url,
      "http://ztn-uat.revbits.net/auth/login",
      "https://ztn.revbits.com/auth/login",
    ].includes(currentUrl)
  ) {
    return true;
  }

  removeOldButtons();
  document.querySelector(".auth-form-content").appendChild(buttonsHtml);

  const buttons = document.querySelectorAll(".quick-login-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (e) {
      const user_type = e.target.dataset.type;
      setRequiredUserCreds(user_type);
    });
  }
}

function removeOldButtons() {
  buttonsSections = document.querySelector(".quick-login-buttons-section");
  if (buttonsSections) {
    buttonsSections.remove();
  }
}

function setRequiredUserCreds(user_type) {
  switch (user_type) {
    case "super_admin":
      login({
        email: super_admin_email,
        password: super_admin_password,
        iteration: super_admin_iteration,
      });
      break;
    case "admin":
      login({
        email: admin_email,
        password: admin_password,
        iteration: admin_iteration,
      });
      break;
    case "user":
      login({
        email: user_email,
        password: user_password,
        iteration: user_iteration,
      });
      break;
    default:
      login({
        email: admin_email,
        password: admin_password,
        iteration: admin_iteration,
      });
  }
}

function login(creds) {
  const { email } = creds;
  const emailField = document.querySelector("input[formcontrolname=email]");
  emailField.focus();
  emailField.value = "";
  document.execCommand("insertText", false, email);
  emailField.dispatchEvent(new Event("change", { bubbles: true }));
  document.querySelector("#quick-login-hidden-field").focus();

  const continueLoginBtn = document.querySelector(".auth-buttons");
  continueLoginBtn.focus();
  continueLoginBtn.click();

  setTimeout(() => {
    putPasswordValue(creds);
  }, 500);
}

function putPasswordValue(creds) {
  const passwordField = document.querySelector(
    "input[formcontrolname=password]"
  );

  if (!passwordField) {
    setTimeout(() => {
      putPasswordValue(creds);
    }, 1000);
  }

  const { password, iteration } = creds;

  passwordField.focus();
  passwordField.value = "";
  document.execCommand("insertText", false, password);
  passwordField.dispatchEvent(new Event("change", { bubbles: true }));

  const iterationField = document.querySelector(
    "input[formcontrolname=iteration]"
  );
  iterationField.focus();
  iterationField.value = "";
  document.execCommand("insertText", false, iteration);
  iterationField.dispatchEvent(new Event("change", { bubbles: true }));

  const continueLoginBtn = document.querySelector(".auth-buttons");
  continueLoginBtn.click();
}

/** MESSAGE LISTNER FOR URL CHANGE */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.data === "auth_url_found") {
    getCredentialsFromStorage();
    sendResponse({ data: "done" });
  }
});

/** LOGO CLICK TO RERENDER BUTTONS */
document.querySelector(".logo-row").addEventListener("click", function () {
  currentUrl = document.location.href.split("?")[0];
  getCredentialsFromStorage();
});
