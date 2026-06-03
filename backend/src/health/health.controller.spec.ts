import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('responde con estado ok y el nombre del servicio', () => {
    const result = controller.check();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('ruedly-backend');
    expect(typeof result.timestamp).toBe('string');
  });
});
