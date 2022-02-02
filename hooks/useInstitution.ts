import { ApiError } from "../lib/api.error";
import { InstitutionData } from "../lib/nordigen";
import useSWRImmutable from 'swr/immutable';


export const useInstitution = (id?: string) => {
  const { data, error } = useSWRImmutable<InstitutionData, ApiError>(id ? `api/institutions/${id}` : undefined);

  return {
    institution: data,
    isLoading: !error && !data,
    error,
  }
}