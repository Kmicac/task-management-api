import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, role, tenantId } = createUserDto;

    try {
      // Find the tenant by ID and create the new user linked to the company
      const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
      if (!tenant) {
        throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
      }
  
      const user = this.userRepository.create({
        name,
        email,
        password, 
        role,
        tenant,  
      });
  
      await this.userRepository.save(user);
      return user;
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Something went wrong went creating the user, please check logs.!!')
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
