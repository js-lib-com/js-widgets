package js.widget;

import java.util.HashMap;
import java.util.Map;

public class PagingRequest
{
  private int pageIndex;
  private int pageSize;
  private OrderBy orderBy;
  private Map<String, String> filter = new HashMap<>();

  public void setPageIndex(int pageIndex)
  {
    this.pageIndex = pageIndex;
  }

  public int getPageIndex()
  {
    return pageIndex;
  }

  public void setPageSize(int pageSize)
  {
    this.pageSize = pageSize;
  }

  public int getPageSize()
  {
    return pageSize;
  }

  public int getOffset()
  {
    return pageIndex * pageSize;
  }

  public void setOrderBy(OrderBy orderBy)
  {
    this.orderBy = orderBy;
  }

  public OrderBy getOrderBy()
  {
    return orderBy;
  }

  public void setFilter(Map<String, String> filter)
  {
    this.filter = filter;
  }

  public Map<String, String> getFilter()
  {
    return filter;
  }
}
