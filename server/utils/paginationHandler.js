/**
 * Production-ready pagination handler
 * @param {Object} params - Pagination parameters
 * @param {number|string} params.page - Current page number (default: 1)
 * @param {number|string} params.limit - Items per page (default: 10, max: 100)
 * @returns {Object} Pagination configuration with skip and limit
 */
const paginationHandler = ({page = 1, limit = 10}) => {
  try {
    // Parse and validate page number
    const parsedPage = parseInt(page, 10);
    const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    

    const parsedLimit = parseInt(limit, 10);
    const MAX_LIMIT = 100;
    const DEFAULT_LIMIT = 10;
    
    let currentLimit = DEFAULT_LIMIT;
    if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
      currentLimit = Math.min(parsedLimit, MAX_LIMIT);
    }
    
    // Calculate skip value for database query
    const skip = (currentPage - 1) * currentLimit;
    
    return {
      skip,
      limit: currentLimit,
      page: currentPage
    };
  } catch (error) {
    return {
      skip: 0,
      limit: 10,
      page: 1
    };
  }
};

/**
 * Calculate pagination metadata
 * @param {number} totalCount - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Comprehensive pagination metadata
 */
export const calculatePaginationMeta = (totalCount, currentPage, limit) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const safePage = Math.min(currentPage, totalPages);
  
  return {
    totalItems: totalCount,
    totalPages,
    currentPage: safePage,
    itemsPerPage: limit,
    hasPrevPage: safePage > 1,
    hasNextPage: safePage < totalPages,
    prevPage: safePage > 1 ? safePage - 1 : null,
    nextPage: safePage < totalPages ? safePage + 1 : null,
    startIndex: totalCount > 0 ? (safePage - 1) * limit + 1 : 0,
    endIndex: Math.min(safePage * limit, totalCount)
  };
};
export default paginationHandler;
