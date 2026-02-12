// components/cms/FormikSync.tsx
"use client";

import { useEffect } from "react";
import { useFormikContext } from "formik";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (values: any) => void;
}

export default function FormikSync({ onChange }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { values } = useFormikContext<any>();

    useEffect(() => {
        onChange(values);
    }, [values]);

    return null; // no UI
}
