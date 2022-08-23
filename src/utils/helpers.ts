import { compare, hash } from 'bcrypt';

export const hashText = async (text: string): Promise<string> => {
  return hash(text, 12);
};
export const compareTexts = async (
  s: string,
  hash: string,
): Promise<boolean> => {
  return compare(s, hash);
};

export const getPaginationData = <T>({
  paginationDetails,
  result,
}: {
  paginationDetails: {
    page: number;
    take: number;
  };
  result: {
    count?: number;
    data: T[];
  };
}) => {
  const { page, take } = paginationDetails;
  const { count, data } = result;
  return {
    page,
    totalPages: Math.ceil(count / take),
    totalRecords: count,
    limit: take,
    data,
  };
};
