import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { Factor, Metadata } from './metadata.types';

const optionValues = (factor?: Factor): (string | number)[] =>
  (factor?.options ?? []).map((o) => o.value);

describe('MetadataService', () => {
  let service: MetadataService;

  beforeEach(() => {
    service = new MetadataService();
  });

  it('está definido', () => {
    expect(service).toBeDefined();
  });

  it('incluye todos los factores del formulario de recomendación', () => {
    const meta = service.getMetadata();
    const keys = meta.factors.map((f) => f.key);
    [
      'disciplina',
      'pesoKg',
      'edad',
      'experiencia',
      'estilo',
      'suelo',
      'temperatura',
      'priority',
      'modoDureza',
      'wheelSize',
      'setConfigMode',
    ].forEach((key) => expect(keys).toContain(key));
  });

  it('expone los valores admitidos del inventario (§3.8)', () => {
    const meta = service.getMetadata();
    const byKey = (k: string): Factor | undefined =>
      meta.factors.find((f) => f.key === k);

    expect(optionValues(byKey('disciplina'))).toEqual([
      'velocidad',
      'fondo',
      'skate cross',
      'derrapes',
      'free style (calle)',
    ]);
    expect(optionValues(byKey('experiencia'))).toHaveLength(5);
    expect(optionValues(byKey('estilo'))).toHaveLength(5);
    expect(optionValues(byKey('suelo'))).toEqual([
      'pista',
      'asfalto liso',
      'asfalto rugoso',
      'indoor',
      'calle',
    ]);
    expect(optionValues(byKey('temperatura'))).toEqual([
      'sin especificar',
      'frio',
      'templado',
      'caluroso',
    ]);
    expect(optionValues(byKey('priority'))).toHaveLength(3);
    expect(optionValues(byKey('modoDureza'))).toHaveLength(2);
    expect(optionValues(byKey('wheelSize'))).toEqual([
      80, 84, 90, 100, 110, 125,
    ]);
    expect(optionValues(byKey('wheelHardness'))).toHaveLength(12);
  });

  it('setConfigMode tiene 4 opciones con descripción, ventajas y desventajas', () => {
    const meta = service.getMetadata();
    const setConfig = meta.factors.find((f) => f.key === 'setConfigMode');
    expect(setConfig?.options).toHaveLength(4);
    setConfig?.options?.forEach((opt) => {
      expect(opt.description).toBeTruthy();
      expect(opt.advantages?.length).toBeGreaterThan(0);
      expect(opt.disadvantages?.length).toBeGreaterThan(0);
    });
  });

  it('expone los pesos del scoring y el total de ruedas del posicionamiento', () => {
    const meta: Metadata = service.getMetadata();
    expect(meta.scoreWeights.disciplina).toBe(10);
    expect(meta.scoreWeights.temperatura).toBe(3);
    expect(meta.positioning.totalWheels).toBe(8);
    expect(meta.version).toBeTruthy();
  });

  it('filtra factores por flujo (posicionamiento excluye edad/dureza/tamaño/set)', () => {
    const posKeys = service.getFactorsForFlow('positioning').map((f) => f.key);
    expect(posKeys).toContain('disciplina');
    expect(posKeys).toContain('wheelHardness');
    expect(posKeys).not.toContain('edad');
    expect(posKeys).not.toContain('modoDureza');
    expect(posKeys).not.toContain('wheelSize');
    expect(posKeys).not.toContain('setConfigMode');
  });
});

describe('MetadataController', () => {
  let controller: MetadataController;

  beforeEach(() => {
    controller = new MetadataController(new MetadataService());
  });

  it('devuelve el catálogo completo sin filtro', () => {
    const result = controller.getMetadata();
    expect('scoreWeights' in result).toBe(true);
    expect(result.factors.length).toBeGreaterThan(0);
  });

  it('filtra por flujo de recomendación', () => {
    const result = controller.getMetadata('recommendation');
    const keys = result.factors.map((f) => f.key);
    expect(keys).toContain('setConfigMode');
    expect(keys).not.toContain('wheelHardness');
  });
});
