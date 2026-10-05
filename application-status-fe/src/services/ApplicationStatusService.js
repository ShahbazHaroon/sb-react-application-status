import env from '../config/env';

/**
 * Talks to the Spring Boot ApplicationStatusController.
 *
 * Local:
 *   http://localhost:8080/app/api/v1/status
 *
 * Docker + Nginx:
 *   /app/api/v1/status
 */
class ApplicationStatusService {
  constructor(config = env.api) {
    this.config = config;
  }

  get statusUrl() {
    const { baseUrl, contextPath, statusEndpoint } = this.config;
    //return `${baseUrl}${contextPath}${statusEndpoint}`;
    
  //   return `${baseUrl.replace(/\/+$/, '')}/${[
  //   contextPath,
  //   statusEndpoint,
  // ]
  //   .map((part) => part.replace(/^\/+|\/+$/g, ''))
  //   .filter(Boolean)
  //   .join('/')}`;

  // return [
  //   baseUrl,
  //   contextPath,
  //   statusEndpoint,
  // ]
  //   .filter(Boolean)
  //   .join('')
  //   .replace(/([^:]\/)\/+/g, '$1');

  const base = baseUrl.replace(/\/+$/, '');
    const context = contextPath.replace(/^\/+|\/+$/g, '');
    const endpoint = statusEndpoint.replace(/^\/+|\/+$/g, '');

    const path = `/${[context, endpoint]
      .filter(Boolean)
      .join('/')}`;

    return `${base}${path}`;

  }

  /**
   * @param {AbortSignal} [signal] optional signal to cancel the request
   * @returns {Promise<object>} ApplicationStatusResponse JSON from the backend
   */
  async getApplicationStatus(signal) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);
    signal?.addEventListener('abort', () => controller.abort(),{ once: true });

    try {
      const response = await fetch(this.statusUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server responded with HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${this.config.timeoutMs} ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export default new ApplicationStatusService();
