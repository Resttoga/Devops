import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { PersonaEntity } from './persona.entity';
import { NotFoundException } from '@nestjs/common';

describe('AppService', () => {
  let service: AppService;
  let repository: Repository<PersonaEntity>;

  const mockPersona: PersonaEntity = {
    rut: '12345678-9',
    nombre: 'Juan Cruz',
    nacimiento: new Date('1990-01-01'),
    ciudad: 'Santiago',
    gustos: ['leer', 'viajar'],
  };

  const mockPersonaRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(PersonaEntity),
          useValue: mockPersonaRepository,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    repository = module.get<Repository<PersonaEntity>>(getRepositoryToken(PersonaEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deberia estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  describe('getPersons', () => {
    it('debería retornar un arreglo vacío inicialmente', async () => {
      mockPersonaRepository.find.mockResolvedValue([]);

      const resultado = await service.getPersons();
      
      expect(resultado).toEqual([]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('deberia retornar las personas almacenadas en la base de datos', async () => {
      mockPersonaRepository.find.mockResolvedValue([mockPersona]);

      const resultado = await service.getPersons();

      expect(resultado).toHaveLength(1);
      expect(resultado[0]).toEqual(mockPersona);
    });
  });

  describe('addPerson', () => {
    it('deberia agregar una persona llamando a los metodos de TypeORM', async () => {
      mockPersonaRepository.create.mockReturnValue(mockPersona);
      mockPersonaRepository.save.mockResolvedValue(mockPersona);

      const resultado = await service.addPerson(mockPersona);

      expect(resultado).toEqual(mockPersona);
      expect(repository.create).toHaveBeenCalledWith(mockPersona);
      expect(repository.save).toHaveBeenCalledWith(mockPersona);
    });
  });

  describe('deletePerson', () => {
    it('deberia eliminar una persona existente por su RUT', async () => {
      mockPersonaRepository.delete.mockResolvedValue({ affected: 1 });

      const resultado = await service.deletePerson('12345678-9');

      expect(resultado).toBe('Persona 12345678-9 eliminada');
      expect(repository.delete).toHaveBeenCalledWith({ rut: '12345678-9' });
    });

    it('deberia lanzar un NotFoundException si el RUT no existe en la base de datos', async () => {
      mockPersonaRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deletePerson('99999999-9')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});