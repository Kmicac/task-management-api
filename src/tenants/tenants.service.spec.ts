import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from './tenants.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

describe('TenantsService', () => {
  let service: TenantsService;
  let repository: jest.Mocked<Repository<Tenant>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
    repository = module.get(getRepositoryToken(Tenant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tenant successfully', async () => {
      const createTenantDto: CreateTenantDto = { name: 'Test Tenant', address: 'Test Address' };
      const tenant = { id: '1', ...createTenantDto };
      
      repository.create.mockReturnValue(tenant as Tenant);
      repository.save.mockResolvedValue(tenant as Tenant);

      const result = await service.create(createTenantDto);
      expect(result).toEqual(tenant);
    });
  });

  describe('findAll', () => {
    it('should return an array of tenants', async () => {
      const tenants = [{ id: '1', name: 'Tenant 1' }, { id: '2', name: 'Tenant 2' }];
      repository.find.mockResolvedValue(tenants as Tenant[]);

      const result = await service.findAll();
      expect(result).toEqual(tenants);
    });
  });

  describe('findOne', () => {
    it('should return a tenant by id', async () => {
      const tenant = { id: '1', name: 'Test Tenant' };
      repository.findOne.mockResolvedValue(tenant as Tenant);

      const result = await service.findOne('1');
      expect(result).toEqual(tenant);
    });

    it('should throw NotFoundException if tenant not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tenant successfully', async () => {
      const updateTenantDto: UpdateTenantDto = { name: 'Updated Tenant' };
      const existingTenant = { id: '1', name: 'Test Tenant', address: 'Test Address' };
      const updatedTenant = { ...existingTenant, ...updateTenantDto };

      repository.findOne.mockResolvedValue(existingTenant as Tenant);
      repository.save.mockResolvedValue(updatedTenant as Tenant);

      const result = await service.update('1', updateTenantDto);
      expect(result).toEqual(updatedTenant);
    });

    it('should throw NotFoundException if tenant not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Updated Tenant' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a tenant successfully', async () => {
      const tenant = { id: '1', name: 'Test Tenant' };
      repository.findOne.mockResolvedValue(tenant as Tenant);
      repository.remove.mockResolvedValue(tenant as Tenant);

      const result = await service.remove('1');
      expect(result).toEqual({ message: 'Tenant with the id: 1 was successfully removed' });
    });

    it('should throw NotFoundException if tenant not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});