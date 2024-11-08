import { DefaultComponentProps } from "./types";
import { Fields } from "./types";

import { Text } from "./Text";
import { VerticalSpace } from "./VerticalSpace";
import { Heading } from "./Heading";
import { Hero } from "./Hero";
import { Button } from "./Button";
import { CustomHtml } from "./CustomHtml";



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
export * from "./Hero";
export * from "./CustomHtml";

export const ComponentMap = {
    Text,
    VerticalSpace,
    Heading,
    Hero,
    Button,
    CustomHtml
}