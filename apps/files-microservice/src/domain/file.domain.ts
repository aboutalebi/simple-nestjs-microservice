import { AggregateRoot } from '@payever-microservices/core/domain/aggregate-root';
import { UniqueEntityID } from '@payever-microservices/core/domain/unique-entity-id';
import { Result } from '@payever-microservices/core/logic/result';
import { Guard } from '@payever-microservices/core/logic/guard';
import { FileId } from './file-id';

interface FileProps {
  name: string;
  userId?: string;
  type?: string;
}

export class FileDomain extends AggregateRoot<FileProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get fileId(): FileId {
    return FileId.caller(this.id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): string {
    return this.props.type;
  }

  private constructor(props: FileProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: FileProps,
    id?: UniqueEntityID,
  ): Result<FileDomain> {
    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.type, argumentName: 'type' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<FileDomain>(guardResult.message);
    } else {
      const file = new FileDomain(
        {
          ...props,
        },
        id,
      );

      return Result.ok<FileDomain>(file);
    }
  }
}
