import { DocumentNode, useApolloClient } from "@apollo/client";
import React, { useEffect, useRef, useState } from 'react';

// Source: https://stackoverflow.com/a/54570068
const useComponentVisible = (initialIsVisible: boolean): {
  ref: React.RefObject<HTMLDivElement>,
  isComponentVisible: boolean,
  setIsComponentVisible: (isVisible: boolean) => void
} => {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef<HTMLDivElement>(null);

  const handleHideDropdown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsComponentVisible(false);
    }
  };

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleHideDropdown, true);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('keydown', handleHideDropdown, true);
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}

// cachedLimit denotes number of pages to keep cached (avoid refetching), if undefined (or < 0) cache everything
// preLoad denotes the number of pages +/- current page to fetch (set to 0 to avoid this functionality)
const usePaginator = (pageSize: number, maxPages: number, query: DocumentNode, cachedLimit?: number, preLoad?: number): {
    getPage: (index: number) => Promise<Array<any>>
} => {
  const pages = useRef(new Map()); // an LRU cache where keys are page indices and values are contents of a page
  const client = useApolloClient();

  const getPage = async (index: number) : Promise<Array<any>> => {
    if (!pages.current) return [];

    for (let i = Math.max(0, index - (preLoad ?? 0)); i < Math.min(index + (preLoad ?? 0), maxPages); i++) {
      if (pages.current.has(i)) { // skip cached pages
        continue;
      }

      let p = [];
      p = await client.query({ 
        query: query,
        variables: { 
          skip: i * pageSize,
          limit: pageSize },
        fetchPolicy: 'network-only'})
        .then((res) => { return res.data.requestGroupsPage })
        .catch(() => { return [] }) as Array<any>;
  
      pages.current.set(i, p);
  
      // if we reached the limit (not possible if pages already contained the desired page), then delete the first page in pages
      if (pages.current.size === Math.max(0, (cachedLimit ? cachedLimit : -1)) + 2 * (preLoad ?? 0)) {
        pages.current.delete(pages.current.keys().next().value);
      }
    }

    return pages.current.get(index) ?? [];
  };

  return { getPage }
}


export { useComponentVisible, usePaginator }
