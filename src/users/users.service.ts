import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto, AssignRoleDto } from './dto/index';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

    private readonly jwtService: JwtService,

  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, tenantId, ...userData } = createUserDto;

    // Find the tenant by ID and create the new user linked to the company
    const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    try {
      const user = this.userRepository.create({
        ...userData,
        tenant,
        password: bcrypt.hashSync(password, 10)

      });

      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      if (error.code === '23505')
        console.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if (!user)
      throw new UnauthorizedException(`Credentials are not valid`);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credentials are not valid`);

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }


  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tenant']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    })
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong, check logs..!');
    }
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with the id: ${id} was successfully removed` }
  }

  async assignRole(id: string, assignRoleDto: AssignRoleDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...assignRoleDto
    });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong, check logs..!');
    }
  }

  // Generates a JWT token for the given payload
  private getJwtToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);
    return token;
  }

}
