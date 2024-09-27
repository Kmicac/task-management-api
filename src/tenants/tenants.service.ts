import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {

  private readonly logger = new Logger('TenantsService');

  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) { }

  async create(createTenantDto: CreateTenantDto) {
    try {
      const tenant = this.tenantsRepository.create(createTenantDto)
      await this.tenantsRepository.save(tenant)
      return tenant;

    } catch (error) {
      if (error.code === '23505')
        this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  async findAll() {
    try {
      const allTenants = await this.tenantsRepository.find({
        relations: ['users', 'tasks']
      })
      return allTenants;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error creating tenant, please check logs');
    }
  }

  async findOne(id: string): Promise<Tenant> {
    try {
      const tenant = await this.tenantsRepository.findOne({
        where: { id },
        relations: ['users', 'tasks'],
      });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${id} not found`);
      }

      return tenant;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error creating tenant, please check logs');
    }
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    try {
      const tenant = await this.findOne(id);
      Object.assign(tenant, updateTenantDto);
      return this.tenantsRepository.save(tenant);

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error creating tenant, please check logs');
    }
  }

  async remove(id: string) {
    try {
      const tenant = await this.findOne(id);
      await this.tenantsRepository.remove(tenant);
      return { message: `Tenant with the id: ${id} was successfully removed` };

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error creating tenant, please check logs');
    }
  }
}
