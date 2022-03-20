import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const form = document.querySelector("[data-form]");
const keyValueTemplate = document.querySelector("[data-key-value-template]");
const queryParamsContainer = document.querySelector("[data-query-params]");
const requestHeadersContainer = document.querySelector(
  "[data-request-headers]"
);

const getObjectFromKeyValuePair = (container) =>
  [...container.querySelectorAll("[data-key-value-pair]")].reduce(
    (data, pair) => {
      const key = pair.querySelector("[data-key]").value;
      const value = pair.querySelector("[data-value]").value;

      if (key === "") return data;

      return {
        ...data,
        [key]: value,
      };
    },
    {}
  );

const makeRequest = (event) => {
  event.preventDefault();

  const url = document.querySelector("[data-url]").value;
  const method = document.querySelector("[data-method]").value;
  const params = getObjectFromKeyValuePair(queryParamsContainer);
  const headers = getObjectFromKeyValuePair(requestHeadersContainer);

  axios({ url, method, params, headers }).then((res) => console.log(res));
};

form.addEventListener("submit", makeRequest);

const createKeyValuePair = () => {
  const elem = keyValueTemplate.content.cloneNode(true);
  elem
    .querySelector("[data-remove-btn]")
    .addEventListener("click", (event) =>
      event.target.closest("[data-key-value-pair]").remove()
    );

  return elem;
};

queryParamsContainer.appendChild(createKeyValuePair());
requestHeadersContainer.appendChild(createKeyValuePair());

document
  .querySelector("[data-add-query-param-btn]")
  .addEventListener("click", () =>
    queryParamsContainer.appendChild(createKeyValuePair())
  );

document
  .querySelector("[data-add-request-header-btn]")
  .addEventListener("click", () =>
    requestHeadersContainer.appendChild(createKeyValuePair())
  );
