import { DefaultComponentProps } from "../types";
import { Fields } from "../types";


export type Component<
    FieldProps extends DefaultComponentProps = DefaultComponentProps
> = {
    label?: string;
    defaultProps: FieldProps;
    fields?: Fields<FieldProps>;
    reactComponent: React.FC<FieldProps>;
}

export * from "./Text";
export * from "./VerticalSpace";
export * from "./Heading";
export * from "./Button";