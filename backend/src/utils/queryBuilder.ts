import type { PipelineStage, Types } from 'mongoose';
import { Types as MongooseTypes } from 'mongoose';

export type SortOrder = 'asc' | 'desc';

export interface BaseQueryOptions {
  search?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: SortOrder | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

type MatchValue =
  | string
  | number
  | boolean
  | Types.ObjectId
  | Date
  | { $gte?: number | Date; $lte?: number | Date }
  | { $in?: (string | Types.ObjectId)[] }
  | { $regex: RegExp; $options?: string };

type MatchConditions = Record<string, MatchValue>;

interface QueryBuilderConfig<TQueryOptions extends BaseQueryOptions> {
  options: TQueryOptions;
  baseMatch?: MatchConditions;
  extraMatch?: MatchConditions;
  searchableFields?: string[];
  useAtlasSearch?: boolean;
  atlasIndex?: string;
  projection?: Record<string, 0 | 1>;
}

export class QueryBuilder<TQueryOptions extends BaseQueryOptions> {
  private options: TQueryOptions;
  private baseMatch: MatchConditions;
  private extraMatch: MatchConditions;
  private searchableFields: string[];
  private useAtlasSearch: boolean;
  private atlasIndex: string;
  private projection: Record<string, 0 | 1> | null;

  constructor(config: QueryBuilderConfig<TQueryOptions>) {
    this.options = config.options;
    this.baseMatch = config.baseMatch || {};
    this.extraMatch = config.extraMatch || {};
    this.searchableFields = config.searchableFields || [];
    this.useAtlasSearch = !!config.useAtlasSearch;
    this.atlasIndex = config.atlasIndex || 'default';
    this.projection = config.projection || null;
  }

  static toObjectId(id?: string | Types.ObjectId): Types.ObjectId | undefined {
    if (!id) return undefined;
    if (id instanceof MongooseTypes.ObjectId) return id;
    if (MongooseTypes.ObjectId.isValid(id)) {
      return new MongooseTypes.ObjectId(id);
    }
    return undefined;
  }

  buildSearchStage(): PipelineStage | null {
    const { search } = this.options;
    if (!search || this.searchableFields.length === 0) return null;

    if (this.useAtlasSearch) {
      return {
        $search: {
          index: this.atlasIndex,
          compound: {
            should: this.searchableFields.map((field, index) => ({
              text: {
                query: search,
                path: field,
                fuzzy: { maxEdits: 1 },
                score: {
                  boost: {
                    value: this.searchableFields.length - index || 1,
                  },
                },
              },
            })),
            minimumShouldMatch: 1,
          },
        },
      } as PipelineStage;
    }

    const orConditions = this.searchableFields.map((field) => ({
      [field]: { $regex: new RegExp(search, 'i') },
    }));

    return {
      $match: {
        $or: orConditions,
      },
    } as PipelineStage;
  }

  buildMatchStage(): PipelineStage {
    const matchConditions: MatchConditions = {
      ...this.baseMatch,
      ...this.extraMatch,
    };

    return { $match: matchConditions };
  }

  buildSortStage(): PipelineStage | null {
    const { search, sortBy = 'createdAt', sortOrder = 'desc' } = this.options;

    if (this.useAtlasSearch && search && sortBy === 'createdAt') {
      return null;
    }

    const sortStage: Record<string, 1 | -1> = {};
    sortStage[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return { $sort: sortStage };
  }

  buildProjectionStage(): PipelineStage | null {
    if (!this.projection) return null;
    return {
      $project: this.projection,
    };
  }

  buildPaginationStage(): PipelineStage {
    const page = this.options.page || 1;
    const limit = this.options.limit || 10;
    const skip = (page - 1) * limit;

    return {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    } as PipelineStage;
  }

  buildPipeline(): PipelineStage[] {
    const pipeline: PipelineStage[] = [];

    const searchStage = this.buildSearchStage();
    if (searchStage) pipeline.push(searchStage);

    pipeline.push(this.buildMatchStage());

    const sortStage = this.buildSortStage();
    if (sortStage) pipeline.push(sortStage);

    const projectionStage = this.buildProjectionStage();
    if (projectionStage) pipeline.push(projectionStage);

    pipeline.push(this.buildPaginationStage());

    return pipeline;
  }
}

