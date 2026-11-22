import {
  boolean,
  type InferOutput,
  integer,
  minLength,
  number,
  object,
  omit,
  pipe,
  string,
} from 'valibot';

export const RemoteArticulationAreaSchema = object({
  id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  is_muhaqqaq: boolean(),
  sort_order: pipe(number(), integer()),
});

export const ArticulationAreaSchema = omit(
  object({
    ...RemoteArticulationAreaSchema.entries,
    isMuhaqqaq: boolean(),
    sortOrder: pipe(number(), integer()),
  }),
  ['is_muhaqqaq', 'sort_order'],
);

export type RemoteArticulationArea = InferOutput<
  typeof RemoteArticulationAreaSchema
>;
export type ArticulationArea = InferOutput<typeof ArticulationAreaSchema>;

export const RemoteArticulationPointSchema = object({
  id: pipe(number(), integer()),
  area_id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  sort_order: pipe(number(), integer()),
});

export const ArticulationPointSchema = omit(
  object({
    ...RemoteArticulationPointSchema.entries,
    areaId: pipe(number(), integer()),
    sortOrder: pipe(number(), integer()),
  }),
  ['area_id', 'sort_order'],
);

export type RemoteArticulationPoint = InferOutput<
  typeof RemoteArticulationPointSchema
>;
export type ArticulationPoint = InferOutput<typeof ArticulationPointSchema>;
