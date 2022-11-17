const saveBtn = document.querySelector("#save_btn");
const auth_url = document.querySelector("#auth_url");
const super_admin_email = document.querySelector("#super_admin_email");
const super_admin_password = document.querySelector("#super_admin_password");
const super_admin_iteration = document.querySelector("#super_admin_iteration");

const admin_email = document.querySelector("#admin_email");
const admin_password = document.querySelector("#admin_password");
const admin_iteration = document.querySelector("#admin_iteration");

const user_email = document.querySelector("#user_email");
const user_password = document.querySelector("#user_password");
const user_iteration = document.querySelector("#user_iteration");

getCredentialsFromStorage();

saveBtn.addEventListener("click", saveCredentials);

function saveCredentials() {
  const data = {
    auth_url: auth_url.value || "https://ztn.revbits.net:4200/auth/login",
    super_admin_email: super_admin_email.value || "superadmin@ztn.com",
    super_admin_password: super_admin_password.value || "Pa$$W0rd@360",
    super_admin_iteration: super_admin_iteration.value || "1000",
    admin_email: admin_email.value || "admin@ztn.com",
    admin_password: admin_password.value || "Pa$$W0rd@360",
    admin_iteration: admin_iteration.value || "1000",
    user_email: user_email.value || "admin@ztn.com",
    user_password: user_password.value || "Pa$$W0rd@360",
    user_iteration: user_iteration.value || "1000",
  };

  chrome.storage.sync.set({ credentials: JSON.stringify(data) }, () => {});
  toastr.success("Credenials saved successfull");

  setTimeout(() => {
    window.close();
  }, 1000);
}

function getCredentialsFromStorage() {
  chrome.storage.sync.get(["credentials"], (result) => {
    let credentials = {};
    if (result.credentials) {
      credentials = JSON.parse(result.credentials) || {};
    }

    auth_url.value =
      credentials?.auth_url || "https://ztn.revbits.net:4200/auth/login";
    super_admin_email.value =
      credentials?.super_admin_email || "superadmin@ztn.com";
    super_admin_password.value =
      credentials?.super_admin_password || "Pa$$W0rd@360";
    super_admin_iteration.value = credentials?.super_admin_iteration || "1000";
    admin_email.value = credentials?.admin_email || "admin@ztn.com";
    admin_password.value = credentials?.admin_password || "Pa$$W0rd@360";
    admin_iteration.value = credentials?.admin_iteration || "1000";
    user_email.value = credentials?.user_email || "admin@ztn.com";
    user_password.value = credentials?.user_password || "Pa$$W0rd@360";
    user_iteration.value = credentials?.user_iteration || "1000";
  });
}
