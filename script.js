import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const keyValueTemplate = document.querySelector("[data-key-value-template]");
const queryParamsContainer = document.querySelector("[data-query-params]");
const requestHeadersContainer = document.querySelector(
  "[data-request-headers]"
);

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
