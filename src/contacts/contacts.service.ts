import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { User } from '../users/user.entity';
import { CreateContactDto, UpdateContactDto } from './dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private contactRepo: Repository<Contact>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createContact(userId: number, dto: CreateContactDto) {
    const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: { contacts: true },
      });
    if (!user) throw new Error('Usuário não encontrado');

    if (user.contacts.length >= 50) {
      throw new Error('Limite de 50 contacts atingido');
    }

    const contact = this.contactRepo.create({ ...dto, user });
    return this.contactRepo.save(contact);
  }

  async getContacts(userId: number) {
    return this.contactRepo.find({ where: { user: { id: userId } } });
  }

  async updateContact(userId: number, contactId: number, dto: UpdateContactDto) {
    const contact = await this.contactRepo.findOne({ where: { id: contactId, user: { id: userId } } });
    if (!contact) throw new Error('Contato não encontrado');
    Object.assign(contact, dto);
    return this.contactRepo.save(contact);
  }

  async deleteContact(userId: number, contactId: number) {
    const contact = await this.contactRepo.findOne({ where: { id: contactId, user: { id: userId } } });
    if (!contact) throw new Error('Contato não encontrado');
    return this.contactRepo.remove(contact);
  }
}
