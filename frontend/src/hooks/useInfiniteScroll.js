import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const useInfiniteScroll = (loadMore, hasMore) => {
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasMore) loadMore();
  }, [inView, hasMore, loadMore]);

  return { ref };
};