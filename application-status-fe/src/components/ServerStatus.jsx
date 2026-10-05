import { useCallback, useEffect, useState } from 'react';
import env from '../config/env';
import applicationStatusService from '../services/ApplicationStatusService';

export default function ServerStatus() {
  const [state, setState] = useState({ phase: 'loading', data: null, error: null, checkedAt: null });

  const check = useCallback(async () => {
    try {
      const data = await applicationStatusService.getApplicationStatus();
      setState({ phase: 'up', data, error: null, checkedAt: new Date() });
    } catch (error) {
      setState({ phase: 'down', data: null, error: error.message, checkedAt: new Date() });
    }
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, env.statusPollIntervalMs);
    return () => clearInterval(id);
  }, [check]);

  const { phase, data, error, checkedAt } = state;
  const label = { loading: 'Checking server…', up: 'Server is up', down: 'Server is unreachable' }[phase];

  return (
    <section className={`status status--${phase}`} aria-live="polite">
      <span className="status__dot" aria-hidden="true" />
      <h1 className="status__label">{label}</h1>

      {phase === 'up' && data && (
        <dl className="status__details">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}

      {phase === 'down' && <p className="status__error">{error}</p>}

      <p className="status__meta">
        {env.appEnv} · {applicationStatusService.statusUrl}
        {checkedAt && ` · checked ${checkedAt.toLocaleTimeString()}`}
      </p>
      <button className="status__button" onClick={check}>Check again</button>
    </section>
  );
}
