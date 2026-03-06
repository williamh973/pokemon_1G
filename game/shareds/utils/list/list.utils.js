export const listSort = (listFilter) => {
  return listFilter.sort((a, b) => a.name.localeCompare(b.name));
};

export const resetList = (list) => {
  list.length = 0;
};
