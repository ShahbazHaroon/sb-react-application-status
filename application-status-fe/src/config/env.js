const raw = import.meta.env;

const required = (key) => {
  const value = raw[key];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing environment variable "${key}". Check your .env.<mode> file.`
    );
  }
  return value;
};

const optional = (key, defaultValue = '') => {
  const value = raw[key];

  return value === undefined || value === ''
    ? defaultValue
    : value;
};

const toNumber = (key) => {
  const value = Number(required(key));
  if (Number.isNaN(value)) {
    throw new Error(`Environment variable "${key}" must be a number.`);
  }
  return value;
};

const env = Object.freeze({
  appEnv: required('VITE_APP_ENV'),
  appTitle: required('VITE_APP_TITLE'),
  api: Object.freeze({
    //baseUrl: required('VITE_API_BASE_URL'),
    //baseUrl: raw.VITE_API_BASE_URL ?? '',
    /*
     * Local:
     *   http://localhost:8080
     *
     * Docker + Nginx:
     *   ""
     *
     * Empty means same-origin.
     */
    baseUrl: optional('VITE_API_BASE_URL'),
    contextPath: required('VITE_API_CONTEXT_PATH'),
    statusEndpoint: required('VITE_API_STATUS_ENDPOINT'),
    timeoutMs: toNumber('VITE_API_TIMEOUT_MS'),
  }),
  statusPollIntervalMs: toNumber('VITE_STATUS_POLL_INTERVAL_MS'),
});

export default env;
