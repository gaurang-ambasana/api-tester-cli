import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import setupEditor from "./setupEditor";

const { requestEditor, updateResponseEditor } = setupEditor();

const form = document.querySelector("[data-form]");
const keyValueTemplate = document.querySelector("[data-key-value-template]");
const queryParamsContainer = document.querySelector("[data-query-params]");
const requestHeadersContainer = document.querySelector(
  "[data-request-headers]"
);
const responseHeadersConatainer = document.querySelector(
  "[data-response-headers]"
);

const updateEndTime = (res) => {
  res.customData = res.customData || {};
  res.customData.time = new Date().getTime() - res.config.customData.startTime;

  return res;
};

axios.interceptors.request.use((req) => {
  req.customData = req.customData || {};
  req.customData.startTime = new Date().getTime();

  return req;
});

axios.interceptors.response.use(updateEndTime, (e) =>
  Promise.reject(updateEndTime(e.response))
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

const updateResponseHeaders = (headers) => {
  responseHeadersConatainer.innerHTML = "";

  Object.entries(headers).forEach((entry) => {
    const [key, value] = entry;

    const keyEle = document.createElement("div");
    const valueEle = document.createElement("div");

    keyEle.textContent = key;
    valueEle.textContent = value;

    responseHeadersConatainer.append(keyEle);
    responseHeadersConatainer.append(valueEle);
  });
};

const updateResponseDetails = (status, time, size) => {
  document.querySelector("[data-status]").textContent = status;
  document.querySelector("[data-time]").textContent = time;
  document.querySelector("[data-size]").textContent = size;
};

const makeRequest = (event) => {
  event.preventDefault();

  const url = document.querySelector("[data-url]").value;
  const method = document.querySelector("[data-method]").value;
  const params = getObjectFromKeyValuePair(queryParamsContainer);
  const headers = getObjectFromKeyValuePair(requestHeadersContainer);

  let data;

  try {
    data = JSON.parse(requestEditor.state.doc.toString() || null);
  } catch (error) {
    console.log(error.stack);
    alert("Malformed JSON detected!");
    return;
  }

  axios({ url, method, params, headers, data })
    .catch((e) => e)
    .then((response) => {
      const { data, headers: responseHeaders, status, customData } = response;
      const responseSize = prettyBytes(
        JSON.stringify(data).length + JSON.stringify(responseHeaders).length
      );

      document
        .querySelector("[data-response-section]")
        .classList.remove("d-none");

      updateResponseDetails(status, customData.time, responseSize);
      updateResponseEditor(data);
      updateResponseHeaders(responseHeaders);
    });
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
