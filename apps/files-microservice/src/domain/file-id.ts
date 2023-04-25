import { Entity } from '@payever-microservices/core/domain/entity';
import { UniqueEntityID } from '@payever-microservices/core/domain/unique-entity-id';

export class FileId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }
}
