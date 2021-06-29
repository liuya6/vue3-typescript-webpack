const filterCount = (count: number) => {
  return `${Math.floor(count / 10000)}万`;
};

export { filterCount };
