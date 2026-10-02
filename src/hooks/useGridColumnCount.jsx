import { useCallback, useEffect, useState } from 'react';

export function useGridColumnCount() {
  const [columnCount, setColumnCount] = useState(0);
  const [gridNode, setGridNode] = useState(null);

  const gridRef = useCallback((node) => {
    setGridNode(node);
  }, []);

  useEffect(() => {
    if (!gridNode) return;

    function updateColumnCount() {
      const style = window.getComputedStyle(gridNode);
      const columns = style.gridTemplateColumns
        .split(' ')
        .filter(Boolean).length;
      setColumnCount(columns);
    }

    updateColumnCount();

    const resizeObserver = new ResizeObserver(updateColumnCount);
    resizeObserver.observe(gridNode);

    return () => resizeObserver.disconnect();
  }, [gridNode]);

  return { gridRef, columnCount };
}
