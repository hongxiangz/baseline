import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '..//api/err.messages';
import { Transaction } from '../models/transaction';

@Injectable()
export class TransactionStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactionModels = await this.transaction.findMany({
      include: { fromBpiSubjectAccount: true, toBpiSubjectAccount: true },
    });
    return transactionModels.map((transactionModel) => {
      return this.mapper.map(transactionModel, Transaction, Transaction);
    });
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transactionModel = await this.transaction.findUnique({
      where: { id },
      include: {
        fromBpiSubjectAccount: {
          include: {
            ownerBpiSubject: true,
            creatorBpiSubject: true,
          },
        },
        toBpiSubjectAccount: {
          include: {
            ownerBpiSubject: true,
            creatorBpiSubject: true,
          },
        },
      },
    });

    if (!transactionModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(transactionModel, Transaction, Transaction);
  }

  async createNewTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransactionModel = await this.transaction.create({
      data: {
        id: transaction.id,
        nonce: transaction.nonce,
        workflowInstanceId: transaction.workflowInstanceId,
        workstepInstanceId: transaction.workstepInstanceId,
        fromBpiSubjectAccountId: transaction.fromBpiSubjectAccountId,
        toBpiSubjectAccountId: transaction.toBpiSubjectAccountId,
        payload: transaction.payload,
        signature: transaction.signature,
        status: transaction.status,
      },
      include: {
        fromBpiSubjectAccount: {
          include: {
            ownerBpiSubject: true,
            creatorBpiSubject: true,
          },
        },
        toBpiSubjectAccount: {
          include: {
            ownerBpiSubject: true,
            creatorBpiSubject: true,
          },
        },
      },
    });

    return this.mapper.map(newTransactionModel, Transaction, Transaction);
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    const updatedTransactionModel = await this.transaction.update({
      where: { id: transaction.id },
      data: {
        payload: transaction.payload,
        signature: transaction.signature,
      },
    });

    return this.mapper.map(updatedTransactionModel, Transaction, Transaction);
  }

  async deleteTransaction(transaction: Transaction): Promise<void> {
    await this.transaction.delete({
      where: { id: transaction.id },
    });
  }
}
