import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {

  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) { }

  async create(createTenantDto: CreateTenantDto) {
      const tenant = this.tenantsRepository.create(createTenantDto)
      await this.tenantsRepository.save(tenant)
      return tenant;
    }

  async findAll() {
      const allTenants = await this.tenantsRepository.find({
        relations: ['users', 'tasks']
      })
      return allTenants;
  }

  async findOne(id: string): Promise<Tenant> {
      const tenant = await this.tenantsRepository.findOne({
        where: { id },
        relations: ['users', 'tasks'],
      });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${id} not found`);
      }

      return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
      const tenant = await this.findOne(id);
      Object.assign(tenant, updateTenantDto);
      return this.tenantsRepository.save(tenant);
  }

  async remove(id: string) {
      const tenant = await this.findOne(id);
      await this.tenantsRepository.remove(tenant);
      return { message: `Tenant with the id: ${id} was successfully removed` };
  }
}
