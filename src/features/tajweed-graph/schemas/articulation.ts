import {
  boolean,
  type InferOutput,
  integer,
  minLength,
  number,
  object,
  pipe,
  string,
} from 'valibot';

export const ArticulationAreaSchema = object({
  id: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  isMuhaqqaq: boolean(),
  sortOrder: pipe(number(), integer()),
});

export type ArticulationArea = InferOutput<typeof ArticulationAreaSchema>;

export const ArticulationPointSchema = object({
  id: pipe(number(), integer()),
  areaId: pipe(number(), integer()),
  slug: pipe(string(), minLength(1)),
  sortOrder: pipe(number(), integer()),
});

export type ArticulationPoint = InferOutput<typeof ArticulationPointSchema>;
