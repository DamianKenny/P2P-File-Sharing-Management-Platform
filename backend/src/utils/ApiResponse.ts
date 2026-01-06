export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponseData<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
}

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T;
  public readonly meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };

  constructor(
    success: boolean,
    message: string,
    data: T,
    meta?: { pagination?: PaginationMeta; [key: string]: unknown }
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static created<T>(data: T, message = 'Created successfully'): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = 'Success'
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    
    return new ApiResponse(true, message, data, {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }

  toJSON(): ApiResponseData<T> {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
      ...(this.meta && { meta: this.meta }),
    };
  }
}