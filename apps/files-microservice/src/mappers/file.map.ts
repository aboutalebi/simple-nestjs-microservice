import { UniqueEntityID } from '@payever-microservices/core/domain/unique-entity-id';
import { Mapper } from '@payever-microservices/core/infra/mapper';
import { FileDomain } from '../domain';

export class FileMap extends Mapper<FileDomain> {
  public static toPersistence(file: FileDomain): any {
    return {
      id: file.id.toString(),
      userId: file.userId,
      name: file.name,
      type: file.type,
    };
  }

  public static toDomain(raw: any): FileDomain {
    const fileDomainOrError = FileDomain.create(
      {
        userId: raw.userId,
        name: raw.name,
        type: raw.type,
      },
      new UniqueEntityID(raw.base_user_id),
    );

    fileDomainOrError.isFailure ? console.log(fileDomainOrError.error) : '';

    return fileDomainOrError.isSuccess ? fileDomainOrError.getValue() : null;
  }
}
