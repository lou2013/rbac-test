import { Observable } from 'rxjs';

export type ReturnType<T> = T | Promise<T> | Observable<T>;
