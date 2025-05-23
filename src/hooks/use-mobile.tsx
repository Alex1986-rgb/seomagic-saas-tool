
import { useMediaQuery } from './use-media-query';

export const useMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

export { useMediaQuery };
