import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubject } from '../models/bpiSubject';
import { BpiSubjectRole, BpiSubjectRoleName } from '../models/bpiSubjectRole';

@Injectable()
export class MockBpiSubjectStorageAgent {
  private bpiSubjectsStore: BpiSubject[] = [];

  async getBpiSubjectById(id: string): Promise<BpiSubject> {
    const bpiSubject = this.bpiSubjectsStore.find((bp) => bp.id === id);
    if (!bpiSubject) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return bpiSubject;
  }

  async getBpiSubjectsById(ids: string[]): Promise<BpiSubject[]> {
    const bpiSubjects: BpiSubject[] = [];
    ids.forEach((id) => {
      bpiSubjects.push(this.bpiSubjectsStore.find((bs) => bs.id === id));
    });
    if (!bpiSubjects.length) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return Promise.resolve(bpiSubjects);
  }

  async getBpiSubjectRoleByName(
    roleName: BpiSubjectRoleName,
  ): Promise<BpiSubjectRole> {
    return new BpiSubjectRole('123', roleName, '');
  }

  async getBpiSubjectByPublicKey(publicKey: string): Promise<BpiSubject> {
    const bpiSubject = this.bpiSubjectsStore.find(
      (bp) => bp.publicKey.toLowerCase() === publicKey,
    );
    if (!bpiSubject) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return bpiSubject;
  }

  async getAllBpiSubjects(): Promise<BpiSubject[]> {
    return Promise.resolve(this.bpiSubjectsStore);
  }

  async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    if (!bpiSubject.roles || !bpiSubject.roles.length) {
      const role = new BpiSubjectRole(
        '321',
        BpiSubjectRoleName.EXTERNAL_BPI_SUBJECT,
        'mock role',
      );
      bpiSubject.roles = [role];
    }
    const createdBp = new BpiSubject(
      v4(),
      bpiSubject.name,
      bpiSubject.description,
      bpiSubject.publicKey,
      bpiSubject.roles,
    );

    this.bpiSubjectsStore.push(createdBp);
    return Promise.resolve(createdBp);
  }

  async updateBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const bpToUpdate = this.bpiSubjectsStore.find(
      (bp) => bp.id === bpiSubject.id,
    );
    Object.assign(bpToUpdate, bpiSubject) as BpiSubject;
    return Promise.resolve(bpToUpdate);
  }

  async deleteBpiSubject(bpiSubject: BpiSubject): Promise<void> {
    const bpToDeleteIndex = this.bpiSubjectsStore.findIndex(
      (bp) => bp.id === bpiSubject.id,
    );
    this.bpiSubjectsStore.splice(bpToDeleteIndex, 1);
  }
}
