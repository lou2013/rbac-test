export class BaseEntity {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: Partial<BaseEntity>) {
    Object.assign(this, data);
  }
}
