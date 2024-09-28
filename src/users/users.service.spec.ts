import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto, UpdateUserDto, AssignRoleDto } from './dto';
import { User } from './entities/user.entity';
import { Tenant } from '../tenants/entities/tenant.entity';

jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;
  let tenantRepository: jest.Mocked<Repository<Tenant>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    tenantRepository = module.get(getRepositoryToken(Tenant));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'User',
        tenantId: '1',
      };

      const tenant: Tenant = {
        id: '1',
        name: 'Test Tenant',
        address: '123 Test St',
        createdAt: new Date(),
        users: [],
        tasks: []
      };

      const createdUser: User = {
        id: '1',
        ...createUserDto,
        tenant,
        createdAt: new Date(),
        password: 'hashed_password',
      };

      tenantRepository.findOneBy.mockResolvedValue(tenant);
      userRepository.create.mockReturnValue(createdUser as User);
      userRepository.save.mockResolvedValue(createdUser);
      jwtService.sign.mockReturnValue('mocked_token');

      const result = await service.create(createUserDto);

      expect(result).toEqual({ ...createdUser, token: 'mocked_token' });
    });

    it('should throw NotFoundException if tenant not found', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        role: 'User',
        tenantId: 'non_existent',
      };

      tenantRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('login', () => {
    it('should return user with token on successful login', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password12345',
      };
      const user: Partial<User> = {
        id: '1',
        email: loginUserDto.email,
        password: '$2a$10$fcyKyfCO0A4Se9MkU0937.5Sh.SOjlr2FbQDODt3qXvdfmxpecrKG',
        name: 'Test User',
        role: 'User',
        tenant: { id: '1', name: 'Test Tenant' } as Tenant,
        createdAt: new Date()
      };

      userRepository.findOne.mockResolvedValue(user as User);
      jwtService.sign.mockReturnValue('mocked_token');

      const result = await service.login(loginUserDto);

      expect(result).toEqual({ ...user, token: 'mocked_token' });
    });

    it('should throw UnauthorizedException on failed login', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };
      const user: Partial<User> = {
        id: '1',
        email: loginUserDto.email,
        password: 'hashed_password',
        name: 'Test User',
        role: 'User',
        tenant: { id: '1', name: 'Test Tenant' } as Tenant,
        createdAt: new Date()
      };

      userRepository.findOne.mockResolvedValue(user as User);

      await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: Partial<User>[] = [
        { id: '1', email: 'user1@example.com', name: 'User 1', role: 'USER', tenant: { id: '1' } as Tenant, createdAt: new Date() },
        { id: '2', email: 'user2@example.com', name: 'User 2', role: 'USER', tenant: { id: '1' } as Tenant, createdAt: new Date() }
      ];
      userRepository.find.mockResolvedValue(users as User[]);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user: Partial<User> = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'User',
        tenant: {
          id: '1',
          name: 'Test Tenant'
        } as Tenant,
        createdAt: new Date()
      };
      userRepository.findOne.mockResolvedValue(user as User);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name', email: 'updated@example.com', tenantId: '1' };
      const updatedUser: Partial<User> = {
        id: '1',
        ...updateUserDto,
        role: 'User',
        tenant: { id: '1', name: 'Test Tenant' } as Tenant,
        createdAt: new Date()
      };

      userRepository.preload.mockResolvedValue(updatedUser as User);
      userRepository.save.mockResolvedValue(updatedUser as User);

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.preload.mockResolvedValue(null);

      await expect(service.update('nonexistent', { 
        name: 'Test',
        email: 'test@example.com', 
        tenantId: '1' 
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      userRepository.delete.mockResolvedValue({ affected: 1, raw: [] });

      const result = await service.remove('1');

      expect(result).toEqual({ message: 'User with the id: 1 was successfully removed' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.delete.mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignRole', () => {
    it('should assign a role to a user', async () => {
      const assignRoleDto: AssignRoleDto = { role: 'Admin' };
      const updatedUser: Partial<User> = {
        id: '1',
        role: 'ADMIN',
        name: 'Test User',
        email: 'test@example.com',
        tenant: { id: '1', name: 'Test Tenant' } as Tenant,
        createdAt: new Date()
      };

      userRepository.preload.mockResolvedValue(updatedUser as User);
      userRepository.save.mockResolvedValue(updatedUser as User);

      const result = await service.assignRole('1', assignRoleDto);

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.preload.mockResolvedValue(null);

      await expect(service.assignRole('nonexistent', { role: 'Admin' })).rejects.toThrow(NotFoundException);
    });
  });
});