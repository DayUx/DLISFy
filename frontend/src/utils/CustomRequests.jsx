import { notification } from "antd";
import { history } from "./_helper.jsx";

const customRequest = (
  url,
  method,
  body,
  success = function () {},
  failure = function () {},
  failureMessage,
  successMessage,
  showFailureNotification = true
) => {
  const init = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-Token": localStorage.getItem("access_token"),
    },
  };
  if (method === "POST" || method === "PUT") {
    init.body = JSON.stringify(body);
  }

  fetch(url, init).then((res) => {
    res.json().then((data) => {
      if (res.ok) {
        if (verifyCode(data.status_code, data, showFailureNotification)) {
          success(data);
          if (successMessage) {
            notification.success({
              message: "Succès",
              description: successMessage,
            });
          }
        } else {
          failure(data);
        }
      } else {
        verifyCode(res.status, data, showFailureNotification);
        failure(data);
      }
    });
  });
};

const verifyCode = (code, data, showNotification) => {
  if (code === 401) {
    localStorage.removeItem("access_token");
    if (showNotification) {
      notification.error({
        message: "Erreur",
        description: "Votre session a expiré!",
      });
    }

    history.navigate("/login");
    return false;
  }
  if (code === 403) {
    localStorage.removeItem("access_token");
    if (showNotification) {
      notification.error({
        message: "Erreur",
        description: "Vous n'avez pas les droits nécessaires!",
      });
    }
    history.navigate("/");
    return false;
  }
  if (code >= 400) {
    if (showNotification) {
      notification.error({
        message: "Erreur",
        description: data.detail,
      });
    }
    return false;
  }
  return true;
};

export const post = (
  url,
  parameters = {
    body: {},
    success: function () {},
    failure: function () {},
    failureMessage: null,
    successMessage: null,
    showFailureNotification: true,
  }
) => {
  customRequest(
    url,
    "POST",
    parameters.body,
    parameters.success,
    parameters.failure,
    parameters.failureMessage,
    parameters.successMessage,
    parameters.showFailureNotification
  );
};

export const put = (
  url,
  parameters = {
    body: {},
    success: function () {},
    failure: function () {},
    failureMessage: null,
    successMessage: null,
    showFailureNotification: true,
  }
) => {
  customRequest(
    url,
    "PUT",
    parameters.body,
    parameters.success,
    parameters.failure,
    parameters.failureMessage,
    parameters.successMessage,
    parameters.showFailureNotification
  );
};

export const get = (
  url,
  parameters = {
    success: function () {},
    failure: function () {},
    failureMessage: null,
    successMessage: null,
    showFailureNotification: true,
  }
) => {
  customRequest(
    url,
    "GET",
    {},
    parameters.success,
    parameters.failure,
    parameters.failureMessage,
    parameters.successMessage,
    parameters.showFailureNotification
  );
};
