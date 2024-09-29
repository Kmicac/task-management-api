import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Auth } from '../users/decorators/auth.decorator';
import { Role } from '../users/interfaces/role.enum';

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiBody({ type: CreateTenantDto })
  @ApiResponse({ status: 201, description: 'Tenant has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Retrieve all tenants' })
  @ApiResponse({ status: 200, description: 'List of all tenants.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' }) 
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Retrieve a tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant found.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' }) 
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Update a tenant by ID' })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' }) 
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Delete a tenant by ID (To make this request you must be an administrator)' })
  @ApiResponse({ status: 200, description: 'Tenant successfully removed.' })
  @ApiResponse({ status: 404, description: 'Tenant not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' }) 
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantsService.remove(id);
  }
}
