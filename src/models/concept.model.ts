export interface CreateConceptDto {
  company_id: number;
  name: string;
}

export interface UpdateConceptDto {
  company_id: number;
  name: string;
}

export interface Concept {
  concept_id: number;
  company_id: number;
  name: string;
}

export interface GetConceptsQueryDto {
  company_id?: number;
}