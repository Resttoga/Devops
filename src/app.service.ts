import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonaEntity } from './persona.entity';
import { CreatePersonaDto } from './person-dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(PersonaEntity)
    private readonly personaRepository: Repository<PersonaEntity>,
  ) {}

  async getPersons(): Promise<PersonaEntity[]> {
    return await this.personaRepository.find();
  }

  async addPerson(createPersonaDto: CreatePersonaDto): Promise<PersonaEntity> {
    const nuevaPersona = this.personaRepository.create({
      rut: createPersonaDto.rut,
      nombre: createPersonaDto.nombre,
      nacimiento: new Date(createPersonaDto.nacimiento),
      ciudad: createPersonaDto.ciudad,
      gustos: createPersonaDto.gustos || [],
    });

    return await this.personaRepository.save(nuevaPersona);
  }

  async deletePerson(rut: string): Promise<string> {
    const resultado = await this.personaRepository.delete({ rut });
    
    if (resultado.affected === 0) {
      throw new NotFoundException(`Persona con RUT ${rut} no encontrada`);
    }
    
    return `Persona ${rut} eliminada`;
  }
}