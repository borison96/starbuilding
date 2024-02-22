package fr.jozait.startbuildingapi.domain.model.project.node;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DataTable {
    private Map<Long, String[]> columns = new HashMap<>(); // (number, (key, type, order, "deleted"))
    private Map<Long, Map<Long, String>> rows = new HashMap<>(); // (number, (columnId, value)) | (number, (0L, "deleted"))

    public Map<Long, String[]> getColumns() {
        if (columns == null) {
            columns = new HashMap<>();
        }
        return columns;
    }

    public void setColumns(Map<Long, String[]> columns) {
        this.columns = columns;
    }

    public Map<Long, Map<Long, String>> getRows() {
        if (rows == null) {
            rows = new HashMap<>();
        }
        return rows;
    }

    public void setRows(Map<Long, Map<Long, String>> rows) {
        this.rows = rows;
    }
    public static String safeColumnName(String name, Map<Long, String[]> colMap) {
        // get all names that start with name
        // parse the endings and keep count
        // append number to the ending
        List<Integer> colNumbers = colMap.values().stream()
                .filter(col -> {
                    if (col.length > 1 && col[0].startsWith(name)) {
                        try {
                            String tail = col[0].substring(name.length()).replace("_", "").trim();
                            if (tail.length() == 0) { return true; }
                            Integer.parseInt(tail);
                            return true;
                        } catch (Exception ignored) {
                            return false;
                        }
                    }
                    return false;
                })
                .map(col -> {
                    String tail = col[0].substring(name.length()).replace("_", "").trim();
                    return tail.length() == 0 ? 0 : Integer.parseInt(tail);
                })
                .collect(Collectors.toList());
        if (colNumbers.size() == 0) {
            return name;
        }
        return name + "_" + (Collections.max(colNumbers) + 1);
    }
}
