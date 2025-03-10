import { useEffect, useState } from "react";

export function useFormData<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [initialState, _] = useState<T>(initialData);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(JSON.stringify(data) !== JSON.stringify(initialState));
  }, [data, initialState]);

  const updateField = (key: keyof T, value: T[keyof T]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const resetData = () => {
    setData(initialState);
    setIsChanged(false);
  };

  return { data, setData, updateField, isChanged, resetData };
}
