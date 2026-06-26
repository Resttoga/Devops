import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Persona } from './interface';

describe('AppService', () => {
  let service: AppService;

  const mockPersona: Persona = {
    rut: '12345678-9',
    nombre: 'Juan Cruz',
    nacimiento: new Date('1990-01-01'),
    ciudad: 'Santiago',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('deberia estar definido el servicio', () => {
    expect(service).toBeDefined();
  });


  describe('getPersons', () => {
    it('debería retornar un arreglo vacío inicialmente ', () => {
      expect(service.getPersons()).toEqual([]);
    });

    it('deberia retornar las personas almacenadas', () => {
      service.addPerson(mockPersona);
      expect(service.getPersons()).toHaveLength(1);
      expect(service.getPersons()[0]).toEqual(mockPersona);
    });
  });


  describe('addPerson', () => {
    it('deberia agregar una persona al arreglo en memoria', () => {
      service.addPerson(mockPersona);
      
      const personas = service.getPersons();
      expect(personas).toContainEqual(mockPersona);
      expect(personas.length).toBe(1);
    });
  });


  describe('deletePerson', () => {
    it('deberia eliminar una persona existente por su RUT', () => {
      service.addPerson(mockPersona);
      
      const resultado = service.deletePerson('12345678-9');
      
      expect(resultado).toBe('Persona 12345678-9 eliminada');
      expect(service.getPersons()).toHaveLength(0);
    });

    it('deberia retornar "Persona no encontrada" si el RUT no existe', () => {
      const resultado = service.deletePerson('99999999-9');
      
      expect(resultado).toBe('Persona no encontrada');
    });
  });
});