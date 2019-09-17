package js.widget;

import java.util.List;

public class PagingResponse<T>
{
  private int total;
  private List<T> items;

  public void setTotal(int total)
  {
    this.total = total;
  }

  public int getTotal()
  {
    return total;
  }

  public void setItems(List<T> items)
  {
    this.items = items;
  }

  public List<T> getItems()
  {
    return items;
  }
}
