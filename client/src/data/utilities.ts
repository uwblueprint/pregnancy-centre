/* eslint-disable */
// TODO(meganniu): remove this file in a future PR

export function removeTypeName(data: any): any {
  return data.map((d: any) => {
    const { __typename, ...rest } = d;
    return rest;
  });
}
