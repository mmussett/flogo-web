export interface ContributionsService {
  find(terms?: object, options?: object): Promise<any[]>;
  findByRef(ref: string): Promise<any>;
}
