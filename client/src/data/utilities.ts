export function removeTypeName(data: any): any {
  return data.map((d: any) => {
    const { __typename, ...rest } = d;
    return rest;
  });
}
