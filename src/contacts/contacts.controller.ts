import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContactDto, UpdateContactDto } from './dto';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll(@Req() req) {
    return this.contactsService.getContacts(req.user.id);
  }

  @Post()
  async create(@Req() req, @Body() dto: CreateContactDto) {
    return this.contactsService.createContact(req.user.id, dto);
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() dto: UpdateContactDto) {
    return this.contactsService.updateContact(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    return this.contactsService.deleteContact(req.user.id, id);
  }
}
