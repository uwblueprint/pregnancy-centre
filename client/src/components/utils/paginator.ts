class Paginator<T> {
  pages: Map<number, Array<T>>; // an LRU cache where keys are page indices and values are contents of a page
  pageSize: number; // number of items in a page (in Array<T>)
  cachedLimit: number; // maximum number of pages to keep on hand
  getPageFn: (skip : number, limit : number) => Array<T>; // fn to get a page

  constructor(pageSize : number, getPageFn : (skip : number, limit : number) => Array<T>, cachedLimit? : number) {
    this.pages = new Map(); // NOTE: map maintains key-value pairs in insert order
    this.pageSize = pageSize;
    cachedLimit ? this.cachedLimit = cachedLimit : this.cachedLimit = -1; // if cachedLimit is -1, then no limit
    this.getPageFn = getPageFn;
  }

  getPage(index : number) : Array<T> {
    let page : Array<T> | undefined = this.pages.get(index);

    if (page) { // if pages contains this page
      this.pages.delete(index); // refresh the key position by deleting and reinserting
    } else {
      page = this.getPageFn(index * this.pageSize, this.pageSize)
    }

    this.pages.set(index, page);

    // if we reached the limit (not possible if pages already contained the desired page), then delete the first page in pages
    if (this.pages.size == this.cachedLimit) {
      this.pages.delete(this.pages.keys().next().value);
    }

    return page;
  }
}

export default Paginator;
