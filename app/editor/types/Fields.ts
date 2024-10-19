
type FieldOption = {
  label: string;
  value: string | number | boolean;
};

type FieldOptions = Array<FieldOption>;

export type BaseField = {
  label?: string;
};

export type TextField = BaseField & {
  type: 'text';
};

export type NumberField = BaseField & {
  type: 'number';
  min?: number;
  max?: number;
};

export type TextareaField = BaseField & {
  type: 'textarea';
};

export type SelectField = BaseField & {
  type: 'select';
  options: FieldOptions;
};

export type Fields<T> = {
    [K in keyof T]: Field<T[K]>;
};


export type Field<Props extends any = any> =
  | TextField
  | NumberField
  | TextareaField
  | SelectField;

export type FieldProps<ValueType = any, F = Field<any>> = {
  field: F;
  value: ValueType;
  id?: string;
  onChange: (value: ValueType) => void;
  readOnly?: boolean;
};








