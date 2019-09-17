package js.widget;

public class OrderBy {
	private String fieldName;
	private Direction direction;

	public String getFieldName() {
		return fieldName;
	}

	public String getDirection() {
		return direction.name();
	}

	public static enum Direction {
		NONE, ASC, DESC
	}
}
